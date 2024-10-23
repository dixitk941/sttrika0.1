import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Header from '../home/Header/Header';
import Footer from '../home/Footer/Footer';
import HeaderBottom from '../home/Header/HeaderBottom';
import FooterBottom from '../home/Footer/FooterBottom';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAjDM52pKftwpRjAuWmyybk0fJDYblWYk",
    authDomain: "sttrika-official.firebaseapp.com",
    projectId: "sttrika-official",
    storageBucket: "sttrika-official.appspot.com",
    messagingSenderId: "276195318783",
    appId: "1:276195318783:web:3dd5735fd9145b752fa5ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
    
    // Order history state
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchProfileAndOrders(user); // Fetch user profile data here
            } else {
                setLoading(false); // Stop loading if user is not logged in
            }
        });
    
        return () => unsubscribe();
    }, []);

    const fetchProfileAndOrders = async (user) => {
        try {
            // Fetch user profile
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.Name || '');
                setAge(data.age || '');
                setEmail(user.email);
                setAddress(data.address || '');
                setCity(data.city || '');
                setCountry(data.country || '');
                setPhone(data.phone || '');
                setZip(data.zip || '');
                setProfilePhotoURL(data.profilePhotoURL || '');
            }

            // Fetch order history
            const ordersRef = collection(db, 'orders');
            const orderHistoryQuery = query(ordersRef, where('userId', '==', user.uid));
            const ordersSnap = await getDocs(orderHistoryQuery);
            const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrderHistory(orders);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile and orders: ", err);
            setError("Failed to fetch profile and orders.");
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-700 text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <HeaderBottom />
            <div className="flex-grow container mx-auto p-4 md:p-8">
                {/* Profile Section */}
                <div className="max-w-full bg-white shadow-lg rounded-lg border border-gray-300 p-6">
                    <h1 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800">Your Profile</h1>

                    {/* Profile Information and Edit Section */}
                    <div className="mb-6 flex flex-col items-center">
                        {/* Display Profile Photo */}
                        {profilePhotoURL ? (
                            <img 
                                src={profilePhotoURL} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full mb-4 object-cover shadow-md"
                            />
                        ) : (
                            <img 
                                src="https://firebasestorage.googleapis.com/v0/b/sttrika-official.appspot.com/o/profilePhotos%2FUntitled.png?alt=media&token=9cb0aff3-4292-4083-b0e9-bcdd739006e4"
                                alt="Default Avatar" 
                                className="w-32 h-32 rounded-full mb-4 object-cover shadow-md"
                            />
                        )}
                    </div>

                    {/* Editable Profile Fields */}
                    {isEditing ? (
                        <div className="mt-5 grid grid-cols-1 gap-4">
                            {/* Add input fields for editing profile here */}
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="Age" 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                                disabled
                            />
                            <input 
                                type="text" 
                                placeholder="Address" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="City" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="Country" 
                                value={country} 
                                onChange={(e) => setCountry(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="Phone" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input 
                                type="text" 
                                placeholder="Zip Code" 
                                value={zip} 
                                onChange={(e) => setZip(e.target.value)} 
                                className="border border-gray-300 p-2 rounded"
                            />
                        </div>
                    ) : (
                        <div className="mt-5">
                            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                            <p className="text-gray-700"><strong>Name:</strong> {name}</p>
                            <p className="text-gray-700"><strong>Age:</strong> {age}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {email}</p>
                            <p className="text-gray-700"><strong>Address:</strong> {address}</p>
                            <p className="text-gray-700"><strong>City:</strong> {city}</p>
                            <p className="text-gray-700"><strong>Country:</strong> {country}</p>
                            <p className="text-gray-700"><strong>Phone:</strong> {phone}</p>
                            <p className="text-gray-700"><strong>Zip Code:</strong> {zip}</p>
                        </div>
                    )}

                    <button 
                        onClick={handleEditToggle} 
                        className="mt-6 w-full px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                {/* Order History Section */}
                <div className="mt-10 max-w-full bg-white shadow-lg rounded-lg border border-gray-300 p-6">
                    <h1 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800">Order History</h1>
                    {orderHistory.length === 0 ? (
                        <p className="text-gray-700">No orders found.</p>
                    ) : (
                        <ul>
                            {orderHistory.map(order => (
                                <li key={order.id} className="mb-4 p-4 border-b border-gray-300">
                                    <h2 className="font-semibold">Order ID: {order.id}</h2>
                                    {/* Display order details here, such as items, prices, dates, etc. */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
            <FooterBottom />
        </div>
    );
};

export default Profile;
