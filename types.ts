export interface Kpi {
  title: string;
  value: number;
  change: number;
  formatAs?: 'currency' | 'percentage';
}

export interface KpiData {
  revenue: Kpi;
  occupancy: Kpi;
  revPAR: Kpi;
  checkIns: Kpi;
}

// FIX: Add FinancialKpiData interface to properly type financialKpiData in constants.ts
export interface FinancialKpiData {
  totalRevenue: Kpi;
  totalExpenses: Kpi;
  netProfit: Kpi;
  adr: Kpi;
}

export interface PerformanceMetric {
  name: string;
  Occupancy: number;
  ADR: number;
  RevPAR: number;
}

export interface ForecastPoint {
  month: string;
  Revenue: number;
  Profit: number;
}

export interface ExpenseCategory {
  name: string;
  value: number;
}

export const expenseCategories = ['Salaries', 'Utilities', 'Marketing', 'Supplies', 'Maintenance', 'Food & Beverage', 'Admin', 'Other'] as const;
export type ExpenseCategoryName = typeof expenseCategories[number];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category?: ExpenseCategoryName;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';

export interface Service {
  id: string;
  name: string;
  price: number;
}

export type AuditActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'SECURITY' | 'STATUS_CHANGE';
export type AuditEntityType = 'Booking' | 'User' | 'Room' | 'Service' | 'Expense' | 'HotelInfo' | 'Customer';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string; // User's name
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  details: string; // JSON string of details
}

export type PaymentMethod = 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Pending';

export interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  roomNumber: string;
  status: BookingStatus;
  roomTotal: number; // Renamed from 'total'
  services: Service[];
  paymentMethod: PaymentMethod;
  guestPreferences?: string;
  guestIdType?: 'Passport' | 'National ID' | 'Driving License';
  guestId?: string;
  isFlagged?: 'no-show' | 'overdue-checkout';
}

export interface Receipt {
  id: string; // e.g., RCPT-BK003
  bookingId: string;
  guestName: string;
  issueDate: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  roomTotal: number;
  services: Service[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
}

export interface ProfitAndLossData {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
}

export type UserRole = 'admin' | 'manager' | 'receptionist' | 'viewer';
export type UserStatus = 'active' | 'blocked' | 'deleted';


export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    password?: string;
}

export type RoomStatus = 'Clean' | 'Dirty' | 'Occupied' | 'Maintenance';
export type InventoryRoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Dirty';

export interface Room {
    id: string;
    roomNumber: string;
    roomType: 'Standard Queen' | 'Deluxe King' | 'Junior Suite' | 'Grand Suite';
    price: number;
    status: RoomStatus;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    totalSpent: number;
    joinDate: string;
}

export interface InventoryRoom {
  id: string;
  block: 'A' | 'B' | 'C' | 'Single';
  status: InventoryRoomStatus;
}

export interface RoomCategory {
  type: 'Standard Queen' | 'Deluxe King' | 'Junior Suite' | 'Grand Suite';
  price: number;
  inventory: {
    A: InventoryRoom[];
    B: InventoryRoom[];
    C: InventoryRoom[];
    Single: InventoryRoom[];
  };
}

export type FeedbackSentiment = 'Positive' | 'Neutral' | 'Negative';
export type FeedbackStatus = 'Approved' | 'Pending';

export interface Feedback {
  id: string;
  guestName: string;
  date: string;
  rating: number; // 1-5
  comment: string;
  sentiment: FeedbackSentiment;
  status: FeedbackStatus;
  roomType: Room['roomType'];
}

export interface HotelInfo {
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  taxRate: number; // As a percentage, e.g., 10 for 10%
}

export type Currency = 'UGX' | 'USD' | 'EUR' | 'GBP';

export type ExchangeRates = { [key in Currency]: number };

export interface FinancialReportData {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    transactions: Transaction[];
    expenseSummary: { category: ExpenseCategoryName; total: number }[];
}

export interface AutomationSettings {
    autoSetRoomDirtyOnCheckout: boolean;
    flagNoShows: boolean;
    flagOverdueCheckouts: boolean;
}

export type Page = 'dashboard' | 'bookings' | 'rooms' | 'customers' | 'feedback' | 'finance' | 'settings' | 'audit';

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTo?: Page;
}

export interface MonthlyRevenueData {
  month: string;
  Rooms: number;
  Services: number;
  Other: number;
}

export interface DashboardData {
  kpis: Kpi[];
  performanceData: PerformanceMetric[];
  assetGrowthData: { month: string; value: number }[];
  expenseData: ExpenseCategory[];
  recentTransactions: Transaction[];
  monthlyRevenueBreakdown: MonthlyRevenueData[];
}