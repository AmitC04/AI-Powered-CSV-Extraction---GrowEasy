const Groq = require('groq-sdk');

const MODEL_NAME = 'llama-3.3-70b-versatile';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

// Lazy initialise so that dotenv has time to load
let _groqClient = null;
function getClient() {
  if (!_groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in the environment. Please add it to backend/.env');
    }
    _groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groqClient;
}

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are an expert CRM data extraction engine for GrowEasy.
You receive a JSON array of raw CSV rows. Each row may come from ANY source:
Facebook Ads, Google Ads, Excel exports, Real Estate CRMs, marketing spreadsheets, etc.
The column names will VARY — your job is to intelligently map them to our CRM schema.

=== EXTRACTION RULES ===

FIELD MAPPING INTELLIGENCE:
- "name" can be: full_name, lead_name, contact, first_name+last_name, fname+lname, person, client, customer
- "email" can be: email_address, e-mail, mail, contact_email, user_email
- "mobile_without_country_code" can be: phone, phone_number, mobile, contact_number, cell, tel, number (remove country code if present)
- "country_code" can be: country_calling_code, dial_code, phone_prefix (format as +XX)
- "company" can be: company_name, organisation, organization, business, employer, firm
- "city" can be: town, locality, district
- "state" can be: province, region
- "country" can be: nation, location
- "lead_owner" can be: assigned_to, owner, agent, sales_rep, rep, salesperson
- "crm_status" can be: status, lead_status, stage, disposition
- "crm_note" can be: notes, remarks, comments, feedback, description, follow_up, message
- "data_source" can be: source, campaign, lead_source, utm_source, channel
- "created_at" can be: date, timestamp, submission_date, created_date, date_added

CRM STATUS MAPPING (MUST be one of these exact values or empty string):
- GOOD_LEAD_FOLLOW_UP → for: interested, warm, follow up, callback, potential, prospect, qualified
- DID_NOT_CONNECT → for: no answer, busy, not reachable, voicemail, unreachable, missed, dnc-attempt
- BAD_LEAD → for: not interested, invalid, wrong number, junk, spam, irrelevant, unqualified
- SALE_DONE → for: closed, converted, won, purchased, deal done, sale, onboarded, customer

DATA SOURCE MAPPING (MUST be one of these or empty string):
- leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots

DATE FORMAT:
- created_at must produce a valid result from JavaScript's new Date(value)
- Convert to ISO 8601 if needed (e.g., "2026-05-13T14:20:48")
- If unparseable, leave as-is

SPECIAL HANDLING:
- Multiple emails: Use first as "email", append rest to "crm_note"
- Multiple phones: Use first as "mobile_without_country_code", append rest to "crm_note"
- Extra data: Any unstructured info goes into "crm_note" (remarksm follow-up info, etc.)
- Strip country code from phone number (e.g., "+91 9876543210" → country_code: "+91", mobile: "9876543210")
- If combined name field: Split into full name as "name"
- SKIP records with neither email NOR mobile number

=== OUTPUT FORMAT ===
Return ONLY valid JSON. Root object MUST have key "records" containing an array.
Each record:
{
  "created_at": "string (ISO date or original)",
  "name": "string",
  "email": "string",
  "country_code": "string (e.g. +91)",
  "mobile_without_country_code": "string (digits only)",
  "company": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "lead_owner": "string",
  "crm_status": "GOOD_LEAD_FOLLOW_UP|DID_NOT_CONNECT|BAD_LEAD|SALE_DONE|",
  "crm_note": "string",
  "data_source": "leads_on_demand|meridian_tower|eden_park|varah_swamy|sarjapur_plots|",
  "possession_time": "string",
  "description": "string"
}
Use empty string "" for missing fields. Do NOT include extra fields.
`.trim();

// ── Retry helper ──────────────────────────────────────────────────────────────
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Core batch processor ──────────────────────────────────────────────────────
/**
 * Send a batch of raw CSV rows to the AI and return extracted CRM records.
 * @param {Array<Object>} batch
 * @returns {{ extracted: Array<Object>, skipped: number }}
 */
async function processBatch(batch, attempt = 1) {
  const client = getClient();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Process these ${batch.length} CSV rows and return the extracted CRM records:\n\n${JSON.stringify(batch, null, 2)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.05, // Near-zero for deterministic extraction
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('AI returned an empty response.');

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      throw new Error(`AI returned invalid JSON: ${raw.substring(0, 100)}`);
    }

    let records = parsed.records;
    if (!Array.isArray(records)) {
      // Try to find an array in the response
      records = Object.values(parsed).find(Array.isArray) || [];
    }

    // Post-filter: skip records without email AND mobile
    const valid = [];
    for (const rec of records) {
      const hasEmail  = rec.email  && String(rec.email).trim().length > 0;
      const hasMobile = rec.mobile_without_country_code && String(rec.mobile_without_country_code).trim().length > 0;
      if (hasEmail || hasMobile) {
        valid.push(sanitise(rec));
      }
    }

    const skipped = Math.max(0, batch.length - valid.length);
    return { extracted: valid, skipped };

  } catch (err) {
    const isRetryable = (
      err.status === 429 ||  // Rate limit
      err.status === 503 ||  // Service unavailable
      err.status === 500 ||  // Internal server error
      err.code === 'ECONNRESET' ||
      err.message?.includes('timeout')
    );

    if (isRetryable && attempt < MAX_RETRIES) {
      console.warn(`Batch failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS * attempt}ms…`);
      await sleep(RETRY_DELAY_MS * attempt);
      return processBatch(batch, attempt + 1);
    }

    console.error(`Batch processing failed after ${attempt} attempt(s):`, err.message || err);
    throw err;
  }
}

// ── Sanitise record fields ────────────────────────────────────────────────────
const ALLOWED_FIELDS = [
  'created_at','name','email','country_code','mobile_without_country_code',
  'company','city','state','country','lead_owner','crm_status','crm_note',
  'data_source','possession_time','description',
];

const VALID_CRM_STATUSES = new Set(['GOOD_LEAD_FOLLOW_UP','DID_NOT_CONNECT','BAD_LEAD','SALE_DONE']);
const VALID_DATA_SOURCES  = new Set(['leads_on_demand','meridian_tower','eden_park','varah_swamy','sarjapur_plots']);

function sanitise(rec) {
  const out = {};
  for (const field of ALLOWED_FIELDS) {
    out[field] = rec[field] != null ? String(rec[field]).trim() : '';
  }
  // Enforce enum constraints
  if (!VALID_CRM_STATUSES.has(out.crm_status)) out.crm_status = '';
  if (!VALID_DATA_SOURCES.has(out.data_source)) out.data_source = '';
  return out;
}

module.exports = { processBatch, MODEL_NAME };
