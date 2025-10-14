import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { 
  FaShoppingCart, 
  FaDollarSign, 
  FaBox, 
  FaUsers,
  FaCalendarAlt
} from "react-icons/fa";
import { FiTrendingUp } from 'react-icons/fi';



const AdminStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    monthlyRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch total orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.pricing?.total || 0);
      }, 0);

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders
        .filter(order => {
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

      // Count pending orders
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      // Fetch recent orders
      const recentOrdersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrders = recentOrdersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch total products
      const productsSnapshot = await getDocs(collection(db, "products"));
      const totalProducts = productsSnapshot.size;

      // Fetch total users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts,
        totalUsers,
        recentOrders,
        monthlyRevenue,
        pendingOrders
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primeColor"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: FaDollarSign,
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: FaBox,
      color: "bg-purple-500",
      textColor: "text-purple-600"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "bg-orange-500",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primeColor mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
            Sttrika Admin Dashboard
          </h1>
          <p className="text-lightText text-lg">Manage your women's fashion store with style</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-primeColor">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-lightText uppercase tracking-wide">{card.title}</p>
                    <p className="text-3xl font-bold text-primeColor mt-2 group-hover:scale-105 transition-transform duration-200">
                      {card.value}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-primeColor to-gray-800 p-4 rounded-full shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-lightText uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-2xl font-bold text-primeColor">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-full mr-4">
                <FiTrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-lightText uppercase tracking-wide">Pending Orders</p>
                <p className="text-2xl font-bold text-primeColor">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full mr-4">
                <FaDollarSign className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-lightText uppercase tracking-wide">Avg Order Value</p>
                <p className="text-2xl font-bold text-primeColor">
                  {stats.totalOrders > 0 
                    ? formatCurrency(stats.totalRevenue / stats.totalOrders)
                    : formatCurrency(0)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primeColor to-gray-800 px-6 py-4">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Times New Roman, serif' }}>
              Recent Orders
            </h3>
          </div>
          <div className="p-6">
            {stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primeColor uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primeColor uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primeColor uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primeColor uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primeColor uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primeColor">
                          #{order.orderId || order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-lightText">
                          {order.customerInfo?.name || order.userEmail || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-lightText">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            inline-flex px-3 py-1 rounded-full text-xs font-semibold
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : ''}
                            ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200' : ''}
                            ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-200' : ''}
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : ''}
                          `}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primeColor">
                          {formatCurrency(order.pricing?.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">📦</div>
                <p className="text-lightText text-lg">No orders found</p>
                <p className="text-sm text-gray-400 mt-2">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;