import { Package, Calendar, TrendingUp, Clock, Check, X, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  doses: number;
  requested_delivery_date: string;
  special_instructions?: string;
}

interface StatusHistoryEntry {
  id: number;
  status: string;
  changed_by_username: string;
  changed_at: string;
}

interface Order {
  id: number;
  order_number: string;
  user: number;
  user_username?: string;
  user_company_name?: string;
  status: 'requested' | 'confirmed' | 'prepared' | 'dispatched' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: StatusHistoryEntry[];
  user_detail?: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  company_name?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('confirmed');
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  console.log('Dashboard component rendering', { loading, currentUser: currentUser?.username, ordersCount: orders.length });

  useEffect(() => {
    console.log('Dashboard useEffect running');
    let mounted = true;
    
    // Check if user has a token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found in localStorage');
      setLoading(false);
      return;
    }
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Dashboard loading timed out');
        setLoading(false);
      }
    }, 10000);
    
    (async () => {
      try {
        console.log('Fetching user from /api/auth/user/');
        const userRes = await fetch('/api/auth/user/', { 
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!mounted) {
          console.log('Component unmounted, returning');
          return;
        }
        
        console.log('User response status:', userRes.status);
        if (!userRes.ok) {
          console.log('User not authenticated (status:', userRes.status, '), clearing token');
          localStorage.removeItem('authToken');
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        
        const userData = await userRes.json();
        console.log('User data received:', userData);
        
        if (!userData || !userData.id) {
          console.log('User data is empty or invalid, showing auth required');
          localStorage.removeItem('authToken');
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        
        console.log('Setting current user:', userData.username);
        setCurrentUser(userData);

        // Fetch orders
        console.log('Fetching orders from /api/orders/');
        const ordersRes = await fetch('/api/orders/', { 
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!mounted) {
          console.log('Component unmounted before orders fetch completed');
          clearTimeout(timeoutId);
          return;
        }
        
        console.log('Orders response status:', ordersRes.status);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          console.log('Orders data received:', ordersData);
          // Handle both direct array and paginated response { value: [...] }
          const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData.value || ordersData.results || []);
          console.log('Setting orders list, count:', ordersList.length);
          // Log status_history for first order for debugging
          if (ordersList.length > 0) {
            const firstOrder = ordersList[0];
            console.log(`First order (${firstOrder.order_number}):`, {
              status: firstOrder.status,
              has_status_history: !!firstOrder.status_history,
              history_count: firstOrder.status_history?.length || 0,
              history: firstOrder.status_history
            });
          }
          setOrders(ordersList);
        } else {
          console.warn('Failed to fetch orders:', ordersRes.status);
          setOrders([]);
        }
        
        console.log('Dashboard loading complete, setting loading to false');
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (e) {
        console.error('Error loading dashboard:', e);
        if (mounted) {
          setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    })();
    return () => { 
      console.log('Dashboard useEffect cleanup');
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const isStaff = currentUser?.is_staff || false;

  // Get active orders based on filter
  let activeOrders: Order[] = [];
  if (statusFilter !== 'all') {
    // If a specific status filter is selected, show only that status
    activeOrders = orders
      .filter(o => o.status === statusFilter)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    // Otherwise, show all active orders (not delivered or cancelled)
    activeOrders = orders
      .filter(o => !['delivered', 'cancelled'].includes(o.status))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  const deliveredOrders = orders
    .filter(o => o.status === 'delivered')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Calculate stats
  const openOrdersCount = orders.filter(o => o.status === 'requested' || o.status === 'confirmed').length;
  const upcomingDeliveries = orders.filter(o => o.status === 'dispatched').length;
  const totalOrdersCount = orders.length;
  const deliveredOrdersCount = deliveredOrders.length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;
  const requestedOrdersCount = orders.filter(o => o.status === 'requested').length;

  const handleStatusChange = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setStatusError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Attempting to change order ${selectedOrder.order_number} status to ${newStatus}`);
      
      const response = await fetch(`/api/orders/${selectedOrder.id}/set_status/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Token ${token}` })
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      console.log(`set_status response status: ${response.status}`);
      const responseData = await response.json();
      console.log(`set_status response data:`, responseData);
      
      if (!response.ok) {
        const errorMsg = responseData?.detail || responseData?.error || `Failed to update status (${response.status})`;
        console.error('Status change failed:', errorMsg);
        setStatusError(errorMsg);
        setUpdatingStatus(false);
        return;
      }
      
      // Refetch the updated order to get the new status_history
      console.log(`Refetching order ${selectedOrder.id}`);
      const updatedOrderRes = await fetch(`/api/orders/${selectedOrder.id}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      console.log(`Refetch response status: ${updatedOrderRes.status}`);
      
      if (updatedOrderRes.ok) {
        const updatedOrder = await updatedOrderRes.json();
        console.log(`Order refetched successfully:`, updatedOrder);
        setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setShowStatusDialog(false);
        setSelectedOrder(null);
        setUpdatingStatus(false);
      } else {
        const refetchData = await updatedOrderRes.json();
        console.warn('Order refetch failed:', refetchData);
        // Fallback: just update the status without full order data
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
        setShowStatusDialog(false);
        setSelectedOrder(null);
        setUpdatingStatus(false);
      }
    } catch (e) {
      console.error('Error updating status:', e);
      const errorMsg = e instanceof Error ? e.message : String(e);
      setStatusError(`Error: ${errorMsg}`);
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    const classes: Record<Order['status'], string> = {
      'requested': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'prepared': 'bg-yellow-100 text-yellow-800',
      'dispatched': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const getStaffForStatus = (order: Order, statusType: string): string | null => {
    if (!order.status_history) return null;
    const entry = order.status_history.find(h => h.status === statusType);
    return entry?.changed_by_username || null;
  };

  const renderStatusWithStaff = (order: Order) => {
    const status = order.status;
    return (
      <Badge className={getStatusBadgeClass(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderHorizontalTimeline = (order: Order) => {
    const statusSequence = [
      { status: 'requested', label: 'Requested', isComplete: true },
      { status: 'confirmed', label: 'Confirmed', isComplete: order.status !== 'requested' && order.status !== 'cancelled' },
      { status: 'prepared', label: 'Prepared', isComplete: ['prepared', 'dispatched', 'delivered'].includes(order.status) },
      { status: 'dispatched', label: 'Dispatched', isComplete: ['dispatched', 'delivered'].includes(order.status) },
      { status: 'delivered', label: 'Delivered', isComplete: order.status === 'delivered' },
    ];

    const getNameForStatus = (statusOption: string): string => {
      if (statusOption === 'requested') {
        return order.user_username || 'Client';
      }
      if (!order.status_history) {
        console.warn(`Order ${order.order_number}: no status_history available`);
        return '';
      }
      const entry = order.status_history.find(h => h.status === statusOption);
      const name = entry?.changed_by_username || '';
      if (!entry) {
        console.debug(`Order ${order.order_number}: no history entry for status '${statusOption}'`);
      }
      return name;
    };

    return (
      <div className="overflow-x-auto py-4 px-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <div className="flex items-center gap-4 min-w-max">
          {statusSequence.map((step, idx) => {
            const isCompleted = ['requested', 'confirmed', 'prepared', 'dispatched', 'delivered'].indexOf(step.status) <=
              ['requested', 'confirmed', 'prepared', 'dispatched', 'delivered'].indexOf(order.status);
            const staffName = getNameForStatus(step.status);

            return (
              <div key={step.status} className="flex items-center gap-0">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    isCompleted ? 'bg-green-600' : order.status === step.status ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    ✓
                  </div>
                  <p className="text-xs font-medium mt-2 text-center text-foreground">{step.label}</p>
                  {staffName && (
                    <p className="text-xs text-green-700 font-semibold mt-1 text-center max-w-24 break-words">
                      {staffName}
                    </p>
                  )}
                </div>
                {idx < statusSequence.length - 1 && (
                  <div className={`mx-2 flex-shrink-0 ${isCompleted ? 'text-green-600' : 'text-gray-300'}`}>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    console.log('Dashboard rendering: loading state');
    return (
      <Layout>
        <div className="container-main py-8">
          <div className="bg-blue-200 p-4 rounded mb-4">
            <p className="text-foreground font-bold">Loading dashboard...</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    console.log('Dashboard rendering: no current user, showing auth required');
    return (
      <Layout>
        <div className="container-main py-8 text-center bg-orange-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your dashboard.</p>
          <p className="text-sm text-gray-600 mb-4">Token: {localStorage.getItem('authToken')?.substring(0, 20)}...</p>
          <Button onClick={() => navigate('/signin')}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  console.log('Dashboard rendering: main content', { currentUser, ordersCount: orders.length });

  return (
    <Layout>
      <div className="container-main py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.username}
            {currentUser.company_name && <span className="ml-2">({currentUser.company_name})</span>}
            {isStaff && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Staff</span>}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Open Orders - Only for non-staff */}
          {!isStaff && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Orders</p>
                    <p className="text-3xl font-bold">{openOrdersCount}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Upcoming Deliveries */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(statusFilter === 'dispatched' ? 'all' : 'dispatched')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Deliveries</p>
                  <p className="text-3xl font-bold">{upcomingDeliveries}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'dispatched' ? 'bg-cyan-200' : 'bg-cyan-100'}`}>
                  <Calendar className={`h-6 w-6 ${statusFilter === 'dispatched' ? 'text-cyan-700' : 'text-cyan-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Orders */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrdersCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'all' ? 'bg-green-200' : 'bg-green-100'}`}>
                  <TrendingUp className={`h-6 w-6 ${statusFilter === 'all' ? 'text-green-700' : 'text-green-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Delivered Orders */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(statusFilter === 'delivered' ? 'all' : 'delivered')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered Orders</p>
                  <p className="text-3xl font-bold">{deliveredOrdersCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'delivered' ? 'bg-amber-200' : 'bg-amber-100'}`}>
                  <Clock className={`h-6 w-6 ${statusFilter === 'delivered' ? 'text-amber-700' : 'text-amber-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Confirmed Orders */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(statusFilter === 'confirmed' ? 'all' : 'confirmed')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed Orders</p>
                  <p className="text-3xl font-bold">{confirmedOrdersCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'confirmed' ? 'bg-green-200' : 'bg-green-100'}`}>
                  <Check className={`h-6 w-6 ${statusFilter === 'confirmed' ? 'text-green-700' : 'text-green-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Cancelled Orders */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(statusFilter === 'cancelled' ? 'all' : 'cancelled')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled Orders</p>
                  <p className="text-3xl font-bold">{cancelledOrdersCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'cancelled' ? 'bg-red-200' : 'bg-red-100'}`}>
                  <X className={`h-6 w-6 ${statusFilter === 'cancelled' ? 'text-red-700' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Requested Orders */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(statusFilter === 'requested' ? 'all' : 'requested')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Requested Orders</p>
                  <p className="text-3xl font-bold">{requestedOrdersCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${statusFilter === 'requested' ? 'bg-purple-200' : 'bg-purple-100'}`}>
                  <Package className={`h-6 w-6 ${statusFilter === 'requested' ? 'text-purple-700' : 'text-purple-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* For Non-Staff: Show all active and delivered orders */}
        {!isStaff && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold">Your Orders</h2>
              {statusFilter !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold mb-4">
                  Active Orders
                  {statusFilter !== 'all' && <span className="text-sm text-muted-foreground ml-2">({statusFilter})</span>}
                </h3>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-semibold text-lg">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {renderStatusWithStaff(order)}
                        </div>

                        {/* Product Details */}
                        {order.items && order.items.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity} × {item.doses.toLocaleString()} doses
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Requested: {format(new Date(item.requested_delivery_date), 'MMM d, yyyy')}
                                </p>
                                {item.special_instructions && (
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                    <p className="font-medium text-blue-800 mb-1">Special Instructions:</p>
                                    <p>{item.special_instructions}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Horizontal Timeline */}
                        <div className="mt-6 pt-4 border-t border-border">
                          <h4 className="font-semibold text-foreground mb-3">Order Progress</h4>
                          {renderHorizontalTimeline(order)}
                        </div>

                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Delivered Orders */}
            {deliveredOrders.length > 0 && (
              <div>
                <h3 className="font-heading text-lg font-semibold mb-4">Delivered Orders</h3>
                <div className="space-y-4">
                  {deliveredOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-semibold text-lg">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                        </div>

                        {/* Product Details */}
                        {order.items && order.items.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity} × {item.doses.toLocaleString()} doses
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Requested: {format(new Date(item.requested_delivery_date), 'MMM d, yyyy')}
                                </p>
                                {item.special_instructions && (
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                    <p className="font-medium text-blue-800 mb-1">Special Instructions:</p>
                                    <p>{item.special_instructions}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Horizontal Timeline */}
                        <div className="mt-6 pt-4 border-t border-border">
                          <h4 className="font-semibold text-foreground mb-3">Order Progress</h4>
                          {renderHorizontalTimeline(order)}
                        </div>

                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {orders.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No orders yet. Start browsing the catalog!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* For Staff: Show all orders with status management */}
        {isStaff && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold">All Orders</h2>
              {statusFilter !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Clear Filter ({statusFilter})
                </Button>
              )}
            </div>
            
            {orders.length > 0 ? (
              <div className="space-y-4">
                {[...orders]
                  .filter(o => statusFilter === 'all' ? true : o.status === statusFilter)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-lg">{order.order_number}</p>
                          {order.user_company_name && (
                            <p className="text-sm font-medium text-primary mb-1">{order.user_company_name}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        {renderStatusWithStaff(order)}
                      </div>

                      {/* Product Details */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} × {item.doses.toLocaleString()} doses
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Requested: {format(new Date(item.requested_delivery_date), 'MMM d, yyyy')}
                              </p>
                              {item.special_instructions && (
                                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                  <p className="font-medium text-blue-800 mb-1">Special Instructions:</p>
                                  <p>{item.special_instructions}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Horizontal Status Timeline */}
                      <div className="pt-4">
                        <h4 className="font-semibold text-foreground mb-3">Order Progress</h4>
                        {renderHorizontalTimeline(order)}
                      </div>

                      <div className="flex items-center justify-end mt-4 space-x-2">
                          {order.status === 'requested' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('confirmed');
                                setShowStatusDialog(true);
                              }}
                            >
                              Confirm Order
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('prepared');
                                setShowStatusDialog(true);
                              }}
                            >
                              Mark Prepared
                            </Button>
                          )}
                          {order.status === 'prepared' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('dispatched');
                                setShowStatusDialog(true);
                              }}
                            >
                              Set In Transit
                            </Button>
                          )}
                          {order.status === 'dispatched' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('delivered');
                                setShowStatusDialog(true);
                              }}
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        {/* Status Change Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Order: {selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm font-medium mb-4">Change to: <span className="capitalize text-green-600 font-bold">{newStatus}</span></p>
              <p className="text-sm text-muted-foreground mb-4">
                This will update the order status to "{newStatus}".
              </p>
              {statusError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-sm text-red-700 font-medium">Error:</p>
                  <p className="text-sm text-red-600">{statusError}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowStatusDialog(false);
                  setStatusError(null);
                }}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusChange}
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Updating...' : 'Confirm Change'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
