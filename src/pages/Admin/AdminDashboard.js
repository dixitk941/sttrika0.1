import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../../config/firebase";
import AdminStats from "./AdminStats";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import { 
  FaChartLine, 
  FaShoppingCart, 
  FaBox, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'strrikaadmin#@gmail.com') {
        setUser(currentUser);
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primeColor mx-auto"></div>
          <p className="mt-4 text-lightText">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'stats', label: 'Dashboard', icon: FaChartLine },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart },
    { id: 'products', label: 'Products', icon: FaBox },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primeColor to-gray-800 text-white transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl
      `}>
        <div className="flex flex-col items-center p-6 border-b border-gray-600">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
              Sttrika Admin
            </h1>
            <p className="text-sm text-gray-300">Women's Fashion Hub</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-6 py-4 mb-2 text-left rounded-xl transition-all duration-300 group
                  ${activeTab === item.id 
                    ? 'bg-white text-primeColor shadow-lg transform scale-105' 
                    : 'hover:bg-white hover:bg-opacity-10 hover:translate-x-2'
                  }
                `}
              >
                <Icon className={`mr-4 transition-all duration-300 ${
                  activeTab === item.id ? 'text-primeColor' : 'text-white group-hover:scale-110'
                }`} size={20} />
                <span className={`font-medium ${activeTab === item.id ? 'text-primeColor' : 'text-white'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-600">
          <div className="mb-6 bg-white bg-opacity-10 rounded-xl p-4">
            <p className="text-xs text-gray-300 uppercase tracking-wide">Logged in as:</p>
            <p className="text-sm font-semibold truncate text-white mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" size={16} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-primeColor hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <FaBars size={24} />
            </button>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-primeColor capitalize" style={{ fontFamily: 'Times New Roman, serif' }}>
                {activeTab === 'stats' ? 'Dashboard' : activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-4 bg-gradient-to-r from-primeColor to-gray-800 px-4 py-2 rounded-full">
              <span className="text-sm text-white font-medium">
                Welcome, Admin
              </span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primeColor font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;