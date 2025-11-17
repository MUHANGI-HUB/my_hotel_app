
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { PerformanceChart } from './components/PerformanceChart';
import { ExpenseChart } from './components/ExpenseChart';
import { DataTable } from './components/DataTable';
import { BedIcon, DollarSignIcon, SpinnerIcon, TrendingUpIcon, UsersIcon } from './components/icons';
import { LoginPage } from './components/LoginPage';
import { BookingManagement } from './components/BookingManagement';
import { User, Booking, AuditLogEntry, Service, Transaction, HotelInfo, RoomCategory, InventoryRoomStatus, Currency, ExchangeRates, BookingStatus, Customer, UserStatus, InventoryRoom, AuditActionType, AuditEntityType, AutomationSettings, Page, NotificationItem, Kpi, PerformanceMetric, ExpenseCategory, DashboardData } from './types';
import { AccessDenied } from './components/AccessDenied';
import { hasPermission } from './utils/auth';
import { CustomerManagement } from './components/CustomerManagement';
import { FinanceDashboard } from './components/FinanceDashboard';
import { SettingsPage } from './components/SettingsPage';
import { RoomsPage } from './components/RoomInventory';
import { FeedbackManagement } from './components/FeedbackManagement';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { Notification } from './components/Notification';
import { AuditLogPage } from './components/AuditLogPage';
import * as api from './utils/api';
import { AssetGrowthChart } from './components/AssetGrowthChart';


type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // State for all application data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [roomInventory, setRoomInventory] = useState<RoomCategory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings | null>(null);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('UGX');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  
  // State for computed dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Initial data fetch from API layer
  useEffect(() => {
    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            const [
                fetchedBookings,
                fetchedServices,
                fetchedTransactions,
                fetchedHotelInfo,
                fetchedInventory,
                fetchedCustomers,
                fetchedUsers,
                fetchedRates,
                fetchedAuditLog,
                fetchedAutomationSettings,
            ] = await Promise.all([
                api.fetchBookings(),
                api.fetchServices(),
                api.fetchTransactions(),
                api.fetchHotelInfo(),
                api.fetchInventory(),
                api.fetchCustomers(),
                api.fetchUsers(),
                api.fetchExchangeRates(),
                api.fetchAuditLog(),
                api.fetchAutomationSettings(),
            ]);
            setBookings(fetchedBookings);
            setServices(fetchedServices);
            setTransactions(fetchedTransactions);
            setHotelInfo(fetchedHotelInfo);
            setRoomInventory(fetchedInventory);
            setCustomers(fetchedCustomers);
            setUsers(fetchedUsers);
            setExchangeRates(fetchedRates);
            setAuditLog(fetchedAuditLog);
            setAutomationSettings(fetchedAutomationSettings);
            
            // Fetch computed dashboard data
            const dashboard = await api.fetchDashboardData(fetchedBookings, fetchedInventory, fetchedTransactions);
            setDashboardData(dashboard);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showNotification("Could not load application data. Please refresh.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    // This effect simulates a daily check for no-shows and overdue checkouts.
    // In a real application, this would be a scheduled task on a server.
    if (!automationSettings) return;

    const checkBookings = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setBookings(currentBookings => {
            let needsUpdate = false;
            const updatedBookings = currentBookings.map(b => {
                let newFlag: Booking['isFlagged'] = b.isFlagged || undefined;

                // Flag potential no-shows
                if (automationSettings.flagNoShows && b.status === 'Confirmed' && new Date(b.checkIn) < today) {
                    newFlag = 'no-show';
                }

                // Flag overdue checkouts
                if (automationSettings.flagOverdueCheckouts && b.status === 'Checked-in' && new Date(b.checkOut) < today) {
                    newFlag = 'overdue-checkout';
                }
                
                // Clear flag if condition no longer met (e.g., status changed)
                if ((!automationSettings.flagNoShows && b.isFlagged === 'no-show') || 
                    (!automationSettings.flagOverdueCheckouts && b.isFlagged === 'overdue-checkout') ||
                    (b.status !== 'Confirmed' && b.isFlagged === 'no-show') ||
                    (b.status !== 'Checked-in' && b.isFlagged === 'overdue-checkout'))
                {
                    newFlag = undefined;
                }


                if (b.isFlagged !== newFlag) {
                    needsUpdate = true;
                    return { ...b, isFlagged: newFlag };
                }
                return b;
            });

            if (needsUpdate) {
                return updatedBookings;
            }
            return currentBookings;
        });
    };

    checkBookings();
  }, [automationSettings?.flagNoShows, automationSettings?.flagOverdueCheckouts, currentPage]); // Re-run on settings change or page navigation
  
  // Real-time notification simulation
  useEffect(() => {
    if (!user) return; // Only run when a user is logged in
    
    const interval = setInterval(() => {
      addNotification(`New booking created for 'Online Customer'`, 'bookings');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const addNotification = (message: string, linkTo?: Page) => {
    const newNotification: NotificationItem = {
      id: `N-${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };


  const handleCreateAuditLogEntry = async (
    actionType: AuditActionType,
    entityType: AuditEntityType,
    entityId: string,
    details: object | string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      user: user?.name || 'System',
      actionType,
      entityType,
      entityId,
      details: typeof details === 'string' ? details : JSON.stringify(details, null, 2),
    };
    await api.createAuditLogEntry(newEntry);
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    handleCreateAuditLogEntry('LOGIN', 'User', loggedInUser.id.toString(), { name: loggedInUser.name });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (user) {
      handleCreateAuditLogEntry('LOGOUT', 'User', user.id.toString(), { name: user.name });
    }
    setUser(null);
  };
  
 const handleCheckIn = async (bookingId: string) => {
    try {
        const { updatedBooking } = await api.updateBookingStatus(bookingId, 'Checked-in');
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));
        handleCreateAuditLogEntry('STATUS_CHANGE', 'Booking', bookingId, { from: 'Confirmed', to: 'Checked-in' });
        showNotification(`Booking ${bookingId} checked in successfully.`, 'success');
        addNotification(`Guest ${updatedBooking.guestName} has checked in.`, 'bookings');
    } catch (error) {
        showNotification(`Failed to check in booking ${bookingId}.`, 'error');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
     try {
        const { updatedBooking, updatedRoom } = await api.updateBookingStatus(bookingId, 'Checked-out', undefined, automationSettings!.autoSetRoomDirtyOnCheckout);
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));
        handleCreateAuditLogEntry('STATUS_CHANGE', 'Booking', bookingId, { from: 'Checked-in', to: 'Checked-out' });
        showNotification(`Booking ${bookingId} checked out.`, 'success');
        addNotification(`Guest ${updatedBooking.guestName} has checked out.`, 'bookings');

        if (updatedRoom) {
            handleUpdateRoomStatus(updatedRoom.id, updatedRoom.status, true);
            setTimeout(() => {
              showNotification(`Room ${updatedBooking.roomNumber} automatically set to 'Dirty'.`, 'success');
            }, 500);
        }
    } catch (error) {
        showNotification(`Failed to check out booking ${bookingId}.`, 'error');
    }
  };

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
        const { updatedBooking } = await api.updateBookingStatus(bookingId, 'Cancelled', reason);
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));
        handleCreateAuditLogEntry('STATUS_CHANGE', 'Booking', bookingId, { from: 'Confirmed', to: 'Cancelled', reason });
        showNotification(`Booking ${bookingId} has been cancelled.`, 'error');
        addNotification(`Booking for ${updatedBooking.guestName} was cancelled.`, 'bookings');
    } catch (error) {
        showNotification(`Failed to cancel booking ${bookingId}.`, 'error');
    }
  };

  const handleSaveBooking = async (updatedBooking: Booking, logMessage: string) => {
     try {
        const savedBooking = await api.updateBooking(updatedBooking);
        setBookings(bookings.map(b => b.id === savedBooking.id ? savedBooking : b));
        handleCreateAuditLogEntry('UPDATE', 'Booking', savedBooking.id, { summary: logMessage });
        showNotification(`Booking ${savedBooking.id} updated.`, 'success');
    } catch (error) {
        showNotification(`Failed to update booking ${updatedBooking.id}.`, 'error');
    }
  };

 const handleCreateBooking = async (bookingData: Omit<Booking, 'id' | 'status'> & { id?: string; guestEmail: string; guestPhone: string; }) => {
    try {
        const { newBooking, updatedCustomer } = await api.createBooking(bookingData);
        setBookings(prev => [newBooking, ...prev]);

        if (updatedCustomer.isNew) {
            setCustomers(prev => [updatedCustomer.customer, ...prev]);
            handleCreateAuditLogEntry('CREATE', 'Customer', updatedCustomer.customer.id, { name: updatedCustomer.customer.name });
        } else {
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.customer.id ? updatedCustomer.customer : c));
        }

        handleCreateAuditLogEntry('CREATE', 'Booking', newBooking.id, { guestName: newBooking.guestName });
        showNotification(`New booking ${newBooking.id} created successfully.`, 'success');
        addNotification(`New booking for ${newBooking.guestName} in room ${newBooking.roomNumber}.`, 'bookings');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, "error");
        } else {
            showNotification("Failed to create booking.", "error");
        }
    }
  };

  const handleUpdateRoomStatus = async (roomId: string, newStatus: InventoryRoomStatus, fromAutomation: boolean = false) => {
    try {
        const updatedInventory = await api.updateRoomStatus(roomId, newStatus);
        setRoomInventory(updatedInventory);
        if (!fromAutomation) {
            handleCreateAuditLogEntry('UPDATE', 'Room', roomId, { summary: `Status updated to ${newStatus}` });
            showNotification(`Room status updated to ${newStatus}.`, 'success');
        }
    } catch (error) {
        showNotification(`Failed to update room status.`, 'error');
    }
  };

  const handleSaveCustomer = async (customer: Customer) => {
    try {
        const updatedCustomer = await api.updateCustomer(customer);
        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        handleCreateAuditLogEntry('UPDATE', 'Customer', updatedCustomer.id, { summary: `Updated details for ${updatedCustomer.name}.` });
        showNotification(`Customer ${updatedCustomer.name} updated.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Failed to update customer.', 'error');
        }
    }
  };

  const handleCreateService = async (service: Omit<Service, 'id'>) => {
    try {
        const newService = await api.createService(service);
        setServices(prev => [newService, ...prev]);
        handleCreateAuditLogEntry('CREATE', 'Service', newService.id, newService);
        showNotification(`Service "${newService.name}" created.`, 'success');
    } catch (error) {
        showNotification('Failed to create service.', 'error');
    }
  };

  const handleUpdateService = async (service: Service) => {
      try {
        const updatedService = await api.updateService(service);
        setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
        handleCreateAuditLogEntry('UPDATE', 'Service', updatedService.id, updatedService);
        showNotification(`Service "${updatedService.name}" updated.`, 'success');
      } catch (error) {
        showNotification('Failed to update service.', 'error');
      }
  };

  const handleDeleteService = async (serviceId: string) => {
      try {
        const serviceName = services.find(s => s.id === serviceId)?.name || 'Unknown';
        await api.deleteService(serviceId);
        setServices(prev => prev.filter(s => s.id !== serviceId));
        handleCreateAuditLogEntry('DELETE', 'Service', serviceId, {name: serviceName});
        showNotification(`Service "${serviceName}" deleted.`, 'error');
      } catch (error) {
        showNotification('Failed to delete service.', 'error');
      }
  };
  
  const handleCreateExpense = async (expense: Omit<Transaction, 'id' | 'type'>) => {
      try {
        const newExpense = await api.createExpense(expense);
        setTransactions(prev => [newExpense, ...prev]);
        handleCreateAuditLogEntry('CREATE', 'Expense', newExpense.id, newExpense);
        showNotification(`Expense for "${newExpense.description}" added.`, 'success');
      } catch (error) {
        showNotification('Failed to create expense.', 'error');
      }
  };

  const handleUpdateExpense = async (expense: Transaction) => {
      try {
        const updatedExpense = await api.updateExpense(expense);
        setTransactions(prev => prev.map(t => t.id === updatedExpense.id ? updatedExpense : t));
        handleCreateAuditLogEntry('UPDATE', 'Expense', updatedExpense.id, updatedExpense);
        showNotification(`Expense "${updatedExpense.description}" updated.`, 'success');
      } catch (error) {
        showNotification('Failed to update expense.', 'error');
      }
  };

  const handleDeleteExpense = async (transactionId: string) => {
      try {
        const expenseDesc = transactions.find(t => t.id === transactionId)?.description || 'Unknown';
        await api.deleteExpense(transactionId);
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        handleCreateAuditLogEntry('DELETE', 'Expense', transactionId, { description: expenseDesc});
        showNotification(`Expense for "${expenseDesc}" deleted.`, 'error');
      } catch (error) {
        showNotification('Failed to delete expense.', 'error');
      }
  };

  const handleCreateUser = async (userData: Omit<User, 'id' | 'status'>) => {
    try {
        const newUser = await api.createUser(userData);
        setUsers(prev => [newUser, ...prev]);
        handleCreateAuditLogEntry('CREATE', 'User', newUser.id.toString(), { name: newUser.name, role: newUser.role });
        showNotification(`User ${newUser.name} created.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Failed to create user.', 'error');
        }
    }
  };

  const handleUpdateUser = async (userToUpdate: User) => {
    try {
        const updatedUser = await api.updateUser(userToUpdate);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        handleCreateAuditLogEntry('UPDATE', 'User', updatedUser.id.toString(), { name: updatedUser.name });
        showNotification(`User ${updatedUser.name} updated.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Failed to update user.', 'error');
        }
    }
  };

  const handleUpdateUserStatus = async (userId: number, newStatus: UserStatus) => {
    try {
        const updatedUser = await api.updateUserStatus(userId, newStatus);
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        handleCreateAuditLogEntry('STATUS_CHANGE', 'User', userId.toString(), { newStatus });
        showNotification(`User status updated to ${newStatus}.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification('Failed to update user status.', 'error');
        }
    }
  };

  const handleUpdateHotelInfo = async (updatedInfo: HotelInfo) => {
    try {
        const savedInfo = await api.updateHotelInfo(updatedInfo);
        setHotelInfo(savedInfo);
        showNotification('Hotel information updated successfully.', 'success');
        handleCreateAuditLogEntry('UPDATE', 'HotelInfo', 'GENERAL', 'Updated hotel branding or financial settings.');
    } catch (error) {
        showNotification('Failed to update hotel information.', 'error');
    }
  };

  const handleUpdateRoomPrices = async (updates: { type: RoomCategory['type'], price: number }[]) => {
      try {
          const updatedInventory = await api.updateRoomPrices(updates);
          setRoomInventory(updatedInventory);
          handleCreateAuditLogEntry('UPDATE', 'HotelInfo', 'RoomPrices', { updates });
          showNotification(`Room prices updated.`, 'success');
      } catch (error) {
          if (error instanceof Error) {
            showNotification(error.message, 'error');
          } else {
            showNotification(`Failed to update room prices.`, 'error');
          }
      }
  };

  const handleCreateRoom = async (newRoomData: { name: string; type: RoomCategory['type']; status: InventoryRoomStatus; }) => {
    try {
        const updatedInventory = await api.createRoom(newRoomData);
        setRoomInventory(updatedInventory);
        handleCreateAuditLogEntry('CREATE', 'Room', newRoomData.name, newRoomData);
        showNotification(`Room ${newRoomData.name} created.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification(`Failed to create room.`, 'error');
        }
    }
  };

  const handleUpdateRoom = async (roomId: string, newName: string) => {
    try {
        const { updatedInventory, updatedBookings } = await api.updateRoom(roomId, newName);
        setRoomInventory(updatedInventory);
        setBookings(updatedBookings);
        handleCreateAuditLogEntry('UPDATE', 'Room', roomId, { newName });
        showNotification(`Room ${newName} updated successfully.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification(`Failed to update room.`, 'error');
        }
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
        const updatedInventory = await api.deleteRoom(roomId);
        setRoomInventory(updatedInventory);
        handleCreateAuditLogEntry('DELETE', 'Room', roomId, {});
        showNotification(`Room ${roomId} deleted.`, 'success');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message, 'error');
        } else {
            showNotification(`Failed to delete room.`, 'error');
        }
    }
  };

  const handleUpdateAutomationSettings = async (settings: AutomationSettings) => {
    try {
        const updatedSettings = await api.updateAutomationSettings(settings);
        setAutomationSettings(updatedSettings);
        handleCreateAuditLogEntry('UPDATE', 'HotelInfo', 'AUTOMATION', 'Updated automation settings.');
    } catch (error) {
        showNotification('Failed to update automation settings.', 'error');
    }
  };

  const getKpiIcon = (title: string) => {
    switch (title) {
        case "Today's Revenue": return <DollarSignIcon className="h-8 w-8 text-satin-gold/80" />;
        case "Occupancy": return <BedIcon className="h-8 w-8 text-satin-gold/80" />;
        case "RevPAR": return <TrendingUpIcon className="h-8 w-8 text-satin-gold/80" />;
        case "Pending Check-ins": return <UsersIcon className="h-8 w-8 text-satin-gold/80" />;
        default: return <DollarSignIcon className="h-8 w-8 text-satin-gold/80" />;
    }
  }

  const renderPage = () => {
    if (!user || !hasPermission(user.role, currentPage)) {
      return <AccessDenied />;
    }
    switch (currentPage) {
      case 'dashboard':
        if (user.role === 'receptionist') {
            return <ReceptionistDashboard 
              user={user} 
              onNavigate={setCurrentPage} 
              bookings={bookings} 
              services={services} 
              onCheckIn={handleCheckIn} 
              onCheckOut={handleCheckOut} 
              onSaveBooking={handleSaveBooking} 
              onCancelBooking={handleCancelBooking} 
              selectedCurrency={selectedCurrency} 
              exchangeRates={exchangeRates!} 
              auditLog={auditLog} 
              inventory={roomInventory}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              hotelInfo={hotelInfo!}
            />;
        }
        if (!dashboardData) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <SpinnerIcon className="h-8 w-8 text-satin-gold" />
                    <p className="mt-4 text-ivory/80">Loading Dashboard Data...</p>
                </div>
            );
        }
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.kpis.map((kpi) => (
                    <KpiCard key={kpi.title} {...kpi} icon={getKpiIcon(kpi.title)} selectedCurrency={selectedCurrency} exchangeRates={exchangeRates!} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-charcoal dark:border dark:border-ivory/10 p-6 rounded-lg shadow-lg"><h3 className="font-serif text-xl mb-4 text-charcoal dark:text-ivory">Monthly Performance</h3><PerformanceChart data={dashboardData.performanceData} selectedCurrency={selectedCurrency} theme={theme} /></div>
                <div className="bg-white dark:bg-charcoal dark:border dark:border-ivory/10 p-6 rounded-lg shadow-lg"><h3 className="font-serif text-xl mb-4 text-charcoal dark:text-ivory">Business Value Growth</h3><AssetGrowthChart data={dashboardData.assetGrowthData} selectedCurrency={selectedCurrency} theme={theme} /></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-charcoal dark:border dark:border-ivory/10 p-6 rounded-lg shadow-lg"><h3 className="font-serif text-xl mb-4 text-charcoal dark:text-ivory">Expense Breakdown</h3><ExpenseChart data={dashboardData.expenseData} theme={theme} /></div>
                <div className="lg:col-span-2 bg-white dark:bg-charcoal dark:border dark:border-ivory/10 p-6 rounded-lg shadow-lg"><h3 className="font-serif text-xl mb-4 text-charcoal dark:text-ivory">Recent Transactions</h3><DataTable data={dashboardData.recentTransactions} selectedCurrency={selectedCurrency} exchangeRates={exchangeRates!} /></div>
            </div>
          </div>
        );
      case 'bookings':
        return <BookingManagement user={user} bookings={bookings} services={services} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} onCancelBooking={handleCancelBooking} onSaveBooking={handleSaveBooking} onCreateBooking={handleCreateBooking} selectedCurrency={selectedCurrency} exchangeRates={exchangeRates!} auditLog={auditLog} hotelInfo={hotelInfo!} />;
      case 'rooms':
        return <RoomsPage userRole={user.role} inventory={roomInventory} onUpdateStatus={handleUpdateRoomStatus} selectedCurrency={selectedCurrency} exchangeRates={exchangeRates!} />;
      case 'customers':
        return <CustomerManagement userRole={user.role} customers={customers} onSaveCustomer={handleSaveCustomer} selectedCurrency={selectedCurrency} exchangeRates={exchangeRates!} />;
      case 'feedback':
        return <FeedbackManagement userRole={user.role} />;
      case 'finance':
        if (!dashboardData) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <SpinnerIcon className="h-8 w-8 text-satin-gold" />
                    <p className="mt-4 text-charcoal dark:text-ivory/80">Loading Financial Data...</p>
                </div>
            );
        }
        return <FinanceDashboard 
            userRole={user.role} 
            transactions={transactions} 
            bookings={bookings} 
            services={services} 
            inventory={roomInventory} 
            customers={customers} 
            selectedCurrency={selectedCurrency} 
            exchangeRates={exchangeRates!} 
            theme={theme}
            monthlyRevenueBreakdown={dashboardData.monthlyRevenueBreakdown}
        />;
      case 'settings':
        return <SettingsPage 
          user={user} 
          hotelInfo={hotelInfo!}
          onUpdateHotelInfo={handleUpdateHotelInfo}
          services={services}
          transactions={transactions}
          onCreateService={handleCreateService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onCreateExpense={handleCreateExpense}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
          selectedCurrency={selectedCurrency}
          exchangeRates={exchangeRates!}
          users={users}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onUpdateUserStatus={handleUpdateUserStatus}
          roomCategories={roomInventory}
          onUpdateRoomPrices={handleUpdateRoomPrices}
          bookings={bookings}
          onCreateRoom={handleCreateRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
          automationSettings={automationSettings!}
          onUpdateAutomationSettings={handleUpdateAutomationSettings}
          createAuditLogEntry={handleCreateAuditLogEntry}
        />;
      case 'audit':
        return <AuditLogPage auditLog={auditLog} users={users} />;
      default:
        return <div>Page not found</div>;
    }
  };

  if (isLoading || !exchangeRates || !hotelInfo || !automationSettings) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-charcoal text-ivory">
            <h1 className="font-serif text-5xl text-satin-gold tracking-wider">MIRONA</h1>
            <SpinnerIcon className="h-8 w-8 text-satin-gold" />
            <p className="mt-4 text-ivory/80">Loading Hotel Management System...</p>
        </div>
    );
  }
  
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-ivory/50 dark:bg-charcoal-light/80 font-sans text-charcoal dark:text-ivory/90">
      <Sidebar hotelInfo={hotelInfo} userRole={user.role} currentPage={currentPage} onNavigate={setCurrentPage} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            userName={user.name} 
            title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} 
            onMenuClick={() => setIsSidebarOpen(true)} 
            selectedCurrency={selectedCurrency} 
            onCurrencyChange={setSelectedCurrency}
            notifications={notifications}
            onMarkNotificationsRead={markAllNotificationsAsRead}
            onNavigate={setCurrentPage}
            theme={theme}
            onToggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;