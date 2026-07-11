import React from 'react';
import styles from './Sidebar.module.css';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  MessageSquare,
  UsersRound,
  Network,
  Megaphone,
  MessageCircle,
  PhoneCall,
  Database,
  Webhook,
  Building2
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
          <span className={styles.logoText}>GrowEasy</span>
        </div>
        
        <div className={styles.workspaceSelector}>
          <div className={styles.workspaceIcon}>
            <span className={styles.workspaceInitial}>V</span>
          </div>
          <div className={styles.workspaceInfo}>
            <span className={styles.workspaceName}>VK Test</span>
            <span className={styles.workspaceRole}>OWNER</span>
          </div>
          <span className={styles.chevron}>›</span>
        </div>
      </div>

      <div className={styles.navSection}>
        <div className={styles.sectionTitle}>MAIN</div>
        <nav className={styles.navMenu}>
          <a href="#" className={styles.navItem}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
          <a href="#" className={styles.navItem}>
            <UserPlus size={18} />
            <span>Generate Leads</span>
          </a>
          <a href="#" className={styles.navItem}>
            <Users size={18} />
            <span>Manage Leads</span>
          </a>
          <a href="#" className={styles.navItem}>
            <MessageSquare size={18} />
            <span>Engage Leads</span>
          </a>
        </nav>
      </div>

      <div className={styles.navSection}>
        <div className={styles.sectionTitle}>CONTROL CENTER</div>
        <nav className={styles.navMenu}>
          <a href="#" className={styles.navItem}>
            <UsersRound size={18} />
            <span>Team Members</span>
          </a>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            <Network size={18} />
            <span>Lead Sources</span>
          </a>
          <a href="#" className={styles.navItem}>
            <Megaphone size={18} />
            <span>Ad Accounts</span>
          </a>
          <a href="#" className={styles.navItem}>
            <MessageCircle size={18} />
            <span>WhatsApp Account</span>
          </a>
          <a href="#" className={styles.navItem}>
            <PhoneCall size={18} />
            <span>Tele Calling</span>
          </a>
          <a href="#" className={styles.navItem}>
            <Database size={18} />
            <span>CRM Fields</span>
          </a>
          <a href="#" className={styles.navItem}>
            <Webhook size={18} />
            <span>API Center</span>
          </a>
        </nav>
      </div>

      <div className={styles.navSection} style={{ marginTop: 'auto', marginBottom: 0 }}>
        <nav className={styles.navMenu}>
          <a href="#" className={styles.navItem}>
            <Building2 size={18} />
            <span>Business Center</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
