import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  doc, 
  getDoc 
} from "../../config/firebase";

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

  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateTax = (subtotal) => {
    // Calculate GST (18% in India)
    return Math.round(subtotal * 0.18);
  };

  const calculateDiscount = (subtotal) => {
    // Apply discount based on subtotal
    if (subtotal >= 1000) return Math.round(subtotal * 0.1); // 10% discount for orders above ₹1000
    if (subtotal >= 500) return Math.round(subtotal * 0.05); // 5% discount for orders above ₹500
    return 0;
  };

  const handleCheckout = useCallback(async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        const orderId = generateOrderId();
        const subtotal = totalAmt;
        const discount = calculateDiscount(subtotal);
        const discountedSubtotal = subtotal - discount;
        const tax = calculateTax(discountedSubtotal);
        const finalTotal = discountedSubtotal + tax + shippingCharge;

        // Prepare detailed items array
        const orderItems = products.map((product) => ({
          productId: product._id || product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: product.quantity,
          colors: product.colors || product.color,
          badge: product.badge,
          itemTotal: calculateItemTotal(product),
          // Additional product details
          category: product.category || 'General',
          brand: product.brand || 'Sttrika',
          size: product.size || 'One Size',
          sku: product.sku || `SKU-${product._id}`,
        }));

        // Create comprehensive order object
        const orderData = {
          // Order Identification
          orderId: orderId,
          orderNumber: orderId,
          
          // User Information
          userId: user.uid,
          userEmail: user.email,
          customerInfo: {
            name: userData.Name || user.displayName || 'Customer',
            email: user.email,
            phone: userData.phone || '',
            address: {
              street: userData.address || '',
              city: userData.city || '',
              country: userData.country || 'India',
              zipCode: userData.zip || '',
            }
          },

          // Order Items
          items: orderItems,
          itemCount: products.length,
          totalQuantity: products.reduce((sum, item) => sum + item.quantity, 0),

          // Price Breakdown
          pricing: {
            subtotal: subtotal,
            discount: discount,
            discountPercentage: discount > 0 ? Math.round((discount / subtotal) * 100) : 0,
            discountedSubtotal: discountedSubtotal,
            tax: tax,
            taxRate: 18, // GST rate in percentage
            shippingCharge: shippingCharge,
            total: finalTotal,
          },

          // Order Status & Tracking
          status: 'pending',
          paymentStatus: 'pending',
          orderStage: 'placed',
          trackingStages: {
            placed: {
              status: 'completed',
              timestamp: new Date(),
              message: 'Order has been placed successfully'
            },
            confirmed: {
              status: 'pending',
              timestamp: null,
              message: 'Order confirmation pending'
            },
            shipped: {
              status: 'pending',
              timestamp: null,
              message: 'Order will be shipped soon'
            },
            delivered: {
              status: 'pending',
              timestamp: null,
              message: 'Order will be delivered'
            }
          },

          // Timestamps
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now

          // Additional Metadata
          metadata: {
            source: 'web',
            browser: navigator.userAgent,
            timestamp: Date.now(),
            currency: 'INR',
            locale: 'en-IN',
          },

          // Order Notes
          notes: {
            customer: '',
            internal: `Order placed via web cart with ${products.length} items`,
          }
        };

        // Save order to Firestore
        const orderRef = await addDoc(collection(db, "orders"), orderData);
        
        // Update order with Firestore document ID
        await addDoc(collection(db, "orders", orderRef.id, "history"), {
          action: 'order_created',
          timestamp: new Date(),
          details: 'Order successfully created and saved to database',
          orderId: orderId,
        });

        console.log("Order created successfully:", orderId);
        
        // Clear cart after successful order
        dispatch(resetCart());
        
        // Navigate to payment with order details
        navigate("/paymentgateway", {
          state: {
            orderId: orderId,
            orderData: orderData,
            total: finalTotal
          }
        });

      } catch (error) {
        console.error("Error processing checkout: ", error);
        alert("Failed to place order. Please try again.");
      }
    } else {
      setShowLoginPrompt(true);
    }
  }, [user, products, totalAmt, shippingCharge, navigate, dispatch]);

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
                
                {/* Show discount if applicable */}
                {calculateDiscount(totalAmt) > 0 && (
                  <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium text-green-600">
                    Discount ({Math.round((calculateDiscount(totalAmt) / totalAmt) * 100)}% off)
                    <span className="font-semibold tracking-wide font-titleFont">
                      -₹{calculateDiscount(totalAmt)}
                    </span>
                  </p>
                )}
                
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  After Discount
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{totalAmt - calculateDiscount(totalAmt)}
                  </span>
                </p>
                
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Tax (GST 18%)
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{calculateTax(totalAmt - calculateDiscount(totalAmt))}
                  </span>
                </p>
                
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    ₹{shippingCharge}
                  </span>
                </p>
                
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium bg-gray-50">
                  Final Total
                  <span className="font-bold tracking-wide text-xl font-titleFont text-primeColor">
                    ₹{totalAmt - calculateDiscount(totalAmt) + calculateTax(totalAmt - calculateDiscount(totalAmt)) + shippingCharge}
                  </span>
                </p>
              </div>
              
              {/* Savings Display */}
              {calculateDiscount(totalAmt) > 0 && (
                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <p className="text-green-700 text-sm font-medium text-center">
                    🎉 You're saving ₹{calculateDiscount(totalAmt)} on this order!
                  </p>
                </div>
              )}
              
              {/* Items Summary */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-lightText text-center">
                  {products.length} item(s) • {products.reduce((sum, item) => sum + item.quantity, 0)} piece(s)
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300 font-titleFont font-semibold"
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
