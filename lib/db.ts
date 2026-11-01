import {
  StaffMember,
  Responsibility,
  DutyAssignment,
  Announcement,
  AuditLogEntry,
  UserSession,
} from './types';

// In-memory persistent state (stored at module scope, preserved across API calls in the Node process)
class DatabaseStore {
  private staff: StaffMember[] = [];
  private responsibilities: Responsibility[] = [];
  private duties: DutyAssignment[] = [];
  private announcements: Announcement[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private sessions: Map<string, UserSession> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.seed();
  }

  private seed() {
    if (this.initialized) return;
    this.initialized = true;

    // 1. Initial Verified Computer Centre Staff
    this.staff = [
      {
        id: 'staff-head',
        fullName: 'Prof. K. R. Sharma',
        designation: 'Head, Computer Centre & Professor',
        department: 'Computer Centre / Dept. of Physical Sciences',
        email: 'head_cc@iisermohali.ac.in',
        phone: '+91 172 229 0150 / Ext. 1050',
        officeLocation: 'Computer Centre Building, 1st Floor, Room 201',
        status: 'active',
        joiningDate: '2012-07-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        isHead: true,
        primaryResponsibilities: [
          'Strategic IT Planning & Policy',
          'High-Level Procurement & Vendor Review',
          'Inter-departmental IT Escalations',
        ],
        secondaryResponsibilities: ['HPC Cluster Oversight'],
        notes: 'Available for urgent escalations and institute-wide IT approvals during office hours.',
      },
      {
        id: 'staff-net-1',
        fullName: 'Mr. Rajesh Verma',
        designation: 'Senior Technical Officer (Network & Cyber Security)',
        department: 'Computer Centre — Infrastructure',
        email: 'rajesh.verma@iisermohali.ac.in',
        phone: '+91 172 229 0152 / Ext. 1052',
        officeLocation: 'Computer Centre Server Room, Ground Floor',
        status: 'active',
        joiningDate: '2015-03-10',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Campus Backbone & Optical Fiber Network',
          'Eduroam & 802.1x Wi-Fi Infrastructure',
          'UTM Firewall & Perimeter Intrusion Prevention',
        ],
        secondaryResponsibilities: ['DNS & Reverse Proxy Services'],
        notes: 'Primary point of contact for campus network switch outages and Eduroam certificates.',
      },
      {
        id: 'staff-hpc-1',
        fullName: 'Dr. Sunita Devi',
        designation: 'Technical Officer (HPC & Cloud Infrastructure)',
        department: 'Computer Centre — High Performance Computing',
        email: 'sunita.devi@iisermohali.ac.in',
        phone: '+91 172 229 0153 / Ext. 1053',
        officeLocation: 'HPC Data Center Lab, CC Building Room 108',
        status: 'active',
        joiningDate: '2017-09-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:30 AM - 06:00 PM',
        primaryResponsibilities: [
          'Supercomputing Cluster & Slurm Queue',
          'Scientific Software Modules & GPU Nodes',
          'Data Backup & Disaster Recovery SAN',
        ],
        secondaryResponsibilities: ['Server Virtualization (VMware/Proxmox)'],
        notes: 'Manages user allocations on Param-class and institutional compute partitions.',
      },
      {
        id: 'staff-labs-1',
        fullName: 'Mr. Gurpreet Singh',
        designation: 'Technical Assistant (Computer Laboratories)',
        department: 'Computer Centre — User Services',
        email: 'gurpreet.singh@iisermohali.ac.in',
        phone: '+91 172 229 0154 / Ext. 1054',
        officeLocation: 'Central Computing Lab 1 (CC-103)',
        status: 'active',
        joiningDate: '2019-01-15',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: '08:30 AM - 05:00 PM',
        primaryResponsibilities: [
          'Student Computing Labs (CC Lab 1 & 2)',
          'Linux & Windows Dual-Boot Workstations',
          'Institute Printing & Quota Management',
        ],
        secondaryResponsibilities: ['Smart Classroom AV Support'],
        notes: 'Oversees student terminals, lab software installations, and lab booking schedule.',
      },
      {
        id: 'staff-web-1',
        fullName: 'Ms. Ananya Roy',
        designation: 'Senior Web & Application Developer',
        department: 'Computer Centre — Systems & Web',
        email: 'ananya.roy@iisermohali.ac.in',
        phone: '+91 172 229 0155 / Ext. 1055',
        officeLocation: 'CC Building Room 105',
        status: 'active',
        joiningDate: '2020-11-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Institute Web Portal & Departmental Sites',
          'Academic ERP, Grade Entry & Student Records',
          'Biometric & ID Card Integration API',
        ],
        secondaryResponsibilities: ['Email Services & Distribution Lists'],
        notes: 'Maintains institutional content management, web security patches, and ERP modules.',
      },
      {
        id: 'staff-hw-1',
        fullName: 'Mr. Vikram Thakur',
        designation: 'Junior Engineer (Hardware & Maintenance)',
        department: 'Computer Centre — Field Engineering',
        email: 'vikram.thakur@iisermohali.ac.in',
        phone: '+91 172 229 0156 / Ext. 1056',
        officeLocation: 'Hardware Workshop, CC Ground Floor',
        status: 'active',
        joiningDate: '2021-04-10',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Desktop PC Diagnostic & Component Replacement',
          'Smart Classroom Projectors & Audio Systems',
          'Hostel LAN Port & Cabling Repairs',
        ],
        secondaryResponsibilities: ['Lab Workstation Upgrades'],
        notes: 'Handles physical dispatch tickets for faculty offices and student hostel LAN drops.',
      },
    ];

    // 2. Initial Responsibilities / Service Catalogue
    this.responsibilities = [
      {
        id: 'resp-wifi',
        title: 'Campus Wi-Fi & Eduroam Authentication',
        description: 'Administration of indoor and outdoor Aruba/Cisco access points across hostels, academic blocks, dining halls, and guest houses. Configures 802.1x RADIUS authentication.',
        category: 'Network & Security',
        escalationProcedure: 'File ticket at cc-support@iisermohali.ac.in; emergency contact Ext. 1052.',
        status: 'active',
        keywords: ['wifi', 'wireless', 'eduroam', 'internet', 'ssids', 'radius', 'login', 'hostel internet'],
      },
      {
        id: 'resp-hpc',
        title: 'HPC Cluster & Scientific Compute Nodes',
        description: 'Cluster management, Slurm job scheduling, MPI/CUDA compiler environments, and high-throughput research computing support for physics, chemistry, biology, and math.',
        category: 'HPC & Infrastructure',
        escalationProcedure: 'Email hpc-admin@iisermohali.ac.in with Slurm Job ID and node error log.',
        status: 'active',
        keywords: ['hpc', 'cluster', 'supercomputer', 'slurm', 'gpu', 'cuda', 'queue', 'nodes', 'mpi'],
      },
      {
        id: 'resp-email',
        title: 'Institutional Email & Identity Services',
        description: 'Creation, password recovery, group aliases, and SPF/DKIM validation for @iisermohali.ac.in mailboxes, faculty lists, and departmental distribution accounts.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Contact Computer Centre helpdesk with verification ID.',
        status: 'active',
        keywords: ['email', 'mail', 'mailbox', 'gmail', 'office365', 'spam', 'quota', 'outlook'],
      },
      {
        id: 'resp-labs',
        title: 'Central Computer Labs & Thin Clients',
        description: 'Upkeep of 120+ dual-boot Linux/Windows machines in CC Lab 1 and CC Lab 2. Used for academic practicals, semester examinations, and workshop training.',
        category: 'End-User & Computer Labs',
        escalationProcedure: 'Approach Lab Assistant in Room CC-103 or call Ext. 1054.',
        status: 'active',
        keywords: ['lab', 'computer laboratory', 'dual boot', 'ubuntu', 'windows', 'exam lab', 'workstations'],
      },
      {
        id: 'resp-erp',
        title: 'Institute Academic ERP & Online Portals',
        description: 'Maintenance of course registration, student grade submission, faculty portal, online fee payments, and admissions management database.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Submit ERP grievance via intranet portal or contact Ext. 1055.',
        status: 'active',
        keywords: ['erp', 'portal', 'grades', 'course registration', 'fees', 'transcripts', 'academic portal'],
      },
      {
        id: 'resp-hardware',
        title: 'Faculty & Office Desktop Diagnostics',
        description: 'On-site hardware troubleshooting, RAM/SSD replacements, OS reinstallations, and peripheral drivers for institutional desktops and printers.',
        category: 'Hardware & Classrooms',
        escalationProcedure: 'Submit hardware service request form at CC Room 102.',
        status: 'active',
        keywords: ['hardware', 'desktop', 'printer', 'repair', 'monitor', 'keyboard', 'cpu', 'bsod'],
      },
      {
        id: 'resp-classroom',
        title: 'Smart Classrooms, Audio-Visual & Lecture Theatres',
        description: 'Maintenance of interactive displays, ceiling beam projectors, wireless microphones, and hybrid lecture recording systems in LHC 101-108.',
        category: 'Hardware & Classrooms',
        escalationProcedure: 'Urgent assistance during lecture: call AV hotline Ext. 1056.',
        status: 'active',
        keywords: ['classroom', 'projector', 'av', 'audio', 'mic', 'lecture hall', 'lhc', 'smart board'],
      },
      {
        id: 'resp-firewall',
        title: 'Perimeter Firewall, VPN & Threat Monitoring',
        description: 'Management of dual redundant Fortinet UTM firewalls, external IP NATing, faculty off-campus SSL-VPN access, and security vulnerability patching.',
        category: 'Network & Security',
        escalationProcedure: 'Direct escalation to Senior Technical Officer & Head CC.',
        status: 'active',
        keywords: ['firewall', 'vpn', 'remote access', 'security', 'threat', 'blocked site', 'ssl vpn'],
      },
    ];

    // 3. Initial Duty Assignments Across Weekdays
    this.duties = [
      // Monday
      {
        id: 'duty-mon-1',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-wifi',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Conduct weekly AP health sweep across Hostel 5 to 8.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-2',
        staffId: 'staff-hpc-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Monday',
        startTime: '09:30',
        endTime: '18:00',
        assignmentType: 'primary',
        notes: 'Slurm queue priority adjustment and storage scrub.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-3',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Monday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'CC Lab 1 opening & BIOS security checks.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-4',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-classroom',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Morning inspection of LHC Lecture Halls 1-4.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-5',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-erp',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'ERP batch backups and attendance sync.',
        effectiveFrom: '2026-01-01',
      },

      // Tuesday
      {
        id: 'duty-tue-1',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-firewall',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'UTM firmware audit and IPS rule tuning.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-2',
        staffId: 'staff-hpc-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Tuesday',
        startTime: '09:30',
        endTime: '18:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-3',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Tuesday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-4',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-hardware',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Scheduled desktop maintenance in Academic Block 1.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-5',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-email',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },

      // Wednesday
      {
        id: 'duty-wed-1',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-wifi',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-2',
        staffId: 'staff-hpc-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Wednesday',
        startTime: '09:30',
        endTime: '18:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-3',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Wednesday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-4',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-classroom',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-5',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-erp',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },

      // Thursday
      {
        id: 'duty-thu-1',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-firewall',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-2',
        staffId: 'staff-hpc-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Thursday',
        startTime: '09:30',
        endTime: '18:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-3',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Thursday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-4',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-hardware',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-5',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-email',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },

      // Friday
      {
        id: 'duty-fri-1',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-wifi',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-2',
        staffId: 'staff-hpc-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Friday',
        startTime: '09:30',
        endTime: '18:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-3',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Friday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-4',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-classroom',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-5',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-erp',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        effectiveFrom: '2026-01-01',
      },

      // Saturday (Duty Coverage for Labs and Emergency Network)
      {
        id: 'duty-sat-1',
        staffId: 'staff-labs-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Saturday',
        startTime: '09:00',
        endTime: '14:00',
        assignmentType: 'primary',
        notes: 'Weekend lab shift for project students.',
        effectiveFrom: '2026-01-01',
      },

      // Backup Assignments
      {
        id: 'duty-backup-1',
        staffId: 'staff-hw-1',
        responsibilityId: 'resp-labs',
        dayOfWeek: 'Monday',
        startTime: '13:00',
        endTime: '17:00',
        assignmentType: 'secondary',
        notes: 'Backup coverage during lab assistant lunch/rounds.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-backup-2',
        staffId: 'staff-net-1',
        responsibilityId: 'resp-hpc',
        dayOfWeek: 'Wednesday',
        startTime: '14:00',
        endTime: '17:30',
        assignmentType: 'secondary',
        notes: 'Backup network node connectivity check.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-backup-3',
        staffId: 'staff-web-1',
        responsibilityId: 'resp-wifi',
        dayOfWeek: 'Friday',
        startTime: '14:00',
        endTime: '17:30',
        assignmentType: 'secondary',
        notes: 'Secondary coverage for captive portal login inquiries.',
        effectiveFrom: '2026-01-01',
      },
    ];

    // 4. Institutional Announcements
    this.announcements = [
      {
        id: 'ann-1',
        title: 'Core Switch Maintenance & Central Library Wi-Fi Upgrade',
        content: 'The Computer Centre will be performing an optical link maintenance on Saturday from 11:00 PM to 02:00 AM. Intermittent connectivity to eduroam in the Central Library and Academic Block 2 may occur.',
        priority: 'high',
        authorName: 'Prof. K. R. Sharma (Head, Computer Centre)',
        authorEmail: 'head_cc@iisermohali.ac.in',
        createdAt: new Date().toISOString(),
        active: true,
      },
      {
        id: 'ann-2',
        title: 'Scheduled Slurm HPC Queue Reboot for Kernel Updates',
        content: 'GPU Partition nodes (nodes 10-18) will be drained and rebooted on Wednesday at 06:00 AM. Please ensure active checkpoints are saved.',
        priority: 'normal',
        authorName: 'Dr. Sunita Devi (HPC In-Charge)',
        authorEmail: 'sunita.devi@iisermohali.ac.in',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        active: true,
      },
      {
        id: 'ann-3',
        title: 'New Eduroam Certificate Installation Guidelines',
        content: 'All faculty and student devices connecting to IISER Mohali Wi-Fi are requested to re-download the DigiCert Global Root CA certificate from the intranet portal if experiencing authentication prompts.',
        priority: 'low',
        authorName: 'Mr. Rajesh Verma (Network In-Charge)',
        authorEmail: 'rajesh.verma@iisermohali.ac.in',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        active: true,
      },
    ];

    // 5. Initial Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        adminEmail: 'head_cc@iisermohali.ac.in',
        action: 'UPDATE',
        entityType: 'duty_assignment',
        entityId: 'duty-sat-1',
        summary: 'Updated Saturday laboratory shift timing for Mr. Gurpreet Singh (09:00 - 14:00)',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'log-2',
        adminEmail: 'head_cc@iisermohali.ac.in',
        action: 'CREATE',
        entityType: 'announcement',
        entityId: 'ann-1',
        summary: 'Published announcement: Core Switch Maintenance & Central Library Wi-Fi Upgrade',
        timestamp: new Date().toISOString(),
      },
    ];
  }

  // Staff methods
  public getStaff(includeArchived = false): StaffMember[] {
    if (includeArchived) return [...this.staff];
    return this.staff.filter((s) => s.status !== 'archived');
  }

  public getStaffById(id: string): StaffMember | undefined {
    return this.staff.find((s) => s.id === id);
  }

  public addStaff(member: StaffMember, adminEmail: string): StaffMember {
    this.staff.push(member);
    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'CREATE',
      entityType: 'staff',
      entityId: member.id,
      summary: `Added new staff member: ${member.fullName} (${member.designation})`,
      timestamp: new Date().toISOString(),
    });
    return member;
  }

  public updateStaff(id: string, updates: Partial<StaffMember>, adminEmail: string): StaffMember | null {
    const idx = this.staff.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const old = this.staff[idx];
    const updated = { ...old, ...updates };
    this.staff[idx] = updated;

    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'UPDATE',
      entityType: 'staff',
      entityId: id,
      summary: `Updated profile details for: ${updated.fullName}`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  public archiveStaff(id: string, adminEmail: string): boolean {
    const staff = this.getStaffById(id);
    if (!staff) return false;
    staff.status = 'archived';

    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'ARCHIVE',
      entityType: 'staff',
      entityId: id,
      summary: `Archived staff member: ${staff.fullName} (Historical duty records preserved)`,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // Responsibilities
  public getResponsibilities(includeArchived = false): Responsibility[] {
    if (includeArchived) return [...this.responsibilities];
    return this.responsibilities.filter((r) => r.status !== 'archived');
  }

  public addResponsibility(resp: Responsibility, adminEmail: string): Responsibility {
    this.responsibilities.push(resp);
    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'CREATE',
      entityType: 'responsibility',
      entityId: resp.id,
      summary: `Created responsibility: "${resp.title}" under ${resp.category}`,
      timestamp: new Date().toISOString(),
    });
    return resp;
  }

  public updateResponsibility(id: string, updates: Partial<Responsibility>, adminEmail: string): Responsibility | null {
    const idx = this.responsibilities.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...this.responsibilities[idx], ...updates };
    this.responsibilities[idx] = updated;

    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'UPDATE',
      entityType: 'responsibility',
      entityId: id,
      summary: `Updated responsibility: "${updated.title}"`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  // Duties
  public getDuties(): DutyAssignment[] {
    return [...this.duties];
  }

  public addDuty(duty: DutyAssignment, adminEmail: string): DutyAssignment {
    this.duties.push(duty);
    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'ASSIGN_DUTY',
      entityType: 'duty_assignment',
      entityId: duty.id,
      summary: `Assigned duty for ${duty.dayOfWeek} (${duty.startTime}-${duty.endTime})`,
      timestamp: new Date().toISOString(),
    });
    return duty;
  }

  public updateDuty(id: string, updates: Partial<DutyAssignment>, adminEmail: string): DutyAssignment | null {
    const idx = this.duties.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    const updated = { ...this.duties[idx], ...updates };
    this.duties[idx] = updated;

    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'UPDATE',
      entityType: 'duty_assignment',
      entityId: id,
      summary: `Updated duty assignment on ${updated.dayOfWeek}`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  public deleteDuty(id: string, adminEmail: string): boolean {
    const idx = this.duties.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    const removed = this.duties.splice(idx, 1)[0];

    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'UNASSIGN_DUTY',
      entityType: 'duty_assignment',
      entityId: id,
      summary: `Removed duty assignment on ${removed.dayOfWeek}`,
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return [...this.announcements].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addAnnouncement(ann: Announcement, adminEmail: string): Announcement {
    this.announcements.unshift(ann);
    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'CREATE',
      entityType: 'announcement',
      entityId: ann.id,
      summary: `Published announcement: "${ann.title}"`,
      timestamp: new Date().toISOString(),
    });
    return ann;
  }

  public deleteAnnouncement(id: string, adminEmail: string): boolean {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const removed = this.announcements.splice(idx, 1)[0];
    this.addAuditLog({
      id: `log-${Date.now()}`,
      adminEmail,
      action: 'DELETE',
      entityType: 'announcement',
      entityId: id,
      summary: `Deleted announcement: "${removed.title}"`,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(entry: AuditLogEntry) {
    this.auditLogs.unshift(entry);
    // Keep last 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
  }

  // Sessions
  public setSession(token: string, session: UserSession) {
    this.sessions.set(token, session);
  }

  public getSession(token: string): UserSession | undefined {
    return this.sessions.get(token);
  }

  public deleteSession(token: string) {
    this.sessions.delete(token);
  }
}

// Global singleton across hot-reloads and API invocations
const globalForDb = globalThis as unknown as { __iiser_portal_db?: DatabaseStore };
export const db = globalForDb.__iiser_portal_db ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.__iiser_portal_db = db;
