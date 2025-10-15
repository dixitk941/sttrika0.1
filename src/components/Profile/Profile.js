import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
import Breadcrumbs from '../pageProps/Breadcrumbs';
import { 
    auth, 
    onAuthStateChanged, 
    updateProfile
} from '../../config/firebase';
import { firestoreUtils, storageUtils } from '../../utils/firebase-utils';

const Profile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [zip, setZip] = useState('');
    const [profilePhotoURL, setProfilePhotoURL] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format Firestore timestamp or date string
    const formatOrderDate = (dateValue) => {
        if (!dateValue) return 'Recently';
        
        try {
            let date;
            // Check if it's a Firestore timestamp object
            if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
                date = new Date(dateValue.seconds * 1000);
            } else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (dateValue instanceof Date) {
                date = dateValue;
            } else {
                return 'Recently';
            }

            // Format the date
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.warn('Error formatting date:', error);
            return 'Recently';
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchProfileAndOrders(user);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchProfileAndOrders = async (user) => {
        try {
            // Fetch user profile using utility function
            const profileResult = await firestoreUtils.getDoc('users', user.uid);
            
            if (profileResult.success) {
                const data = profileResult.data;
                setName(data.Name || '');
                setAge(data.age || '');
                setEmail(user.email);
                setAddress(data.address || '');
                setCity(data.city || '');
                setCountry(data.country || '');
                setPhone(data.phone || '');
                setZip(data.zip || '');
                setProfilePhotoURL(data.profilePhotoURL || '');
            } else {
                // Set default values if user document doesn't exist
                setEmail(user.email);
            }

            // Try to fetch orders using utility function
            console.log("Fetching orders for user:", user.uid);
            const ordersResult = await firestoreUtils.getUserOrders(user.uid);
            console.log("Orders result:", ordersResult);
            if (ordersResult.success) {
                console.log("Orders data:", ordersResult.data);
                // Debug: Log the actual order structure
                ordersResult.data.forEach((order, index) => {
                    console.log(`Order ${index}:`, {
                        id: order.id,
                        orderId: order.orderId,
                        total: order.total,
                        pricingTotal: order.pricing?.total,
                        createdAt: order.createdAt,
                        date: order.date,
                        itemsLength: order.items?.length,
                        status: order.status
                    });
                });
                setOrderHistory(ordersResult.data);
            } else {
                console.warn("Could not fetch orders:", ordersResult.error);
                setOrderHistory([]);
            }

            setLoading(false);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error fetching profile: ", err);
            setError("Failed to load profile. Please try refreshing the page.");
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                setError("You must be logged in to save your profile.");
                return;
            }

            const userData = {
                Name: name,
                age: age,
                address: address,
                city: city,
                country: country,
                phone: phone,
                zip: zip,
                profilePhotoURL: profilePhotoURL,
                email: user.email
            };

            // Use utility function to update user data
            const result = await firestoreUtils.updateDoc('users', user.uid, userData);
            
            if (result.success) {
                setIsEditing(false);
                setError(null);
            } else {
                // If update fails, try to create the document
                const createResult = await firestoreUtils.createDoc('users', user.uid, userData);
                if (createResult.success) {
                    setIsEditing(false);
                    setError(null);
                } else {
                    setError("Failed to save profile. Please try again.");
                }
            }
        } catch (err) {
            console.error("Unexpected error: ", err);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    const handleProfilePhotoChange = async (event) => {
        const file = event.target.files[0];
        if (file && auth.currentUser) {
            try {
                // Use storage utility to upload profile picture
                const uploadResult = await storageUtils.uploadProfilePicture(auth.currentUser.uid, file);
                
                if (uploadResult.success) {
                    setProfilePhotoURL(uploadResult.url);
                    // Update user profile with new photo URL
                    await updateProfile(auth.currentUser, { photoURL: uploadResult.url });
                } else {
                    console.error("Error uploading file:", uploadResult.error);
                    setError("Failed to upload profile picture. Please try again.");
                }
            } catch (error) {
                console.error("Error uploading file: ", error);
                setError("Failed to upload profile picture. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primeColor mx-auto mb-4"></div>
                        <p className="text-lightText font-bodyFont">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-container mx-auto px-4 py-8 pb-20 md:pb-8">
                {/* Breadcrumbs */}
                <Breadcrumbs title="My Profile" />
                
                {/* Page Header */}
                <div className="mb-8">
                    <p className="text-lightText">Manage your account information and view your order history</p>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 p-4 flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            <p className="text-red-700 font-bodyFont">{error}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Profile Information Card */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-white border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-titleFont font-semibold text-primeColor">Profile Information</h2>
                                <div className="flex gap-2">
                                    {isEditing && (
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-500 text-white px-4 py-2 text-sm font-titleFont hover:bg-gray-600 duration-300 flex items-center gap-2"
                                        >
                                            <FaTimes className="text-sm" />
                                            Cancel
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleEditToggle}
                                        className="bg-primeColor text-white px-4 py-2 text-sm font-titleFont hover:bg-black duration-300 flex items-center gap-2"
                                    >
                                        {isEditing ? (
                                            <>
                                                <FaCheck className="text-sm" />
                                                Save Changes
                                            </>
                                        ) : (
                                            'Edit Profile'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Age</label>
                                        <input 
                                            type="text" 
                                            value={age} 
                                            onChange={(e) => setAge(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Email</label>
                                        <input 
                                            type="text" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-lightText font-bodyFont bg-gray-50 cursor-not-allowed"
                                            disabled 
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Address</label>
                                        <input 
                                            type="text" 
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">City</label>
                                        <input 
                                            type="text" 
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Country</label>
                                        <input 
                                            type="text" 
                                            value={country} 
                                            onChange={(e) => setCountry(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Phone</label>
                                        <input 
                                            type="text" 
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">Zip Code</label>
                                        <input 
                                            type="text" 
                                            value={zip} 
                                            onChange={(e) => setZip(e.target.value)} 
                                            className="w-full border border-gray-300 p-3 text-primeColor font-bodyFont focus:border-primeColor focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Name</label>
                                        <p className="text-primeColor font-bodyFont">{name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Age</label>
                                        <p className="text-primeColor font-bodyFont">{age || 'Not provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Email</label>
                                        <p className="text-primeColor font-bodyFont">{email}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Address</label>
                                        <p className="text-primeColor font-bodyFont">{address || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">City</label>
                                        <p className="text-primeColor font-bodyFont">{city || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Country</label>
                                        <p className="text-primeColor font-bodyFont">{country || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Phone</label>
                                        <p className="text-primeColor font-bodyFont">{phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-titleFont font-medium text-lightText mb-1">Zip Code</label>
                                        <p className="text-primeColor font-bodyFont">{zip || 'Not provided'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order History Section */}
                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaShoppingBag className="text-primeColor text-lg" />
                                <h2 className="text-xl font-titleFont font-semibold text-primeColor">Order History</h2>
                            </div>
                            {orderHistory.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-lightText font-bodyFont">No orders found.</p>
                                    <p className="text-sm text-lightText mt-2">Your order history will appear here once you make a purchase.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orderHistory.map((order, index) => (
                                        <div
                                            key={order.id}
                                            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-7"
                                        >
                                            {/* Order Header */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-block bg-primeColor/10 text-primeColor font-bold px-3 py-1 rounded-lg text-xs tracking-wider">
                                                        Order #{order.orderId ? String(order.orderId).slice(-8) : order.id ? String(order.id).slice(-8) : `ORD-${index + 1}`}
                                                    </span>
                                                    <span className="inline-block bg-green-100 text-green-700 font-semibold px-2 py-1 rounded text-xs ml-2">
                                                        {order.status === 'completed' || order.status === 'delivered' ? 'Completed' : order.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                                    <span className="text-2xl font-bold text-primeColor">
                                                        ₹{order.pricing?.total || order.total || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="mb-5">
                                                <h4 className="font-titleFont font-semibold text-primeColor mb-3 text-base">Items Ordered:</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {order.items && order.items.length > 0 ? (
                                                        order.items.map((item, itemIndex) => (
                                                            <div
                                                                key={itemIndex}
                                                                className="flex flex-col items-center bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                                                            >
                                                                <div className="w-20 h-20 mb-3 flex-shrink-0">
                                                                    <img
                                                                        src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                                                                        alt={item.name || 'Product'}
                                                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="w-full text-center space-y-1">
                                                                    <h5 className="font-titleFont font-medium text-primeColor text-sm min-h-[2.5em] overflow-hidden" style={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical'
                                                                    }}>
                                                                        {String(item.name || 'Product Name')}
                                                                    </h5>
                                                                    <div className="space-y-1">
                                                                        <div className="text-xs text-lightText">
                                                                            Qty: {String(item.quantity || 1)}
                                                                        </div>
                                                                        {item.price && (
                                                                            <div className="text-sm font-semibold text-primeColor">
                                                                                ₹{typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0}
                                                                            </div>
                                                                        )}
                                                                        {item.colors && (
                                                                            <div className="text-xs text-lightText">
                                                                                Color: {String(item.colors)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-full text-sm text-lightText p-4 bg-gray-50 rounded text-center">
                                                            No item details available
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-lightText pt-4 border-t border-gray-100">
                                                <span>Order Date: {formatOrderDate(order.createdAt || order.date || order.timestamp)}</span>
                                                <div className="flex gap-4">
                                                    <span className="font-medium">
                                                        Total Items: {order.items?.length || order.itemCount || 0}
                                                    </span>
                                                    {order.pricing?.subtotal && (
                                                        <span className="font-medium">
                                                            Subtotal: ₹{order.pricing.subtotal}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Photo Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white border border-gray-200 p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <FaCamera className="text-primeColor text-lg" />
                                <h3 className="text-lg font-titleFont font-semibold text-primeColor">Profile Photo</h3>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={profilePhotoURL || "https://firebasestorage.googleapis.com/v0/b/sttrika-official.appspot.com/o/profilePhotos%2FUntitled.png?alt=media&token=9cb0aff3-4292-4083-b0e9-bcdd739006e4"}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-gray-200"
                                    />
                                    {isEditing && (
                                        <div className="absolute -bottom-2 -right-2 bg-primeColor text-white p-2 rounded-full">
                                            <FaCamera className="text-sm" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="w-full">
                                        <label className="block text-sm font-titleFont font-medium text-primeColor mb-2">
                                            Update Photo
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleProfilePhotoChange}
                                            className="w-full p-2 border border-gray-300 text-sm text-primeColor file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-primeColor file:text-white hover:file:bg-black file:cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="bg-white border border-gray-200 p-6 mt-6">
                            <h3 className="text-lg font-titleFont font-semibold text-primeColor mb-4">Account Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 border-l-4 border-primeColor">
                                    <span className="text-lightText font-bodyFont">Total Orders</span>
                                    <span className="font-titleFont font-bold text-primeColor text-lg">{orderHistory.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50">
                                    <span className="text-lightText font-bodyFont">Member Since</span>
                                    <span className="font-titleFont font-medium text-primeColor">2024</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 border-l-4 border-green-500">
                                    <span className="text-lightText font-bodyFont">Account Status</span>
                                    <span className="font-titleFont font-medium text-green-600">Active</span>
                                </div>
                                {orderHistory.length > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 border-l-4 border-blue-500">
                                        <span className="text-lightText font-bodyFont">Total Spent</span>
                                        <span className="font-titleFont font-medium text-blue-600">
                                            ₹{orderHistory.reduce((total, order) => {
                                                const orderTotal = order.pricing?.total || order.total || 0;
                                                const parsedTotal = typeof orderTotal === 'number' ? orderTotal : 
                                                                   typeof orderTotal === 'string' ? parseFloat(orderTotal) || 0 : 0;
                                                return total + parsedTotal;
                                            }, 0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
