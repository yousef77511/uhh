/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  User, 
  Home, 
  LogIn, 
  FileCheck, 
  ShieldCheck, 
  PlusCircle, 
  Package, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  QrCode, 
  FileText, 
  Users, 
  Trash2, 
  HeartHandshake, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Hospital, 
  Printer, 
  Check, 
  X,
  RefreshCw,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { 
  ViewType, 
  MedicalItem, 
  WishlistItem, 
  OrganizationVerification, 
  AuditLogEntry, 
  SupplyCategory 
} from './types';
import { 
  INITIAL_ITEMS, 
  INITIAL_WISHLIST, 
  INITIAL_ORGS, 
  INITIAL_THREADS, 
  INITIAL_MESSAGES, 
  INITIAL_LOGS 
} from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // State data
  const [items, setItems] = useState<MedicalItem[]>(() => {
    const saved = localStorage.getItem('medbridge_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('medbridge_wishlist');
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [orgs, setOrgs] = useState<OrganizationVerification[]>(() => {
    const saved = localStorage.getItem('medbridge_orgs');
    return saved ? JSON.parse(saved) : INITIAL_ORGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('medbridge_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [chatMessages, setChatMessages] = useState(() => INITIAL_MESSAGES);
  const [activeThreadId, setActiveThreadId] = useState('th-1');
  const [chatInputText, setChatInputText] = useState('');

  // Current logged in user info
  const [currentUser, setCurrentUser] = useState({
    name: 'Yousef',
    email: 'team4@protons.edu.com',
    role: 'Protons Admin & Donor'
  });

  // Wizard state for Add Item
  const [wizardStep, setWizardStep] = useState(1);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'PPE' as SupplyCategory,
    quantity: 100,
    unit: 'Units',
    expirationDate: '2027-12-31',
    batchNumber: 'LOT-PR101',
    location: 'Central Depot',
    condition: 'Brand New (Sealed)' as const
  });

  // Selected item for Edit
  const [selectedEditId, setSelectedEditId] = useState<string>('MED-101');
  const [editFormData, setEditFormData] = useState<Partial<MedicalItem>>({});

  // Filters for Browse
  const [browseCategory, setBrowseCategory] = useState<string>('');
  const [browseSearch, setBrowseSearch] = useState<string>('');

  // Wishlist Form
  const [newWishlist, setNewWishlist] = useState({
    hospitalName: '',
    itemNeeded: '',
    quantityNeeded: 50,
    urgency: 'High' as 'High' | 'Medium' | 'Low'
  });

  // Delivery Code state
  const [deliveryPin, setDeliveryPin] = useState('482910');
  const [qrSeed, setQrSeed] = useState<boolean[]>(() => 
    Array.from({ length: 64 }, () => Math.random() > 0.45)
  );

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([]);

  const showToast = (text: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const addAuditLog = (action: string, target: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: currentUser.name,
      action,
      target
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('medbridge_items', JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem('medbridge_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem('medbridge_orgs', JSON.stringify(orgs));
  }, [orgs]);
  useEffect(() => {
    localStorage.setItem('medbridge_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Sync selected edit item
  useEffect(() => {
    const found = items.find(i => i.id === selectedEditId);
    if (found) {
      setEditFormData(found);
    }
  }, [selectedEditId, items]);

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} mode`);
  };

  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    setBrowseSearch(val);
    if (val.trim() && currentView !== 'browse') {
      setCurrentView('browse');
    }
  };

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      showToast('Please provide an item name');
      return;
    }
    const created: MedicalItem = {
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      name: newItem.name,
      category: newItem.category,
      quantity: Number(newItem.quantity) || 1,
      unit: newItem.unit,
      expirationDate: newItem.expirationDate,
      batchNumber: newItem.batchNumber,
      donorName: currentUser.name,
      donorEmail: currentUser.email,
      status: 'pending',
      location: newItem.location,
      condition: newItem.condition,
      createdAt: new Date().toISOString().substring(0, 10)
    };

    setItems(prev => [created, ...prev]);
    addAuditLog('Created Donation Listing', `${created.id} (${created.name})`);
    showToast('Donation submitted for Quality & Safety Review!');
    setWizardStep(1);
    setNewItem({
      name: '',
      category: 'PPE',
      quantity: 100,
      unit: 'Units',
      expirationDate: '2027-12-31',
      batchNumber: 'LOT-PR101',
      location: 'Central Depot',
      condition: 'Brand New (Sealed)'
    });
    setCurrentView('mydonations');
  };

  const handleApproveItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'live' } : item));
    const target = items.find(i => i.id === id);
    addAuditLog('Approved to Live Inventory', `${id} (${target?.name})`);
    showToast(`Item ${id} is now Live for clinics!`);
  };

  const handleRejectItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    addAuditLog('Rejected / Removed Item', id);
    showToast(`Item ${id} rejected and removed`);
  };

  const handleClaimItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'claimed', claimedBy: 'City General Hospital' } : item));
    const target = items.find(i => i.id === id);
    addAuditLog('Claimed Medical Supply', `${id} (${target?.name})`);
    showToast(`Successfully claimed ${target?.name}! Delivery code generated.`);
  };

  const handleMarkDelivered = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'delivered' } : item));
    addAuditLog('Confirmed Final Delivery', id);
    showToast(`Delivery for ${id} confirmed! Tax impact updated.`);
  };

  const handleUpdateEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditId) return;
    setItems(prev => prev.map(item => item.id === selectedEditId ? { ...item, ...editFormData } : item));
    addAuditLog('Updated Listing Details', selectedEditId);
    showToast('Item details successfully saved');
    setCurrentView('mydonations');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    addAuditLog('Deleted Item Listing', id);
    showToast('Item deleted successfully');
  };

  const handleApproveOrg = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'Approved' } : o));
    addAuditLog('Approved Healthcare Organization', id);
    showToast('Organization verification approved');
  };

  const handleRejectOrg = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'Rejected' } : o));
    addAuditLog('Rejected Organization Verification', id);
    showToast('Organization marked as rejected');
  };

  const handleCreateWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlist.hospitalName.trim() || !newWishlist.itemNeeded.trim()) {
      showToast('Please fill all wishlist fields');
      return;
    }
    const created: WishlistItem = {
      id: `WISH-${Math.floor(10 + Math.random() * 90)}`,
      hospitalName: newWishlist.hospitalName,
      itemNeeded: newWishlist.itemNeeded,
      quantityNeeded: Number(newWishlist.quantityNeeded) || 1,
      urgency: newWishlist.urgency,
      contactPerson: currentUser.name,
      datePosted: new Date().toISOString().substring(0, 10),
      fulfilled: false
    };
    setWishlist(prev => [created, ...prev]);
    addAuditLog('Posted Hospital Wishlist Need', `${created.hospitalName} - ${created.itemNeeded}`);
    showToast('Hospital wishlist need published');
    setNewWishlist({ hospitalName: '', itemNeeded: '', quantityNeeded: 50, urgency: 'High' });
  };

  const handleToggleWishlistFulfill = (id: string) => {
    setWishlist(prev => prev.map(w => w.id === id ? { ...w, fulfilled: !w.fulfilled } : w));
    showToast('Hospital wishlist status updated');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      threadId: activeThreadId,
      sender: 'me' as const,
      senderName: currentUser.name,
      text: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), msg]
    }));
    setChatInputText('');
    showToast('Message transmitted securely');
  };

  const regenerateCode = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setDeliveryPin(pin);
    setQrSeed(Array.from({ length: 64 }, () => Math.random() > 0.45));
    showToast(`Generated new secure PIN: ${pin}`);
  };

  // Filtered browse items
  const filteredBrowseItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(browseSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(browseSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(browseSearch.toLowerCase());
    const matchesCat = !browseCategory || item.category === browseCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate live stats
  const totalDonationsCount = items.length;
  const verifiedDeliveredCount = items.filter(i => i.status === 'delivered').length;
  const approvedOrgsCount = orgs.filter(o => o.status === 'Approved').length;
  const livesImpactedApprox = (totalDonationsCount * 280) + 1200;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f6] dark:bg-[#0b1716] text-[#0f2a2e] dark:text-[#e7f3f2] font-sans antialiased transition-colors">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#122220] border-b border-[#dce6e5] dark:border-[#22403c] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm backdrop-blur">
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            MB
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-[#0b6e64] dark:text-[#2dd4bf]">
              MedBridge
            </h1>
            <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">
              Protons Community Platform
            </p>
          </div>
        </div>

        {/* Global search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c7b7d] dark:text-[#89a6a3]" />
          <input 
            type="text" 
            placeholder="Search supplies, equipment, medicines..." 
            value={globalSearch}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs sm:text-sm bg-[#f4f7f6] dark:bg-[#0b1716] border border-[#dce6e5] dark:border-[#22403c] focus:outline-none focus:border-[#0f9488] dark:focus:border-[#2dd4bf]"
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-[#f4f7f6] dark:bg-[#0b1716] border border-[#dce6e5] dark:border-[#22403c] flex items-center justify-center text-[#5c7b7d] dark:text-[#89a6a3] hover:text-[#0f9488] transition-colors"
            title="Toggle Light / Dark"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(prev => !prev)}
              className="w-9 h-9 rounded-full bg-[#f4f7f6] dark:bg-[#0b1716] border border-[#dce6e5] dark:border-[#22403c] flex items-center justify-center relative hover:text-[#0f9488]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#122220] border border-[#dce6e5] dark:border-[#22403c] rounded-xl shadow-xl p-3 z-50">
                <div className="border-b border-[#dce6e5] dark:border-[#22403c] pb-2 mb-2">
                  <h4 className="text-xs font-semibold text-[#0f2a2e] dark:text-white">Active Notifications</h4>
                  <p className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3]">Verified donor and delivery alerts</p>
                </div>
                <div 
                  onClick={() => { setCurrentView('chat'); setShowNotifications(false); }}
                  className="p-2 rounded hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] cursor-pointer text-xs"
                >
                  <p className="font-semibold text-[#0f9488] dark:text-[#2dd4bf]">💬 Hope Medical Center</p>
                  <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">New message: Batch LOT-9921 arrived</p>
                </div>
                <div 
                  onClick={() => { setCurrentView('pendingreview'); setShowNotifications(false); }}
                  className="p-2 rounded hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] cursor-pointer text-xs"
                >
                  <p className="font-semibold text-amber-600">🛡️ Safety Verification Queue</p>
                  <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">1 pharmaceutical batch awaiting sign-off</p>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(prev => !prev)}
              className="w-9 h-9 rounded-full bg-[#0b6e64] dark:bg-[#14b8a6] text-white font-bold text-sm flex items-center justify-center border border-[#dce6e5] dark:border-[#22403c]"
            >
              {currentUser.name.charAt(0)}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#122220] border border-[#dce6e5] dark:border-[#22403c] rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#dce6e5] dark:border-[#22403c]">
                  <p className="font-bold text-xs">{currentUser.name}</p>
                  <p className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3]">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <button 
                  onClick={() => { setCurrentView('mydonations'); setShowUserMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5 text-[#0f9488]" /> My Donations
                </button>
                <button 
                  onClick={() => { setCurrentView('wishlist'); setShowUserMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] flex items-center gap-2"
                >
                  <Hospital className="w-3.5 h-3.5 text-blue-500" /> Hospital Wishlists
                </button>
                <button 
                  onClick={() => { setCurrentView('about'); setShowUserMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-amber-500" /> Protons Team
                </button>
                <button 
                  onClick={() => { showToast('Signed out successfully'); setShowUserMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 min-h-0">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white dark:bg-[#122220] border-r border-[#dce6e5] dark:border-[#22403c] p-4 flex-col gap-1 overflow-y-auto">
          
          <button 
            onClick={() => setCurrentView('home')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'home' 
                ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' 
                : 'text-[#0f2a2e] dark:text-[#e7f3f2] hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Home className="w-4 h-4 text-[#0f9488]" /> Home Dashboard
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5c7b7d] dark:text-[#89a6a3] mt-3 mb-1 px-3">
            Get Started
          </div>
          <button 
            onClick={() => setCurrentView('auth')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'auth' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-600" /> Login & Register
          </button>
          <button 
            onClick={() => setCurrentView('orgdocs')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'orgdocs' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <FileCheck className="w-4 h-4 text-indigo-500" /> Document Verification
          </button>
          <button 
            onClick={() => setCurrentView('adminorgs')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'adminorgs' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" /> Org Approvals
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5c7b7d] dark:text-[#89a6a3] mt-3 mb-1 px-3">
            Donor Operations
          </div>
          <button 
            onClick={() => setCurrentView('additem')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'additem' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#0f9488]" /> Post Donation
          </button>
          <button 
            onClick={() => setCurrentView('mydonations')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'mydonations' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Package className="w-4 h-4 text-cyan-600" /> My Donations
          </button>
          <button 
            onClick={() => setCurrentView('edititem')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'edititem' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-600" /> Edit / Delete Items
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5c7b7d] dark:text-[#89a6a3] mt-3 mb-1 px-3">
            Browse & Request
          </div>
          <button 
            onClick={() => setCurrentView('browse')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'browse' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Search className="w-4 h-4 text-blue-500" /> Browse Supplies
          </button>
          <button 
            onClick={() => setCurrentView('wishlist')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'wishlist' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Hospital className="w-4 h-4 text-rose-500" /> Hospital Wishlists
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5c7b7d] dark:text-[#89a6a3] mt-3 mb-1 px-3">
            Safety & Management
          </div>
          <button 
            onClick={() => setCurrentView('pendingreview')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'pendingreview' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Safety Review Queue
          </button>
          <button 
            onClick={() => setCurrentView('managelive')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'managelive' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" /> Live Inventory
          </button>
          <button 
            onClick={() => setCurrentView('activitylog')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'activitylog' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-500" /> Audit Activity Log
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5c7b7d] dark:text-[#89a6a3] mt-3 mb-1 px-3">
            Connect & Impact
          </div>
          <button 
            onClick={() => setCurrentView('chat')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'chat' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Send className="w-4 h-4 text-sky-500" /> Messages
          </button>
          <button 
            onClick={() => setCurrentView('delivery')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'delivery' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <QrCode className="w-4 h-4 text-teal-600" /> Delivery Verification PIN
          </button>
          <button 
            onClick={() => setCurrentView('impact')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'impact' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" /> Impact & Tax Receipt
          </button>
          <button 
            onClick={() => setCurrentView('about')} 
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'about' ? 'bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf]' : 'hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b]'
            }`}
          >
            <Users className="w-4 h-4 text-rose-500" /> Protons Team
          </button>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Top Title Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f2a2e] dark:text-white capitalize">
                {currentView === 'home' && 'Home Dashboard'}
                {currentView === 'auth' && 'Account & Onboarding Portal'}
                {currentView === 'orgdocs' && 'Healthcare License & Document Verification'}
                {currentView === 'adminorgs' && 'Institutional Credential Approvals'}
                {currentView === 'additem' && 'Post Surplus Medical Supply'}
                {currentView === 'mydonations' && 'My Registered Surplus Donations'}
                {currentView === 'edititem' && 'Edit & Manage Inventory Items'}
                {currentView === 'browse' && 'Browse Verified Surplus Inventory'}
                {currentView === 'wishlist' && 'Hospital Critical Needs Wishlist'}
                {currentView === 'pendingreview' && 'Quality Assurance & Safety Queue'}
                {currentView === 'managelive' && 'Active Live Supplies Management'}
                {currentView === 'activitylog' && 'Compliance & Activity Audit Log'}
                {currentView === 'chat' && 'Direct Facility Messaging'}
                {currentView === 'delivery' && 'Cryptographic Delivery Verification'}
                {currentView === 'impact' && 'Impact Analytics & Tax Exemption Receipts'}
                {currentView === 'about' && 'About Protons Team & Mission'}
              </h2>
              <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">
                Protons Initiative • Zero Waste Medical Logistics
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentView('additem')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" /> New Donation
            </button>
          </div>

          {/* VIEW: HOME */}
          {currentView === 'home' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">
                    {totalDonationsCount * 45 + 1100}+
                  </div>
                  <div className="text-xs font-medium text-[#5c7b7d] dark:text-[#89a6a3] mt-1">Items Redistributed</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">
                    {approvedOrgsCount + 81}
                  </div>
                  <div className="text-xs font-medium text-[#5c7b7d] dark:text-[#89a6a3] mt-1">Verified Organizations</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">
                    12.5 T
                  </div>
                  <div className="text-xs font-medium text-[#5c7b7d] dark:text-[#89a6a3] mt-1">Medical Waste Saved</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">
                    100%
                  </div>
                  <div className="text-xs font-medium text-[#5c7b7d] dark:text-[#89a6a3] mt-1">Community Driven</div>
                </div>
              </div>

              {/* Mission Banner */}
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <div className="max-w-3xl">
                  <h3 className="text-lg font-bold text-[#0f2a2e] dark:text-white mb-2">
                    Welcome to MedBridge Platform
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c7b7d] dark:text-[#89a6a3] leading-relaxed">
                    MedBridge connects clinics, hospitals, pharmacies, and donors to safely redirect surplus unexpired medical items, surgical tools, and critical equipment to underserved communities. Spearheaded by the <strong>Protons Team</strong>, our goal is to eliminate supply scarcity while combating biomedical waste.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button 
                      onClick={() => setCurrentView('browse')}
                      className="bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90"
                    >
                      Explore Available Supplies
                    </button>
                    <button 
                      onClick={() => setCurrentView('about')}
                      className="border border-[#0f9488] text-[#0f9488] dark:text-[#2dd4bf] dark:border-[#2dd4bf] text-xs font-bold px-4 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/40"
                    >
                      Meet Protons Team
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Supplies Section */}
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">Recent Surplus Postings</h3>
                  <button 
                    onClick={() => setCurrentView('browse')} 
                    className="text-xs text-[#0f9488] dark:text-[#2dd4bf] font-semibold hover:underline"
                  >
                    View All ({items.length}) →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className="p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716]/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'live' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#0f2a2e] dark:text-white line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3] mt-1">
                          Quantity: {item.quantity} {item.unit} • Expires: {item.expirationDate}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#dce6e5] dark:border-[#22403c] flex items-center justify-between">
                        <span className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3]">Batch: {item.batchNumber}</span>
                        <button 
                          onClick={() => handleClaimItem(item.id)}
                          disabled={item.status !== 'live'}
                          className="text-[11px] font-bold text-[#0f9488] dark:text-[#2dd4bf] hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                          {item.status === 'live' ? 'Claim Batch' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AUTH */}
          {currentView === 'auth' && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold text-center mb-1">MedBridge Access Portal</h3>
              <p className="text-xs text-center text-[#5c7b7d] dark:text-[#89a6a3] mb-6">Select your account persona to simulate access</p>
              
              <div className="space-y-4">
                <div 
                  onClick={() => {
                    setCurrentUser({ name: 'Yousef', email: 'team4@protons.edu.com', role: 'Protons Admin & Donor' });
                    showToast('Switched to Yousef (Protons Admin)');
                    setCurrentView('home');
                  }}
                  className="p-3.5 rounded-xl border border-teal-500 bg-teal-50 dark:bg-teal-950/40 cursor-pointer flex items-center justify-between hover:scale-[1.01] transition-transform"
                >
                  <div>
                    <h4 className="font-bold text-xs text-teal-900 dark:text-teal-200">Yousef (Protons Team Admin)</h4>
                    <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">team4@protons.edu.com • Full administrative control</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                </div>

                <div 
                  onClick={() => {
                    setCurrentUser({ name: 'Hope Hospital Staff', email: 'intake@cityhope.med', role: 'Verified Healthcare Receiver' });
                    showToast('Switched to Hope Hospital Receiver');
                    setCurrentView('browse');
                  }}
                  className="p-3.5 rounded-xl border border-[#dce6e5] dark:border-[#22403c] hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs">City General Hope Hospital</h4>
                    <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">intake@cityhope.med • Verified Healthcare Institution</p>
                  </div>
                  <Hospital className="w-5 h-5 text-blue-500" />
                </div>

                <div 
                  onClick={() => {
                    setCurrentUser({ name: 'Volunteer Dispatcher', email: 'dispatch@protons.org', role: 'Field Logistics Courier' });
                    showToast('Switched to Volunteer Logistics Courier');
                    setCurrentView('delivery');
                  }}
                  className="p-3.5 rounded-xl border border-[#dce6e5] dark:border-[#22403c] hover:bg-[#f4f7f6] dark:hover:bg-[#182e2b] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs">Logistics Volunteer Courier</h4>
                    <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">dispatch@protons.org • Chain-of-custody verification</p>
                  </div>
                  <QrCode className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ORG DOCS */}
          {currentView === 'orgdocs' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-1">Healthcare Organization Document Verification</h3>
              <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mb-5">
                To prevent illicit medication distribution, all recipient clinics and charities must furnish valid medical licenses.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                showToast('Documents uploaded successfully! Review queue updated.');
                setCurrentView('adminorgs');
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Healthcare Operating License (PDF / Image)</label>
                  <div className="border-2 border-dashed border-[#dce6e5] dark:border-[#22403c] p-5 rounded-xl text-center cursor-pointer hover:border-[#0f9488] transition-colors">
                    <FileCheck className="w-6 h-6 mx-auto mb-1 text-[#0f9488]" />
                    <span className="text-xs font-medium">Click to attach official operating certificate</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Tax Identification / NGO Exemption Certificate</label>
                  <div className="border-2 border-dashed border-[#dce6e5] dark:border-[#22403c] p-5 rounded-xl text-center cursor-pointer hover:border-[#0f9488] transition-colors">
                    <FileText className="w-6 h-6 mx-auto mb-1 text-[#0f9488]" />
                    <span className="text-xs font-medium">Click to attach official tax authorization document</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90 mt-2"
                >
                  Submit Credentials for Review
                </button>
              </form>
            </div>
          )}

          {/* VIEW: ADMIN ORGS */}
          {currentView === 'adminorgs' && (
            <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-4">Pending Institutional Verification Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f4f7f6] dark:bg-[#0b1716] uppercase text-[#5c7b7d] dark:text-[#89a6a3]">
                    <tr>
                      <th className="p-3">Organization Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">License Code</th>
                      <th className="p-3">Documents</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dce6e5] dark:divide-[#22403c]">
                    {orgs.map(org => (
                      <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-3 font-bold text-[#0f2a2e] dark:text-white">{org.name}</td>
                        <td className="p-3 text-[#5c7b7d] dark:text-[#89a6a3]">{org.type}</td>
                        <td className="p-3 font-mono">{org.licenseNumber}</td>
                        <td className="p-3">{org.docsCount} Attachments</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            org.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            org.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {org.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {org.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleApproveOrg(org.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button 
                                onClick={() => handleRejectOrg(org.id)}
                                className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700 flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: ADD ITEM WIZARD */}
          {currentView === 'additem' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              {/* Wizard Steps indicator */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      wizardStep === step 
                        ? 'bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716]' 
                        : wizardStep > step 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    <span className="text-xs font-semibold hidden sm:inline">
                      {step === 1 && 'Item Basics'}
                      {step === 2 && 'Batch & Expiry'}
                      {step === 3 && 'Final Review'}
                    </span>
                  </div>
                ))}
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Supply Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sterile Gauze Bandages"
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs focus:outline-none focus:border-[#0f9488]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Category</label>
                      <select 
                        value={newItem.category}
                        onChange={e => setNewItem({ ...newItem, category: e.target.value as SupplyCategory })}
                        className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                      >
                        <option value="PPE">PPE & Protection</option>
                        <option value="Equipment">Medical Equipment</option>
                        <option value="Medicine">Pharmaceuticals</option>
                        <option value="Consumables">Consumables</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Quantity & Unit</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={newItem.quantity}
                          onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                          className="w-1/2 p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                        />
                        <input 
                          type="text" 
                          value={newItem.unit}
                          onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                          className="w-1/2 p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                          placeholder="Boxes"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setWizardStep(2)}
                    disabled={!newItem.name.trim()}
                    className="w-full bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    Next: Batch & Expiry →
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Expiration Date</label>
                      <input 
                        type="date" 
                        value={newItem.expirationDate}
                        onChange={e => setNewItem({ ...newItem, expirationDate: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Batch / LOT Number</label>
                      <input 
                        type="text" 
                        value={newItem.batchNumber}
                        onChange={e => setNewItem({ ...newItem, batchNumber: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                        placeholder="LOT-8821"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Storage Location / City</label>
                    <input 
                      type="text" 
                      value={newItem.location}
                      onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                      placeholder="e.g. Cairo Central Depot"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setWizardStep(1)}
                      className="w-1/2 border border-[#dce6e5] dark:border-[#22403c] py-2 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={() => setWizardStep(3)}
                      className="w-1/2 bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90"
                    >
                      Next: Review Listing →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#f4f7f6] dark:bg-[#0b1716] rounded-xl text-xs space-y-2 border border-[#dce6e5] dark:border-[#22403c]">
                    <div><strong>Item:</strong> {newItem.name}</div>
                    <div><strong>Category:</strong> {newItem.category}</div>
                    <div><strong>Quantity:</strong> {newItem.quantity} {newItem.unit}</div>
                    <div><strong>Expiration Date:</strong> {newItem.expirationDate}</div>
                    <div><strong>Batch Code:</strong> {newItem.batchNumber}</div>
                    <div><strong>Storage Location:</strong> {newItem.location}</div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setWizardStep(2)}
                      className="w-1/2 border border-[#dce6e5] dark:border-[#22403c] py-2 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={handleCreateDonation}
                      className="w-1/2 bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90"
                    >
                      Confirm & Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: MY DONATIONS */}
          {currentView === 'mydonations' && (
            <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">My Registered Surplus Items</h3>
                <button 
                  onClick={() => setCurrentView('additem')}
                  className="text-xs bg-[#0f9488] text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  + Add Item
                </button>
              </div>

              <div className="divide-y divide-[#dce6e5] dark:divide-[#22403c]">
                {items.map(item => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[#0f2a2e] dark:text-white">{item.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'live' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3] mt-0.5">
                        Category: {item.category} • Batch: {item.batchNumber} • Qty: {item.quantity} {item.unit} • Expires: {item.expirationDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'claimed' && (
                        <button 
                          onClick={() => handleMarkDelivered(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setSelectedEditId(item.id);
                          setCurrentView('edititem');
                        }}
                        className="px-2.5 py-1 border border-[#0f9488] text-[#0f9488] rounded text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950/40"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: EDIT ITEM */}
          {currentView === 'edititem' && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-4">Edit Listing Details</h3>
              
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Select Item</label>
                <select 
                  value={selectedEditId}
                  onChange={e => setSelectedEditId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                >
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.batchNumber})
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleUpdateEditForm} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Item Title</label>
                  <input 
                    type="text" 
                    value={editFormData.name || ''}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Quantity</label>
                    <input 
                      type="number" 
                      value={editFormData.quantity || 0}
                      onChange={e => setEditFormData({ ...editFormData, quantity: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#5c7b7d] dark:text-[#89a6a3]">Expiration</label>
                    <input 
                      type="date" 
                      value={editFormData.expirationDate || ''}
                      onChange={e => setEditFormData({ ...editFormData, expirationDate: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteItem(selectedEditId)}
                    className="px-4 py-2 border border-rose-500 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: BROWSE */}
          {currentView === 'browse' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c7b7d] dark:text-[#89a6a3]" />
                  <input 
                    type="text" 
                    placeholder="Search supplies, category, location..."
                    value={browseSearch}
                    onChange={e => setBrowseSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {['', 'PPE', 'Equipment', 'Medicine', 'Consumables'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setBrowseCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        browseCategory === cat 
                          ? 'bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716]' 
                          : 'bg-[#f4f7f6] dark:bg-[#0b1716] text-[#5c7b7d] dark:text-[#89a6a3] hover:text-[#0f9488]'
                      }`}
                    >
                      {cat || 'All Items'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrowseItems.map(item => (
                  <div key={item.id} className="bg-white dark:bg-[#122220] p-5 rounded-xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                          {item.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'live' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#0f2a2e] dark:text-white">{item.name}</h4>
                      <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mt-1">
                        Quantity: <span className="font-semibold text-teal-600 dark:text-teal-300">{item.quantity} {item.unit}</span>
                      </p>
                      <div className="text-[11px] text-[#5c7b7d] dark:text-[#89a6a3] mt-2 space-y-0.5">
                        <div>Batch: <span className="font-mono">{item.batchNumber}</span></div>
                        <div>Expires: {item.expirationDate}</div>
                        <div>Location: {item.location}</div>
                        <div>Condition: {item.condition}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#dce6e5] dark:border-[#22403c] flex items-center justify-between">
                      <span className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3]">By {item.donorName}</span>
                      <button 
                        onClick={() => handleClaimItem(item.id)}
                        disabled={item.status !== 'live'}
                        className="bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] px-3 py-1 rounded text-xs font-bold hover:opacity-90 disabled:opacity-40"
                      >
                        {item.status === 'live' ? 'Claim Supply' : item.status.toUpperCase()}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: WISHLIST */}
          {currentView === 'wishlist' && (
            <div className="space-y-6">
              {/* Form to post need */}
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <h3 className="text-base font-bold mb-3">Post Critical Hospital Supply Need</h3>
                <form onSubmit={handleCreateWishlist} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input 
                    type="text" 
                    placeholder="Facility Name (e.g. Hope Clinic)"
                    value={newWishlist.hospitalName}
                    onChange={e => setNewWishlist({ ...newWishlist, hospitalName: e.target.value })}
                    className="p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder="Item Needed (e.g. Syringes 5ml)"
                    value={newWishlist.itemNeeded}
                    onChange={e => setNewWishlist({ ...newWishlist, itemNeeded: e.target.value })}
                    className="p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={newWishlist.quantityNeeded}
                      onChange={e => setNewWishlist({ ...newWishlist, quantityNeeded: Number(e.target.value) })}
                      className="w-1/2 p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                    />
                    <select 
                      value={newWishlist.urgency}
                      onChange={e => setNewWishlist({ ...newWishlist, urgency: e.target.value as any })}
                      className="w-1/2 p-2.5 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs"
                    >
                      <option value="High">High Urgency</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90"
                  >
                    Post Need Request
                  </button>
                </form>
              </div>

              {/* Wishlist listings */}
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <h3 className="text-base font-bold mb-4">Active Healthcare Wishlist Requests</h3>
                <div className="divide-y divide-[#dce6e5] dark:divide-[#22403c]">
                  {wishlist.map(w => (
                    <div key={w.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            w.urgency === 'High' ? 'bg-rose-100 text-rose-800' :
                            w.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {w.urgency} URGENCY
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm">{w.hospitalName}</h4>
                        </div>
                        <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mt-1">
                          Need: <strong className="text-[#0f2a2e] dark:text-white">{w.itemNeeded}</strong> ({w.quantityNeeded} units) • Contact: {w.contactPerson}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleToggleWishlistFulfill(w.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          w.fulfilled 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-[#0f9488] text-white hover:bg-[#0b6e64]'
                        }`}
                      >
                        {w.fulfilled ? '✓ Pledged / Fulfilled' : 'Pledge Donation'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PENDING REVIEW SAFETY QUEUE */}
          {currentView === 'pendingreview' && (
            <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-2">Quality Assurance & Safety Inspection Queue</h3>
              <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mb-4">
                Items submitted by donors undergo chemical, batch lot, and tamper-seal verification before release.
              </p>

              <div className="space-y-3">
                {items.filter(i => i.status === 'pending').length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#5c7b7d] dark:text-[#89a6a3]">
                    No pending items in queue. All surplus batches verified!
                  </div>
                ) : (
                  items.filter(i => i.status === 'pending').map(item => (
                    <div key={item.id} className="p-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <h4 className="font-bold text-xs sm:text-sm text-[#0f2a2e] dark:text-white">{item.name}</h4>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mt-1">
                          Batch: {item.batchNumber} • Expiration: {item.expirationDate} • Donor: {item.donorName}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveItem(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve To Live
                        </button>
                        <button 
                          onClick={() => handleRejectItem(item.id)}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: MANAGE LIVE */}
          {currentView === 'managelive' && (
            <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-4">Live Inventory Control</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f4f7f6] dark:bg-[#0b1716] uppercase text-[#5c7b7d] dark:text-[#89a6a3]">
                    <tr>
                      <th className="p-3">Item ID</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Available Qty</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dce6e5] dark:divide-[#22403c]">
                    {items.filter(i => i.status === 'live').map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-3 font-mono font-bold">{item.id}</td>
                        <td className="p-3 font-semibold">{item.name}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3 font-bold text-teal-600 dark:text-teal-400">{item.quantity} {item.unit}</td>
                        <td className="p-3">{item.expirationDate}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleClaimItem(item.id)}
                            className="px-2.5 py-1 bg-[#0f9488] text-white rounded text-[11px] font-bold"
                          >
                            Reserve / Claim
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: AUDIT LOG */}
          {currentView === 'activitylog' && (
            <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
              <h3 className="text-base font-bold mb-4">Chain-of-Custody Compliance Audit Trail</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f4f7f6] dark:bg-[#0b1716] uppercase text-[#5c7b7d] dark:text-[#89a6a3]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Authorized Actor</th>
                      <th className="p-3">Action Event</th>
                      <th className="p-3">Target Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dce6e5] dark:divide-[#22403c]">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-3 font-mono text-[#5c7b7d] dark:text-[#89a6a3]">{log.timestamp}</td>
                        <td className="p-3 font-semibold text-[#0f2a2e] dark:text-white">{log.user}</td>
                        <td className="p-3 font-medium text-teal-700 dark:text-teal-300">{log.action}</td>
                        <td className="p-3 text-[#5c7b7d] dark:text-[#89a6a3]">{log.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: CHAT */}
          {currentView === 'chat' && (
            <div className="bg-white dark:bg-[#122220] rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm flex flex-col md:flex-row h-[520px] overflow-hidden">
              {/* Thread list */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] flex flex-col">
                <div className="p-3 border-b border-[#dce6e5] dark:border-[#22403c] font-bold text-xs">
                  Active Facilities
                </div>
                <div className="flex-1 overflow-y-auto">
                  {INITIAL_THREADS.map(thread => (
                    <div 
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`p-3 cursor-pointer text-xs transition-colors border-b border-[#dce6e5]/40 dark:border-[#22403c]/40 ${
                        activeThreadId === thread.id 
                          ? 'bg-white dark:bg-[#122220] font-semibold border-l-4 border-l-[#0f9488]' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                          {thread.avatar}
                        </div>
                        <div className="truncate flex-1">
                          <p className="truncate text-xs">{thread.facilityName}</p>
                          <p className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3] truncate">{thread.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Conversation */}
              <div className="flex-1 flex flex-col bg-white dark:bg-[#122220]">
                <div className="p-3 border-b border-[#dce6e5] dark:border-[#22403c] text-xs font-bold text-[#0f2a2e] dark:text-white">
                  {INITIAL_THREADS.find(t => t.id === activeThreadId)?.facilityName}
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {(chatMessages[activeThreadId] || []).map(msg => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[75%] ${
                        msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl text-xs ${
                        msg.sender === 'me' 
                          ? 'bg-[#0f9488] text-white rounded-br-xs' 
                          : 'bg-[#f4f7f6] dark:bg-[#0b1716] border border-[#dce6e5] dark:border-[#22403c] rounded-bl-xs text-[#0f2a2e] dark:text-white'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3] mt-1 px-1">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-[#dce6e5] dark:border-[#22403c] flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type dispatch or quality update..."
                    value={chatInputText}
                    onChange={e => setChatInputText(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-xs focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-[#0f9488] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#0b6e64]"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW: DELIVERY CODE & PIN */}
          {currentView === 'delivery' && (
            <div className="max-w-sm mx-auto bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
              <h3 className="text-base font-bold mb-1">Chain-of-Custody Verification</h3>
              <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3] mb-4">
                Scan or enter this PIN when handing over medical supplies to hospital personnel.
              </p>

              {/* 8x8 QR code matrix */}
              <div className="grid grid-cols-8 gap-1 w-36 h-36 mx-auto p-2 bg-white rounded-xl border border-gray-300 shadow-inner">
                {qrSeed.map((on, idx) => (
                  <div 
                    key={idx} 
                    className={`rounded-xs ${on ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}
                  />
                ))}
              </div>

              {/* 6 Digit PIN */}
              <div className="text-3xl font-extrabold tracking-widest text-[#0f9488] dark:text-[#2dd4bf] my-4 font-mono">
                {deliveryPin}
              </div>

              <button 
                onClick={regenerateCode}
                className="w-full bg-[#0f9488] dark:bg-[#2dd4bf] text-white dark:text-[#0b1716] py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Generate New Security Code
              </button>
            </div>
          )}

          {/* VIEW: IMPACT & TAX RECEIPT */}
          {currentView === 'impact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">{totalDonationsCount}</div>
                  <div className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">Total Surplus Batches</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">{verifiedDeliveredCount}</div>
                  <div className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">Verified Received</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">{approvedOrgsCount}</div>
                  <div className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">Hospital Partners</div>
                </div>
                <div className="bg-white dark:bg-[#122220] p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f9488] dark:text-[#2dd4bf]">{livesImpactedApprox}+</div>
                  <div className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">Estimated Patients Helped</div>
                </div>
              </div>

              {/* Tax Exemption Certificate */}
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm printable-receipt">
                <div className="flex items-center justify-between border-b border-[#dce6e5] dark:border-[#22403c] pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0b6e64] dark:text-[#2dd4bf]">
                      Official Donation Tax Exemption Certificate
                    </h3>
                    <p className="text-xs text-[#5c7b7d] dark:text-[#89a6a3]">
                      Certificate ID: MB-TAX-2026-9904 • Issued by MedBridge / Protons Team
                    </p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="no-print bg-[#0f9488] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Tax Receipt
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p>
                    This document certifies that unexpired medical supplies and surgical surplus were collected and distributed under strict compliance protocols to authorized non-profit community clinics.
                  </p>
                  <div className="p-3 bg-[#f4f7f6] dark:bg-[#0b1716] rounded-xl border border-[#dce6e5] dark:border-[#22403c] grid grid-cols-2 gap-2">
                    <div><strong>Registered Donor:</strong> {currentUser.name}</div>
                    <div><strong>Tax ID:</strong> 449-881-PROT</div>
                    <div><strong>Total Batches:</strong> {totalDonationsCount} packages</div>
                    <div><strong>Environmental Impact:</strong> 0% Landfill Contamination</div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-[#dce6e5] dark:border-[#22403c] flex justify-between items-end text-[11px] text-[#5c7b7d] dark:text-[#89a6a3]">
                  <div>
                    <p>Audited by Quality Board</p>
                    <p className="font-mono text-teal-600 dark:text-teal-400 font-bold">DIGITAL SIGNATURE: 0x98A1...F44B</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0f2a2e] dark:text-white">Protons Team Initiative</p>
                    <p>Yousef, Marwa, Moaz, Yomna</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ABOUT PROTONS TEAM */}
          {currentView === 'about' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <h3 className="text-lg font-bold text-[#0f2a2e] dark:text-white mb-2">About Our Project</h3>
                <p className="text-xs sm:text-sm text-[#5c7b7d] dark:text-[#89a6a3] leading-relaxed">
                  We are a <strong>Protons team (4 team members)</strong> making this project to help the community, make life better, and reduce medical wastes.
                </p>
                <p className="text-xs sm:text-sm text-[#5c7b7d] dark:text-[#89a6a3] leading-relaxed mt-2">
                  Hospitals discard millions of dollars of non-expired medical equipment and sealed consumables every year while clinic shortages in nearby areas persist. MedBridge resolves this bottleneck with authenticated donation listings, rigorous safety reviews, and verifiable chain-of-custody tracking.
                </p>
              </div>

              <div className="bg-white dark:bg-[#122220] p-6 rounded-2xl border border-[#dce6e5] dark:border-[#22403c] shadow-sm">
                <h3 className="text-base font-bold text-center mb-6">Meet the Protons Team</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Yousef', initial: 'Y', role: 'Project Lead & Full-Stack', focus: 'Platform Architecture' },
                    { name: 'Marwa', initial: 'M', role: 'Quality & Medical Safety', focus: 'Verification Workflow' },
                    { name: 'Moaz', initial: 'M', role: 'Logistics & Dispatch', focus: 'Chain of Custody & PINs' },
                    { name: 'Yomna', initial: 'Y', role: 'UI/UX & Community Impact', focus: 'Healthcare Accessibility' }
                  ].map(member => (
                    <div key={member.name} className="p-4 rounded-xl border border-[#dce6e5] dark:border-[#22403c] bg-[#f4f7f6] dark:bg-[#0b1716] text-center">
                      <div className="w-14 h-14 rounded-full bg-[#ccfbf1] dark:bg-[#064e3b] text-[#0b6e64] dark:text-[#2dd4bf] font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        {member.initial}
                      </div>
                      <h4 className="font-bold text-sm text-[#0f2a2e] dark:text-white">{member.name}</h4>
                      <p className="text-[11px] font-semibold text-[#0f9488] dark:text-[#2dd4bf] mt-0.5">{member.role}</p>
                      <p className="text-[10px] text-[#5c7b7d] dark:text-[#89a6a3] mt-1">{member.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="no-print bg-white dark:bg-[#122220] border-t border-[#dce6e5] dark:border-[#22403c] p-6 text-xs text-[#5c7b7d] dark:text-[#89a6a3]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#0f2a2e] dark:text-white">MedBridge Platform</span> • Developed by Protons Team (Yousef, Marwa, Moaz, Yomna)
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> team4@protons.edu.com</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> +20 123 456 7890</span>
          </div>
        </div>
      </footer>

      {/* BOTTOM NAVIGATION FOR MOBILE */}
      <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#122220] border-t border-[#dce6e5] dark:border-[#22403c] py-2 px-4 flex justify-around z-40">
        <button 
          onClick={() => setCurrentView('home')} 
          className={`flex flex-col items-center text-[10px] ${currentView === 'home' ? 'text-[#0f9488] font-bold' : 'text-[#5c7b7d]'}`}
        >
          <Home className="w-4 h-4" /> Home
        </button>
        <button 
          onClick={() => setCurrentView('browse')} 
          className={`flex flex-col items-center text-[10px] ${currentView === 'browse' ? 'text-[#0f9488] font-bold' : 'text-[#5c7b7d]'}`}
        >
          <Search className="w-4 h-4" /> Browse
        </button>
        <button 
          onClick={() => setCurrentView('additem')} 
          className={`flex flex-col items-center text-[10px] ${currentView === 'additem' ? 'text-[#0f9488] font-bold' : 'text-[#5c7b7d]'}`}
        >
          <PlusCircle className="w-4 h-4" /> Donate
        </button>
        <button 
          onClick={() => setCurrentView('chat')} 
          className={`flex flex-col items-center text-[10px] ${currentView === 'chat' ? 'text-[#0f9488] font-bold' : 'text-[#5c7b7d]'}`}
        >
          <Send className="w-4 h-4" /> Chat
        </button>
      </nav>

      {/* TOAST CONTAINER */}
      <div className="fixed bottom-14 lg:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className="bg-[#0f2a2e] text-[#f4f7f6] dark:bg-white dark:text-[#0b1716] px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in"
          >
            {toast.text}
          </div>
        ))}
      </div>

    </div>
  );
}
