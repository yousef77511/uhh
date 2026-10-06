export type ViewType = 
  | 'home'
  | 'auth'
  | 'orgdocs'
  | 'adminorgs'
  | 'additem'
  | 'mydonations'
  | 'edititem'
  | 'browse'
  | 'wishlist'
  | 'pendingreview'
  | 'managelive'
  | 'activitylog'
  | 'chat'
  | 'delivery'
  | 'impact'
  | 'about';

export type SupplyCategory = 'PPE' | 'Equipment' | 'Medicine' | 'Consumables';

export type ItemStatus = 'pending' | 'live' | 'claimed' | 'delivered';

export interface MedicalItem {
  id: string;
  name: string;
  category: SupplyCategory;
  quantity: number;
  unit: string;
  expirationDate: string;
  batchNumber: string;
  donorName: string;
  donorEmail: string;
  status: ItemStatus;
  claimedBy?: string;
  location: string;
  condition: 'Brand New (Sealed)' | 'Sterilized Surplus' | 'Refurbished Equipment';
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  hospitalName: string;
  itemNeeded: string;
  quantityNeeded: number;
  urgency: 'High' | 'Medium' | 'Low';
  contactPerson: string;
  datePosted: string;
  fulfilled: boolean;
}

export interface OrganizationVerification {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Charity Foundation' | 'Disaster Relief';
  email: string;
  licenseNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  docsCount: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: 'me' | 'them';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  facilityName: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
}
