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

    // 1. Official IISER Mohali Computer Centre Personnel (from iisermohali.ac.in)
    this.staff = [
      {
        id: 'staff-head',
        fullName: 'Dr. Satyajit Jena',
        designation: 'Faculty In-Charge, Computer Centre & Associate Professor',
        department: 'Computer Centre / Dept. of Physical Sciences',
        email: 'headcc@iisermohali.ac.in',
        phone: '+91-172-2240266 / 2240124',
        officeLocation: 'Computer Centre, Informatics Centre (Central Library Bldg)',
        status: 'active',
        joiningDate: '2014-07-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        isHead: true,
        primaryResponsibilities: [
          'Overall Supervision & IT Policy of Computer Centre',
          'Convener, High Performance Computing (HPC) Facility',
          'Institute IT Infrastructure, Procurement & Escalations',
        ],
        secondaryResponsibilities: ['Department of Physical Sciences Faculty'],
        notes: 'For day-to-day technical support, users are advised to raise a ticket on the CC Ticketing System or contact the designated technical staff member directly before escalating to Head CC.',
      },
      {
        id: 'staff-sto-ciso',
        fullName: 'Er. Garima Kaushik',
        designation: 'Senior Technical Officer & Chief Information Security Officer (CISO)',
        department: 'Computer Centre — Cyber Security & Data Center',
        email: 'garima@iisermohali.ac.in',
        phone: '+91-172-2240266 (Data Center)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2015-03-10',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Cyber Security & CISO Compliance',
          'Data Center & Computational Servers (HPC)',
          'Resource Planning & Infrastructure',
          'Google Admin & Network Administration',
        ],
        secondaryResponsibilities: ['Firewall & Cert-In Security Advisories'],
        notes: 'Senior Technical Officer and designated Chief Information Security Officer (CISO) for IISER Mohali.',
      },
      {
        id: 'staff-sta-web',
        fullName: 'Mrs. Sangeetha Gurusamy',
        designation: 'Senior Technical Assistant',
        department: 'Computer Centre — Web Applications & Servers',
        email: 'sangeetha@iisermohali.ac.in',
        phone: '+91-172-2240266 (Web & Server Cell)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2016-08-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Web Applications & Server Administration',
          'Institute Website & Portal Infrastructure',
          'Hosted Application Servers & SSL Certificates',
        ],
        secondaryResponsibilities: ['Database & Intranet Administration'],
        notes: 'Primary point of contact for institutional web applications and production server administration.',
      },
      {
        id: 'staff-ta-net',
        fullName: 'Mr. Ramesh Kumar',
        designation: 'Technical Assistant',
        department: 'Computer Centre — Network & Google Workspace',
        email: 'ramesh@iisermohali.ac.in',
        phone: '+91-172-2240266 (Network Helpdesk)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2017-04-12',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Campus Network Administration (LAN & Wi-Fi)',
          'Google Workspace Manager (@iisermohali.ac.in)',
          'Core Switches, Routing & Optical Fiber Links',
        ],
        secondaryResponsibilities: ['IP Allocation & VLAN Management'],
        notes: 'Contact for campus network administration, switch connectivity, and Google Workspace account management.',
      },
      {
        id: 'staff-jta-erp',
        fullName: 'Mr. Virpartap Singh',
        designation: 'Junior Technical Assistant',
        department: 'Computer Centre — Web Content & ERP Support',
        email: 'virpartap@iisermohali.ac.in',
        phone: '+91-172-2240266 (ERP & Web Cell)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2019-06-15',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Institute Website Content Updates',
          'ERP User Support & Module Assistance',
          'Tenders, Recruitment & Circular Uploads',
        ],
        secondaryResponsibilities: ['Faculty Profile & Departmental Page Updates'],
        notes: 'Handles official website content publishing and end-user ERP troubleshooting.',
      },
      {
        id: 'staff-jta-lms',
        fullName: 'Mr. Sumeet Kumar',
        designation: 'Junior Technical Assistant',
        department: 'Computer Centre — Moodle LMS & eSmarth ERP',
        email: 'sumeetk@iisermohali.ac.in',
        phone: '+91-172-2240266 (LMS & eSmarth)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2020-02-10',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Moodle LMS User Support & Course Enrolment',
          'eSmarth (Samarth ERP) Installation & User Support',
          'Academic Portal & Examination LMS Setup',
        ],
        secondaryResponsibilities: ['ERP Module Configuration'],
        notes: 'Primary contact for Moodle course management and eSmarth/Samarth ERP installation and user queries.',
      },
      {
        id: 'staff-lab-1',
        fullName: 'Mr. Ram Shankar Maurya',
        designation: 'Lab Assistant',
        department: 'Computer Centre — Teaching Labs & Data Center',
        email: 'oscc1@iisermohali.ac.in',
        phone: '+91-172-2240266 (Teaching Lab)',
        officeLocation: 'Teaching Computer Lab, Informatics Centre',
        status: 'active',
        joiningDate: '2018-09-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: '08:30 AM - 05:00 PM',
        primaryResponsibilities: [
          'Teaching Computer Labs Management',
          'Infrastructure & Data Center Support',
          'Student Workstations & Practical Lab Readiness',
        ],
        secondaryResponsibilities: ['UPS & Server Room Environmental Checks'],
        notes: 'Manages instructional computing laboratories for BS-MS/PhD practicals and provides data center support.',
      },
      {
        id: 'staff-web-lib',
        fullName: 'Mr. Sunny Dhiman',
        designation: 'Web Designer',
        department: 'Computer Centre — Library Servers & Workspace',
        email: 'oscc5@iisermohali.ac.in',
        phone: '+91-172-2240266 (Library & Workspace)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2020-11-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'KOHA & DSpace Library Server Support',
          'Google Workspace Manager & Email Support',
          'Infrastructure & Data Center Support',
        ],
        secondaryResponsibilities: ['Web Design & UI Maintenance'],
        notes: 'Administers KOHA/DSpace servers for the Central Library, Google Workspace accounts, and data center operations.',
      },
      {
        id: 'staff-tech-net',
        fullName: 'Mr. Gurjot Singh',
        designation: 'Lab Technician',
        department: 'Computer Centre — Campus Network Support',
        email: 'oscc3@iisermohali.ac.in',
        phone: '+91-172-2240266 (Network Field Desk)',
        officeLocation: 'Computer Centre, Informatics Centre Building',
        status: 'active',
        joiningDate: '2021-04-10',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: '09:00 AM - 05:30 PM',
        primaryResponsibilities: [
          'Campus Network Support & LAN Troubleshooting',
          'Academic Block, Lab & Hostel Switch Maintenance',
          'Wi-Fi Access Point & Network Cabling Repairs',
        ],
        secondaryResponsibilities: ['Field Network Diagnostics'],
        notes: 'Handles on-site network troubleshooting across academic blocks, labs, and hostels.',
      },
    ];

    // 2. Authentic IISER Mohali Service Divisions & Responsibilities
    this.responsibilities = [
      {
        id: 'resp-cyber-dc',
        title: 'Cyber Security (CISO), Data Center & Computational Servers',
        description: 'Management of the IISER Mohali Data Center, computational servers (HPC), resource planning, firewall security policies, and CERT-In cyber security compliance.',
        category: 'HPC & Infrastructure',
        escalationProcedure: 'Contact Er. Garima Kaushik (garima@iisermohali.ac.in) or escalate to Dr. Satyajit Jena (headcc@iisermohali.ac.in).',
        status: 'active',
        keywords: ['cyber security', 'ciso', 'data center', 'hpc', 'computational servers', 'firewall', 'security', 'garima', 'cluster'],
      },
      {
        id: 'resp-network',
        title: 'Campus Network Administration, Wi-Fi & LAN Support',
        description: 'Administration of campus-wide optical backbone, core/distribution switches, Wi-Fi access points, and LAN port troubleshooting across academic buildings, hostels, and the Informatics Centre.',
        category: 'Network & Security',
        escalationProcedure: 'Log a ticket on the CC Ticketing System or contact Mr. Ramesh Kumar (ramesh@iisermohali.ac.in) / Mr. Gurjot Singh (oscc3@iisermohali.ac.in).',
        status: 'active',
        keywords: ['network', 'wifi', 'wi-fi', 'lan', 'internet', 'switch', 'ethernet', 'ramesh', 'gurjot', 'hostel internet'],
      },
      {
        id: 'resp-gworkspace',
        title: 'Google Workspace & Institute Email (@iisermohali.ac.in)',
        description: 'Creation, password reset, two-step verification recovery, mailing lists, and quota management for official @iisermohali.ac.in Google Workspace accounts.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Contact Mr. Ramesh Kumar (ramesh@iisermohali.ac.in), Mr. Sunny Dhiman (oscc5@iisermohali.ac.in), or Er. Garima Kaushik (garima@iisermohali.ac.in).',
        status: 'active',
        keywords: ['email', 'google', 'workspace', 'gmail', 'password', 'mail', 'account', 'ramesh', 'sunny', 'garima'],
      },
      {
        id: 'resp-web-servers',
        title: 'Web Applications, Server Admin & Institute Website Updates',
        description: 'Administration of IISER Mohali web servers, intranet portals, and publishing of official notices, tenders, recruitment advertisements, and faculty profile updates on iisermohali.ac.in.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Contact Mrs. Sangeetha Gurusamy (sangeetha@iisermohali.ac.in) for server/app admin or Mr. Virpartap Singh (virpartap@iisermohali.ac.in) for content updates.',
        status: 'active',
        keywords: ['website', 'web', 'server', 'portal', 'content', 'tender', 'notice', 'sangeetha', 'virpartap'],
      },
      {
        id: 'resp-erp-esmarth',
        title: 'Samarth / eSmarth ERP Installation & User Support',
        description: 'Deployment, module configuration, and user support for the institute ERP and eSmarth (Samarth) administrative & academic management systems.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Contact Mr. Sumeet Kumar (sumeetk@iisermohali.ac.in) or Mr. Virpartap Singh (virpartap@iisermohali.ac.in).',
        status: 'active',
        keywords: ['erp', 'esmarth', 'samarth', 'leave', 'payroll', 'finance', 'admin portal', 'sumeet', 'virpartap'],
      },
      {
        id: 'resp-moodle',
        title: 'Moodle LMS User Support & Course Administration',
        description: 'Administration of the IISER Mohali Moodle Learning Management System, semester course creation, student/faculty enrolment, and online quiz/assignment support.',
        category: 'Web & Academic Portals',
        escalationProcedure: 'Contact Mr. Sumeet Kumar (sumeetk@iisermohali.ac.in) via email or the CC Ticketing System.',
        status: 'active',
        keywords: ['moodle', 'lms', 'courses', 'quiz', 'assignment', 'academic', 'sumeet'],
      },
      {
        id: 'resp-koha-dspace',
        title: 'KOHA & DSpace Central Library Server Support',
        description: 'Server maintenance, database backups, and technical support for the Central Library KOHA Integrated Library System and DSpace Institutional Repository.',
        category: 'HPC & Infrastructure',
        escalationProcedure: 'Contact Mr. Sunny Dhiman (oscc5@iisermohali.ac.in) or Mrs. Sangeetha Gurusamy (sangeetha@iisermohali.ac.in).',
        status: 'active',
        keywords: ['koha', 'dspace', 'library', 'repository', 'opac', 'sunny'],
      },
      {
        id: 'resp-teaching-labs',
        title: 'Teaching Computer Laboratories & Workstation Support',
        description: 'Management of the Teaching Computer Labs in the Informatics Centre, Linux/Windows workstation maintenance, software packages for BS-MS lab courses, and data center assistance.',
        category: 'End-User & Computer Labs',
        escalationProcedure: 'Contact Mr. Ram Shankar Maurya (oscc1@iisermohali.ac.in) in the Teaching Computer Lab.',
        status: 'active',
        keywords: ['lab', 'teaching lab', 'computer lab', 'workstations', 'linux', 'ubuntu', 'ram shankar', 'oscc1'],
      },
    ];

    // 3. Weekly Duty Assignments (Monday - Saturday)
    this.duties = [
      // Monday
      {
        id: 'duty-mon-1',
        staffId: 'staff-sto-ciso',
        responsibilityId: 'resp-cyber-dc',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Data Center server health review, HPC cluster status & CISO security audit.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-2',
        staffId: 'staff-ta-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Core switch monitoring, VLAN management & campus Wi-Fi controller checks.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-3',
        staffId: 'staff-tech-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'secondary',
        notes: 'Field LAN troubleshooting across Academic Blocks and Hostels.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-4',
        staffId: 'staff-sta-web',
        responsibilityId: 'resp-web-servers',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Web application server administration and database backups.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-5',
        staffId: 'staff-jta-lms',
        responsibilityId: 'resp-moodle',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Moodle LMS user support and eSmarth ERP ticket resolution.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-mon-6',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Monday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'Teaching Computer Lab readiness for morning and afternoon practical sessions.',
        effectiveFrom: '2026-01-01',
      },

      // Tuesday
      {
        id: 'duty-tue-1',
        staffId: 'staff-sto-ciso',
        responsibilityId: 'resp-cyber-dc',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Resource planning, firewall log inspection & computational server administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-2',
        staffId: 'staff-ta-net',
        responsibilityId: 'resp-gworkspace',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Google Workspace directory updates, group aliases & network administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-3',
        staffId: 'staff-web-lib',
        responsibilityId: 'resp-koha-dspace',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'KOHA & DSpace library server maintenance and Google Workspace user support.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-4',
        staffId: 'staff-jta-erp',
        responsibilityId: 'resp-erp-esmarth',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'ERP user support and website content updates (tenders/circulars).',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-tue-5',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Tuesday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'Teaching lab supervision and data center physical infrastructure check.',
        effectiveFrom: '2026-01-01',
      },

      // Wednesday
      {
        id: 'duty-wed-1',
        staffId: 'staff-sto-ciso',
        responsibilityId: 'resp-cyber-dc',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Data Center & HPC server supervision.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-2',
        staffId: 'staff-ta-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Campus backbone routing & wireless access point administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-3',
        staffId: 'staff-sta-web',
        responsibilityId: 'resp-web-servers',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Web server security patching and portal administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-4',
        staffId: 'staff-jta-lms',
        responsibilityId: 'resp-erp-esmarth',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'eSmarth installation support and Moodle LMS administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-wed-5',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Wednesday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'Teaching Computer Labs management.',
        effectiveFrom: '2026-01-01',
      },

      // Thursday
      {
        id: 'duty-thu-1',
        staffId: 'staff-sto-ciso',
        responsibilityId: 'resp-cyber-dc',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Cyber security compliance & Google Admin console oversight.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-2',
        staffId: 'staff-tech-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Campus LAN switch maintenance and rack inspection.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-3',
        staffId: 'staff-jta-erp',
        responsibilityId: 'resp-web-servers',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'secondary',
        notes: 'Institute website content updates and ERP user desk.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-4',
        staffId: 'staff-web-lib',
        responsibilityId: 'resp-gworkspace',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Google Workspace user tickets and KOHA/DSpace server checks.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-thu-5',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Thursday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'Teaching Labs & Data Center support.',
        effectiveFrom: '2026-01-01',
      },

      // Friday
      {
        id: 'duty-fri-1',
        staffId: 'staff-sto-ciso',
        responsibilityId: 'resp-cyber-dc',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Weekly Data Center backup verification and security review.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-2',
        staffId: 'staff-ta-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Campus network & Google Workspace administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-3',
        staffId: 'staff-sta-web',
        responsibilityId: 'resp-web-servers',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Web applications & server administration.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-4',
        staffId: 'staff-jta-lms',
        responsibilityId: 'resp-moodle',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:30',
        assignmentType: 'primary',
        notes: 'Moodle LMS & eSmarth weekly support rollup.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-fri-5',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Friday',
        startTime: '08:30',
        endTime: '17:00',
        assignmentType: 'primary',
        notes: 'Weekly workstation image & OS maintenance in Teaching Labs.',
        effectiveFrom: '2026-01-01',
      },

      // Saturday (Weekend Lab & Network Coverage)
      {
        id: 'duty-sat-1',
        staffId: 'staff-lab-1',
        responsibilityId: 'resp-teaching-labs',
        dayOfWeek: 'Saturday',
        startTime: '09:00',
        endTime: '14:00',
        assignmentType: 'primary',
        notes: 'Saturday Teaching Lab & Data Center monitoring shift.',
        effectiveFrom: '2026-01-01',
      },
      {
        id: 'duty-sat-2',
        staffId: 'staff-tech-net',
        responsibilityId: 'resp-network',
        dayOfWeek: 'Saturday',
        startTime: '09:00',
        endTime: '14:00',
        assignmentType: 'primary',
        notes: 'Saturday campus network & hostel LAN support.',
        effectiveFrom: '2026-01-01',
      },
    ];

    // 4. Institutional Announcements
    this.announcements = [
      {
        id: 'ann-1',
        title: 'Use of CC Ticketing System for Network, ERP & Email Support',
        content: 'All faculty, staff, and students are requested to log technical support requests via the IISER Mohali CC Ticketing System or contact the designated section staff listed in this directory.',
        priority: 'high',
        authorName: 'Dr. Satyajit Jena (Faculty In-Charge, Computer Centre)',
        authorEmail: 'headcc@iisermohali.ac.in',
        createdAt: new Date().toISOString(),
        active: true,
      },
      {
        id: 'ann-2',
        title: 'Cyber Security Advisory & Two-Factor Authentication on Google Workspace',
        content: 'In accordance with CISO & CERT-In security guidelines, all @iisermohali.ac.in email users must keep 2-Step Verification active and avoid sharing institutional credentials on external portals.',
        priority: 'normal',
        authorName: 'Er. Garima Kaushik (Sr. Technical Officer & CISO)',
        authorEmail: 'garima@iisermohali.ac.in',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        active: true,
      },
      {
        id: 'ann-3',
        title: 'Moodle LMS & eSmarth ERP Course Registration Support Hours',
        content: 'For assistance with current semester Moodle course creation or eSmarth ERP module access, please contact Mr. Sumeet Kumar (sumeetk@iisermohali.ac.in) or Mr. Virpartap Singh (virpartap@iisermohali.ac.in).',
        priority: 'low',
        authorName: 'Computer Centre Support Desk',
        authorEmail: 'headcc@iisermohali.ac.in',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        active: true,
      },
    ];

    // 5. Initial Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        adminEmail: 'headcc@iisermohali.ac.in',
        action: 'UPDATE',
        entityType: 'duty_assignment',
        entityId: 'duty-sat-1',
        summary: 'Verified Saturday Teaching Lab & Network duty schedule (09:00 - 14:00)',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'log-2',
        adminEmail: 'headcc@iisermohali.ac.in',
        action: 'CREATE',
        entityType: 'announcement',
        entityId: 'ann-1',
        summary: 'Published advisory: Use of CC Ticketing System for Network, ERP & Email Support',
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
const globalForDb = globalThis as unknown as { __iiser_portal_db_v2?: DatabaseStore };
export const db = globalForDb.__iiser_portal_db_v2 ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.__iiser_portal_db_v2 = db;
