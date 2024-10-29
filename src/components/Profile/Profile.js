import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from '../home/Header/Header';
import Footer from '../home/Footer/Footer';
import HeaderBottom from '../home/Header/HeaderBottom';
import FooterBottom from '../home/Footer/FooterBottom';

// Firebase configuration
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
const storage = getStorage(app);

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

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
            uploadBytes(storageRef, file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(storageRef);
                setProfilePhotoURL(downloadURL);
                await updateProfile(auth.currentUser, { photoURL: downloadURL });
            }).catch(error => console.error("Error uploading file: ", error));
        }
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
        <div className="bg-gradient-to-br from-purple-700 via-pink-500 to-blue-500 min-h-screen flex flex-col text-gray-50">
            <Header />
            <HeaderBottom />
            <div className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-full bg-white shadow-lg rounded-lg border border-gray-200 p-8 backdrop-blur-md bg-opacity-30">
                    <h1 className="text-3xl font-semibold mb-8 text-gray-50">Your Profile</h1>

                    {/* Profile Information */}
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={profilePhotoURL || "https://firebasestorage.googleapis.com/v0/b/sttrika-official.appspot.com/o/profilePhotos%2FUntitled.png?alt=media&token=9cb0aff3-4292-4083-b0e9-bcdd739006e4"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full mb-4 object-cover shadow-md border border-gray-200"
                        />
                        {isEditing && (
                            <input
                                type="file"
                                onChange={handleProfilePhotoChange}
                                className="mt-4 p-2 rounded-lg bg-purple-500 text-gray-50 hover:bg-purple-600 cursor-pointer transition"
                            />
                        )}
                    </div>

                    {isEditing ? (
                        <div className="grid grid-cols-1 gap-4">
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded-md text-gray-900" disabled />
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                            <input type="text" placeholder="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} className="border p-3 rounded-md text-gray-900" />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-medium mb-4">Profile Information</h2>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Age:</strong> {age}</p>
                            <p><strong>Email:</strong> {email}</p>
                            <p><strong>Address:</strong> {address}</p>
                            <p><strong>City:</strong> {city}</p>
                            <p><strong>Country:</strong> {country}</p>
                            <p><strong>Phone:</strong> {phone}</p>
                            <p><strong>Zip Code:</strong> {zip}</p>
                        </div>
                    )}

                    {/* <button onClick={handleEditToggle} className="mt-6 w-full bg-gradient-to-r from-purple-700 to-blue-500 text-white p-3 rounded-lg hover:bg-gradient-to-l transition duration-300 shadow-md">
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button> */}
                </div>

                {/* Order History Section */}
                <div className="mt-10 max-w-full bg-white shadow-lg rounded-lg border border-gray-200 p-8 backdrop-blur-md bg-opacity-30">
                    <h1 className="text-3xl font-semibold mb-8 text-gray-50">Order History</h1>
                    {orderHistory.length === 0 ? (
                        <p className="text-gray-300">No orders found.</p>
                    ) : (
                        <ul>
                        {orderHistory && orderHistory.length > 0 ? (
                            orderHistory.map(order => (
                                <li key={order.id} className="border-b border-gray-200 pb-4 mb-4">
                                    <p><strong>Order ID:</strong> {order.id}</p>
                                    <p><strong>Items:</strong> {order.items?.map(item => item.name).join(', ') || 'No items available'}</p>
                                    <p><strong>Total:</strong> ₹{order.total}</p>
                                </li>
                            ))
                        ) : (
                            <p>No order history available.</p>
                        )}
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
