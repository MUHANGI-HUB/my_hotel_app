import { FinancialKpiData, HotelInfo, KpiData, PerformanceMetric, ForecastPoint, ExpenseCategory, Transaction, Booking, Room, Customer, User, RoomCategory, InventoryRoomStatus, InventoryRoom, Feedback, Service, Receipt, ProfitAndLossData } from './types';

// NOTE: All monetary values in this file are stored in UGX as the base currency.
// They will be converted to the user-selected currency in the application.

export const COLORS = {
  charcoal: '#2F4F4F',
  'charcoal-light': '#36454F',
  satinGold: '#CFB53B',
  ivory: '#FFFFF0',
  deepNavy: '#000080',
  burgundy: '#800020',
  accentGreen: '#50C878',
  accentRed: '#D70040',
};

export const hotelInfoData: HotelInfo = {
  name: 'MIRONA',
  logoUrl: '', // Start with no logo
  address: '123 Luxury Lane, Elegance City, 10001',
  email: 'contact@mironahotel.com',
  taxRate: 10, // Default 10% tax rate
};

// FIX: Apply the FinancialKpiData interface to ensure correct typing for formatAs property.
export const financialKpiData: FinancialKpiData = {
  totalRevenue: { title: "Total Revenue (YTD)", value: 4620000000, change: 12.5, formatAs: 'currency' },
  totalExpenses: { title: "Total Expenses (YTD)", value: 2887500000, change: 8.1, formatAs: 'currency' },
  netProfit: { title: "Net Profit (YTD)", value: 1732500000, change: 18.2, formatAs: 'currency' },
  adr: { title: "Average Daily Rate", value: 808500, change: 4.7, formatAs: 'currency' },
}

export const profitAndLossData: ProfitAndLossData[] = [
  { month: 'Jan', revenue: 577500000, expenses: 385000000, netProfit: 192500000 },
  { month: 'Feb', revenue: 635250000, expenses: 423500000, netProfit: 211750000 },
  { month: 'Mar', revenue: 808500000, expenses: 481250000, netProfit: 327250000 },
  { month: 'Apr', revenue: 885500000, expenses: 519750000, netProfit: 365750000 },
  { month: 'May', revenue: 981750000, expenses: 539000000, netProfit: 442750000 },
  { month: 'Jun', revenue: 1116500000, expenses: 596750000, netProfit: 519750000 },
];

export const transactionData: Transaction[] = [
    { id: 'TXN001', date: '2023-06-15', description: 'Booking - John Smith', amount: 1732500, type: 'Income' },
    { id: 'TXN002', date: '2023-06-15', description: 'Linen Supply Co.', amount: -4621925, type: 'Expense', category: 'Supplies' },
    { id: 'TXN003', date: '2023-06-14', description: 'Restaurant Revenue', amount: 8857813, type: 'Income' },
    { id: 'TXN004', date: '2023-06-14', description: 'Booking - Emily White', amount: 2387000, type: 'Income' },
    { id: 'TXN005', date: '2023-06-13', description: 'Marketing Campaign', amount: -9625000, type: 'Expense', category: 'Marketing' },
    { id: 'TXN006', date: '2023-06-13', description: 'Energy Bill', amount: -3273463, type: 'Expense', category: 'Utilities' },
];

export const servicesData: Service[] = [
    { id: 'SVC01', name: 'Airport Transfer', price: 288750 },
    { id: 'SVC02', name: 'Spa Treatment', price: 577500 },
    { id: 'SVC03', name: 'Champagne on Arrival', price: 192500 },
    { id: 'SVC04', name: 'Late Check-out', price: 231000 },
    { id: 'SVC05', name: 'Laundry Service', price: 173250 },
];

export const bookingData: Booking[] = [
    { 
        id: 'BK001', 
        guestName: 'Eleanor Vance', 
        checkIn: '2024-07-20', 
        checkOut: '2024-07-25', 
        roomType: 'Grand Suite', 
        roomNumber: 'A1',
        status: 'Confirmed', 
        roomTotal: 10587500, 
        services: [],
        paymentMethod: 'Pending',
        guestPreferences: 'High floor, extra pillows required.' 
    },
    { 
        id: 'BK002', 
        guestName: 'Arthur Pendelton', 
        checkIn: '2024-07-18', 
        checkOut: '2024-07-22', 
        roomType: 'Deluxe King', 
        roomNumber: 'C5',
        status: 'Checked-in', 
        roomTotal: 6930000,
        services: [servicesData[0]], // Airport Transfer
        paymentMethod: 'Credit Card',
        guestPreferences: 'Quiet room, away from the elevator.',
        guestIdType: 'Passport',
        guestId: 'P12345678',
    },
    { 
        id: 'BK003', 
        guestName: 'Beatrice Montague', 
        checkIn: '2024-07-15', 
        checkOut: '2024-07-19', 
        roomType: 'Junior Suite', 
        roomNumber: 'B12',
        status: 'Checked-out', 
        roomTotal: 5775000,
        services: [],
        paymentMethod: 'Cash',
    },
    { 
        id: 'BK004', 
        guestName: 'Charles Worthington', 
        checkIn: '2024-07-21', 
        checkOut: '2024-07-23', 
        roomType: 'Standard Queen', 
        roomNumber: 'Lion',
        status: 'Cancelled', 
        roomTotal: 1347500,
        services: [],
        paymentMethod: 'Pending',
    },
    { 
        id: 'BK005', 
        guestName: 'Diana Prince', 
        checkIn: '2024-08-01', 
        checkOut: '2024-08-05', 
        roomType: 'Deluxe King', 
        roomNumber: 'C8',
        status: 'Confirmed', 
        roomTotal: 6930000,
        services: [servicesData[1], servicesData[2]], // Spa, Champagne
        paymentMethod: 'Pending',
    },
    { 
        id: 'BK006', 
        guestName: 'Bruce Wayne', 
        checkIn: '2024-08-02', 
        checkOut: '2024-08-10', 
        roomType: 'Grand Suite', 
        roomNumber: 'A3',
        status: 'Confirmed', 
        roomTotal: 20020000,
        services: [],
        paymentMethod: 'Bank Transfer',
    },
];

export const receiptsData: Receipt[] = [
    {
        id: 'RCPT-001',
        bookingId: 'BK003',
        guestName: 'Beatrice Montague',
        issueDate: '2024-07-19',
        roomType: 'Junior Suite',
        checkIn: '2024-07-15',
        checkOut: '2024-07-19',
        roomTotal: 5775000,
        services: [],
        subtotal: 5775000,
        tax: 577500,
        grandTotal: 6352500,
        paymentMethod: 'Cash',
    },
    {
        id: 'RCPT-002',
        bookingId: 'BK002',
        guestName: 'Arthur Pendelton',
        issueDate: '2024-07-22',
        roomType: 'Deluxe King',
        checkIn: '2024-07-18',
        checkOut: '2024-07-22',
        roomTotal: 6930000,
        services: [servicesData[0]],
        subtotal: 7218750,
        tax: 721875,
        grandTotal: 7940625,
        paymentMethod: 'Credit Card',
    }
];


export const feedbackData: Feedback[] = [
    { id: 'F001', guestName: 'Eleanor Vance', date: '2024-07-26', rating: 5, comment: 'Absolutely breathtaking experience. The suite was magnificent and the service was impeccable from start to finish. A true definition of luxury. We will be back!', sentiment: 'Positive', status: 'Approved', roomType: 'Grand Suite' },
    { id: 'F002', guestName: 'Arthur Pendelton', date: '2024-07-23', rating: 4, comment: 'A wonderful stay. The room was very comfortable and quiet, just as I requested. The breakfast spread was delightful. The check-in process was a bit slow, but otherwise perfect.', sentiment: 'Positive', status: 'Approved', roomType: 'Deluxe King' },
    { id: 'F003', guestName: 'Beatrice Montague', date: '2024-07-20', rating: 3, comment: 'The room was clean and the bed was comfortable. However, the air conditioning was a bit noisy which affected my sleep. It was an average stay, not bad but not exceptional.', sentiment: 'Neutral', status: 'Pending', roomType: 'Junior Suite' },
    { id: 'F004', guestName: 'Diana Prince', date: '2024-06-15', rating: 5, comment: 'Every detail was attended to. The staff addressed me by name and anticipated my needs. The spa is a must-visit. Mirona sets the standard for five-star hospitality.', sentiment: 'Positive', status: 'Approved', roomType: 'Deluxe King' },
    { id: 'F005', guestName: 'Anonymous', date: '2024-06-10', rating: 2, comment: 'Disappointed with the value. For the price, I expected more. The minibar was not restocked daily and room service took over an hour for a simple order. The decor is beautiful but the service needs improvement.', sentiment: 'Negative', status: 'Pending', roomType: 'Standard Queen' },
];

export const roomTypeImages: Record<Room['roomType'], string> = {
    'Grand Suite': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'Junior Suite': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'Deluxe King': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'Standard Queen': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
};

export const roomData: Room[] = [
    { id: 'R101', roomNumber: '101', roomType: 'Standard Queen', price: 673750, status: 'Clean' },
    { id: 'R102', roomNumber: '102', roomType: 'Standard Queen', price: 673750, status: 'Occupied' },
    { id: 'R201', roomNumber: '201', roomType: 'Deluxe King', price: 1058750, status: 'Dirty' },
    { id: 'R202', roomNumber: '202', roomType: 'Deluxe King', price: 1058750, status: 'Clean' },
    { id: 'R301', roomNumber: '301', roomType: 'Junior Suite', price: 1732500, status: 'Maintenance' },
    { id: 'R302', roomNumber: '302', roomType: 'Junior Suite', price: 1732500, status: 'Clean' },
    { id: 'R401', roomNumber: '401', roomType: 'Grand Suite', price: 2502500, status: 'Occupied' },
    { id: 'R402', roomNumber: '402', roomType: 'Grand Suite', price: 2502500, status: 'Clean' },
];

export const customerData: Customer[] = [
    { id: 'C001', name: 'Eleanor Vance', email: 'e.vance@example.com', phone: '555-0101', totalBookings: 3, totalSpent: 31762500, joinDate: '2022-03-15' },
    { id: 'C002', name: 'Arthur Pendelton', email: 'a.pendelton@example.com', phone: '555-0102', totalBookings: 5, totalSpent: 48125000, joinDate: '2021-11-20' },
    { id: 'C003', name: 'Beatrice Montague', email: 'b.montague@example.com', phone: '555-0103', totalBookings: 1, totalSpent: 5775000, joinDate: '2023-01-10' },
    { id: 'C004', name: 'Charles Worthington', email: 'c.worthington@example.com', phone: '555-0104', totalBookings: 2, totalSpent: 2695000, joinDate: '2023-05-02' },
];

export const usersData: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@mironahotel.com', role: 'admin', status: 'active', password: 'adminpass' },
    { id: 2, name: 'Manager User', email: 'manager@mironahotel.com', role: 'manager', status: 'active', password: 'managerpass' },
    { id: 3, name: 'Receptionist User', email: 'reception@mironahotel.com', role: 'receptionist', status: 'active', password: 'receptionpass' },
    { id: 4, name: 'Viewer User', email: 'viewer@mironahotel.com', role: 'viewer', status: 'active', password: 'viewerpass' },
];

export const roomInventoryStatusColors: Record<InventoryRoomStatus, string> = {
  Available: 'bg-green-600',
  Occupied: 'bg-deep-navy',
  Dirty: 'bg-yellow-500',
  Maintenance: 'bg-burgundy',
};

const singleRoomNames = ['Lion', 'Tiger', 'Bear', 'Wolf', 'Eagle', 'Falcon', 'Shark', 'Dolphin', 'Stag', 'Boar', 'Bison', 'Cobra', 'Panther', 'Jaguar', 'Leopard', 'Grizzly', 'Orca', 'Rhino', 'Viper', 'Kodiak'];

const generateRooms = (block: 'A' | 'B' | 'C' | 'Single', count: number, prefix: string): InventoryRoom[] => {
    const statuses: InventoryRoomStatus[] = ['Available', 'Occupied', 'Maintenance', 'Dirty'];
    const rooms: InventoryRoom[] = [];
    for (let i = 1; i <= count; i++) {
        const name = block === 'Single' ? singleRoomNames[i-1] : `${block}${i}`;
        if (!name) continue; // handle case where count > singleRoomNames.length
        rooms.push({
            id: `${prefix}-${name}`,
            block: block,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    return rooms;
}

export const inventoryData: RoomCategory[] = [
    {
        type: 'Grand Suite',
        price: 2502500,
        inventory: {
            A: generateRooms('A', 10, 'GS'),
            B: [],
            C: [],
            Single: [],
        }
    },
    {
        type: 'Junior Suite',
        price: 1732500,
        inventory: {
            A: [],
            B: generateRooms('B', 20, 'JS'),
            C: [],
            Single: [],
        }
    },
    {
        type: 'Deluxe King',
        price: 1058750,
        inventory: {
            A: [],
            B: [],
            C: generateRooms('C', 20, 'DK'),
            Single: [],
        }
    },
    {
        type: 'Standard Queen',
        price: 673750,
        inventory: {
            A: [],
            B: [],
            C: [],
            Single: generateRooms('Single', 15, 'SQ'),
        }
    }
];