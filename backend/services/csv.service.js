const { parse } = require('csv-parse');

/**
 * Parses a CSV buffer and returns an array of objects representing the rows.
 * @param {Buffer} buffer The uploaded CSV file buffer
 * @returns {Promise<Array>} Array of parsed objects
 */
async function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }, (err, records) => {
      if (err) {
        return reject(err);
      }
      resolve(records);
    });
  });
}

module.exports = {
  parseCsv
};
