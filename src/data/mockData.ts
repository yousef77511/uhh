import { MedicalItem, WishlistItem, OrganizationVerification, ChatThread, ChatMessage, AuditLogEntry } from '../types';

export const INITIAL_ITEMS: MedicalItem[] = [
  {
    id: 'MED-101',
    name: 'Sterile Surgical Gloves (Latex Free)',
    category: 'PPE',
    quantity: 450,
    unit: 'Pairs',
    expirationDate: '2027-08-15',
    batchNumber: 'LOT-9921',
    donorName: 'Dr. Tarek & Partners Clinic',
    donorEmail: 'tarek@medclinic.org',
    status: 'live',
    location: 'North Health District',
    condition: 'Brand New (Sealed)',
    createdAt: '2026-10-01'
  },
  {
    id: 'MED-102',
    name: 'Sterile Gauze Bandages 10cm x 5m',
    category: 'Consumables',
    quantity: 600,
    unit: 'Packs',
    expirationDate: '2028-02-10',
    batchNumber: 'LOT-4412',
    donorName: 'Protons Team Donor',
    donorEmail: 'team4@protons.edu.com',
    status: 'live',
    location: 'Central Medical Store',
    condition: 'Brand New (Sealed)',
    createdAt: '2026-10-02'
  },
  {
    id: 'MED-103',
    name: 'Portable Pulse Oximeter Units',
    category: 'Equipment',
    quantity: 12,
    unit: 'Units',
    expirationDate: '2030-01-01',
    batchNumber: 'OX-880',
    donorName: 'Metro Regional Care',
    donorEmail: 'metro@healthcare.org',
    status: 'claimed',
    claimedBy: 'Hope Children Clinic',
    location: 'East Wing Depot',
    condition: 'Refurbished Equipment',
    createdAt: '2026-09-28'
  },
  {
    id: 'MED-104',
    name: 'Ceftriaxone 1g Injectable Vials',
    category: 'Medicine',
    quantity: 120,
    unit: 'Vials',
    expirationDate: '2027-04-30',
    batchNumber: 'LOT-CT773',
    donorName: 'Community Pharmacy Network',
    donorEmail: 'cpn@pharma.org',
    status: 'pending',
    location: 'Cold Chain Vault',
    condition: 'Brand New (Sealed)',
    createdAt: '2026-10-04'
  },
  {
    id: 'MED-105',
    name: 'N95 Respirator Masks (Box of 20)',
    category: 'PPE',
    quantity: 35,
    unit: 'Boxes',
    expirationDate: '2027-11-20',
    batchNumber: 'N95-442',
    donorName: 'Protons Team Donor',
    donorEmail: 'team4@protons.edu.com',
    status: 'delivered',
    claimedBy: 'St. Jude Emergency Center',
    location: 'South Care Center',
    condition: 'Brand New (Sealed)',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'WISH-01',
    hospitalName: 'Hope Community Health Center',
    itemNeeded: 'Syringes 5ml with needle (1000 units)',
    quantityNeeded: 1000,
    urgency: 'High',
    contactPerson: 'Dr. Sarah Farouk',
    datePosted: '2026-10-03',
    fulfilled: false
  },
  {
    id: 'WISH-02',
    hospitalName: 'Al-Amal Pediatric Clinic',
    itemNeeded: 'Infant Nebulizers & Inhalation Chambers',
    quantityNeeded: 8,
    urgency: 'High',
    contactPerson: 'Eng. Ahmed Rady',
    datePosted: '2026-10-04',
    fulfilled: false
  },
  {
    id: 'WISH-03',
    hospitalName: 'Rural Outreach Mobile Unit',
    itemNeeded: 'Antiseptic Povidone-Iodine solution 500ml',
    quantityNeeded: 50,
    urgency: 'Medium',
    contactPerson: 'Nurse Mona',
    datePosted: '2026-10-05',
    fulfilled: true
  }
];

export const INITIAL_ORGS: OrganizationVerification[] = [
  {
    id: 'ORG-1',
    name: 'City General Hope Hospital',
    type: 'Hospital',
    email: 'contact@cityhope.med',
    licenseNumber: 'LIC-MED-2024-884',
    status: 'Pending',
    submittedDate: '2026-10-05',
    docsCount: 2
  },
  {
    id: 'ORG-2',
    name: 'El-Nour Free Clinic Network',
    type: 'Clinic',
    email: 'admin@elnourclinic.org',
    licenseNumber: 'CLIN-EG-9912',
    status: 'Approved',
    submittedDate: '2026-09-29',
    docsCount: 3
  },
  {
    id: 'ORG-3',
    name: 'Red Crescent Volunteer Unit 4',
    type: 'Charity Foundation',
    email: 'relief@crescent-team.org',
    licenseNumber: 'NGO-88310',
    status: 'Approved',
    submittedDate: '2026-09-25',
    docsCount: 4
  }
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'th-1',
    facilityName: 'Hope Medical Center',
    avatar: 'HM',
    lastMessage: 'Thank you! The batch LOT-9921 arrived in pristine condition.',
    unreadCount: 1
  },
  {
    id: 'th-2',
    facilityName: 'St. Jude Emergency Center',
    avatar: 'SJ',
    lastMessage: 'Can we reserve the portable pulse oximeters?',
    unreadCount: 1
  },
  {
    id: 'th-3',
    facilityName: 'Protons Dispatch Team',
    avatar: 'PD',
    lastMessage: 'Delivery PIN code 482910 verified by driver.',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'th-1': [
    {
      id: 'm1',
      threadId: 'th-1',
      sender: 'them',
      senderName: 'Hope Medical Dispatch',
      text: 'Hello Protons Team! We saw your surgical gloves donation listing.',
      timestamp: '10:14 AM'
    },
    {
      id: 'm2',
      threadId: 'th-1',
      sender: 'me',
      senderName: 'Yousef (Protons)',
      text: 'Hello! Yes, they are 100% sealed with expiration in 2027.',
      timestamp: '10:20 AM'
    },
    {
      id: 'm3',
      threadId: 'th-1',
      sender: 'them',
      senderName: 'Hope Medical Dispatch',
      text: 'Thank you! The batch LOT-9921 arrived in pristine condition.',
      timestamp: '11:05 AM'
    }
  ],
  'th-2': [
    {
      id: 'm4',
      threadId: 'th-2',
      sender: 'them',
      senderName: 'St. Jude Coordinator',
      text: 'Can we reserve the portable pulse oximeters?',
      timestamp: '09:30 AM'
    }
  ],
  'th-3': [
    {
      id: 'm5',
      threadId: 'th-3',
      sender: 'them',
      senderName: 'Protons Logistics',
      text: 'Delivery PIN code 482910 verified by driver.',
      timestamp: 'Yesterday'
    }
  ]
};

export const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-06 14:15',
    user: 'Yousef (Protons Admin)',
    action: 'Approved Medical Supply',
    target: 'MED-101 (Surgical Gloves)'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-06 13:40',
    user: 'City General Hope Hospital',
    action: 'Claimed Supply Batch',
    target: 'MED-103 (Pulse Oximeters)'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-06 11:20',
    user: 'System Safety Inspector',
    action: 'Verified Expiry & Batch Code',
    target: 'MED-104 (Ceftriaxone 1g)'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-05 16:05',
    user: 'Marwa (Protons Reviewer)',
    action: 'Verified Organization License',
    target: 'El-Nour Free Clinic Network'
  }
];
