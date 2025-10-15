import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaShoppingCart, FaGift, FaTruck, FaCheck, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #JFQ2WkH1 has been shipped and is on the way!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        icon: FaTruck,
        color: 'bg-blue-500',
        actionUrl: '/profile'
      },
      {
        id: 2,
        type: 'promotion',
        title: 'Special Offer',
        message: 'Get 20% off on all ethnic wear. Limited time offer!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
        icon: FaGift,
        color: 'bg-pink-500',
        actionUrl: '/shop'
      },
      {
        id: 3,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #ABC123 has been successfully delivered.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        icon: FaCheck,
        color: 'bg-green-500',
        actionUrl: '/profile'
      },
      {
        id: 4,
        type: 'cart',
        title: 'Items in Cart',
        message: 'You have items waiting in your cart. Complete your purchase now!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        icon: FaShoppingCart,
        color: 'bg-orange-500',
        actionUrl: '/cart'
      },
      {
        id: 5,
        type: 'promotion',
        title: 'New Collection',
        message: 'Check out our latest collection of designer sarees.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: false,
        icon: FaBell,
        color: 'bg-purple-500',
        actionUrl: '/shop'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => 
      prev.filter(notification => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Notifications" />
      
      <div className="pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primeColor to-black p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="lg:hidden">
                  <FaArrowLeft className="w-5 h-5 hover:text-gray-200 transition-colors" />
                </Link>
                <div className="flex items-center gap-3">
                  <FaBell className="w-6 h-6" />
                  <div>
                    <h1 className="text-2xl font-titleFont font-bold">Notifications</h1>
                    <p className="text-sm text-gray-200 mt-1">
                      {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                  </div>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'read', label: 'Read', count: notifications.length - unreadCount }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    filter === key
                      ? 'text-primeColor border-b-2 border-primeColor bg-white'
                      : 'text-lightText hover:text-primeColor hover:bg-white/50'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearSelection}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[600px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-titleFont font-medium text-lightText mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-lightText">
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'read' ? 'No read notifications' : 
                   'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = notification.icon;
                  const isSelected = selectedNotifications.includes(notification.id);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`relative flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      } ${isSelected ? 'bg-blue-100' : ''}`}
                    >
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectNotification(notification.id)}
                        className="mt-1 rounded border-gray-300 text-primeColor focus:ring-primeColor"
                      />

                      {/* Notification Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 ${notification.color} rounded-full flex items-center justify-center text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className={`font-titleFont font-medium ${
                              !notification.read ? 'text-primeColor' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-lightText mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xs text-lightText">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionUrl && (
                                <Link 
                                  to={notification.actionUrl}
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-primeColor hover:text-black font-medium"
                                >
                                  View →
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                title="Mark as read"
                              >
                                <FaCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={selectedNotifications.length === filteredNotifications.length ? clearSelection : selectAll}
                  className="text-sm text-primeColor hover:text-black font-medium"
                >
                  {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                </button>
                
                <div className="text-sm text-lightText">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;