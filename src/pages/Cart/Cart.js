import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
  }, []);

  useEffect(() => {
    const price = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else {
      setShippingCharge(20);
    }
  }, [totalAmt]);

  const uploadImage = async (image) => {
    if (!image) {
      throw new Error("No image provided");
    }
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleCheckout = useCallback(async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const productDetails = await Promise.all(
            products.map(async (product) => {
              if (product.image) {
                const imageUrl = await uploadImage(product.image);
                return {
                  ...product,
                  imageUrl,
                };
              }
              return product; // Return product as-is if no image
            })
          );

          await addDoc(collection(db, "orders"), {
            userId: user.uid,
            products: productDetails,
            totalAmount: totalAmt,
            shippingCharge: shippingCharge,
            total: totalAmt + shippingCharge,
            createdAt: new Date(),
          });

          // Navigate to the payment gateway
          navigate("/paymentgateway");
        } else {
          console.error("User data does not exist in Firestore");
        }
      } catch (error) {
        console.error("Error processing checkout: ", error);
      }
    } else {
      setShowLoginPrompt(true); // Show login prompt if user is not authenticated
    }
  }, [user, products, totalAmt, shippingCharge, navigate]);

  return (
    <div className="w-full max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {showLoginPrompt && (
        <div className="p-4 mb-4 bg-yellow-200 border border-yellow-400 text-yellow-700 rounded">
          <p>Please log in to proceed to checkout.</p>
          <Link to="/signin">
            <button className="bg-primeColor text-white px-4 py-2 mt-2 rounded">
              Login
            </button>
          </Link>
        </div>
      )}
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Coupon Number"
              />
              <p className="text-sm mdl:text-base font-semibold">Apply Coupon</p>
            </div>
            <p className="text-lg font-semibold">Update Cart</p>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{totalAmt}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{shippingCharge}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    ₹{totalAmt + shippingCharge}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <img src={emptyCart} alt="Empty Cart" className="w-72" />
          <h1 className="text-3xl font-semibold text-primeColor">Your Cart is Empty</h1>
          <Link to="/">
            <button className="bg-primeColor text-white py-2 px-4 rounded">Continue Shopping</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
