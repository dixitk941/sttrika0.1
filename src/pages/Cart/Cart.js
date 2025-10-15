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
  getDoc,
  setDoc 
} from "../../config/firebase";

// Function to remove undefined values recursively and handle Date objects
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Handle Date objects - convert to Firestore Timestamp format
  if (obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    Object.keys(obj).forEach(key => {
      const value = sanitizeObject(obj[key]);
      if (value !== null && value !== undefined) {
        sanitized[key] = value;
      }
    });
    return sanitized;
  }
  
  return obj;
};

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
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
    return price * quantity;
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
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if user is properly authenticated
    if (!user.uid || !user.email) {
      console.error("User authentication incomplete:", user);
      alert("Authentication error. Please log out and log back in.");
      return;
    }

    // Validate cart items
    if (!products || products.length === 0) {
      alert("Your cart is empty. Please add some items before checkout.");
      return;
    }

    // Log products for debugging
    console.log("Products in cart:", products);

    // Basic validation - most issues should be handled by Redux now
    const hasInvalidProducts = products.some(product => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const isInvalid = !product._id || !product.name || isNaN(price) || price <= 0 || product.quantity <= 0;
      
      if (isInvalid) {
        console.log("Product validation details:", {
          id: product._id || 'MISSING',
          name: product.name || 'MISSING',
          price: price,
          quantity: product.quantity,
          originalPrice: product.price
        });
      }
      
      return isInvalid;
    });

    if (hasInvalidProducts) {
      console.warn("⚠️ Some products have validation issues, automatically fixing...");
    } else {
      console.log("✅ All products in cart are valid");
    }

    try {
      console.log("Starting checkout process for user:", user.uid);
      
      // Try to fetch user document, create if it doesn't exist
      let userData = {};
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
        } else {
          // Create basic user document if it doesn't exist
          userData = {
            Name: user.displayName || "Customer",
            email: user.email,
            createdAt: new Date(),
          };
          await setDoc(doc(db, "users", user.uid), userData);
          console.log("Created user document");
        }
      } catch (userError) {
        console.log("User document issue:", userError);
        // Continue with checkout even if user doc fails
        userData = {
          Name: user.displayName || "Customer",
          email: user.email,
        };
      }
        
      const orderId = generateOrderId();
      const subtotal = totalAmt || 0;
      const discount = calculateDiscount(subtotal) || 0;
      const discountedSubtotal = subtotal - discount;
      const tax = calculateTax(discountedSubtotal) || 0;
      const finalTotal = discountedSubtotal + tax + (shippingCharge || 0);

        // Always normalize product data for consistency
        const productsToUse = products.map(product => {
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          return {
            ...product,
            _id: product._id || product.id || `temp-${Date.now()}-${Math.random()}`,
            name: product.name || product.productName || 'Unknown Product',
            price: typeof price === 'number' && !isNaN(price) ? price : 0,
            quantity: typeof product.quantity === 'number' ? product.quantity : 1
          };
        });

        console.log("Final products used for checkout:", productsToUse);

        // Prepare detailed items array
        const orderItems = productsToUse.map((product) => {
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          const finalPrice = typeof price === 'number' && !isNaN(price) ? price : 0;
          
          return {
            productId: product._id || product.id || `temp-${Date.now()}`,
            name: product.name || product.productName || 'Unknown Product',
            image: product.image || product.img || '',
            price: finalPrice,
            quantity: product.quantity || 1,
            colors: product.colors || product.color || 'Not specified',
            badge: product.badge || false,
            itemTotal: calculateItemTotal({ ...product, price: finalPrice }),
            // Additional product details with proper fallbacks
            category: product.category || 'General',
            brand: product.brand || 'Sttrika',
            size: product.size || 'One Size',
            sku: product.sku || `SKU-${product._id || Date.now()}`,
          };
        });

        // Create comprehensive order object
        const orderData = {
          // Order Identification
          orderId: orderId,
          orderNumber: orderId,
          
          // User Information
          userId: user.uid || 'unknown',
          userEmail: user.email || 'unknown@example.com',
          customerInfo: {
            name: userData.Name || user.displayName || 'Customer',
            email: user.email || 'unknown@example.com',
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
          itemCount: productsToUse.length,
          totalQuantity: productsToUse.reduce((sum, item) => sum + (item.quantity || 1), 0),

          // Price Breakdown
          pricing: {
            subtotal: subtotal || 0,
            discount: discount || 0,
            discountPercentage: discount > 0 && subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0,
            discountedSubtotal: discountedSubtotal || 0,
            tax: tax || 0,
            taxRate: 18, // GST rate in percentage
            shippingCharge: shippingCharge || 0,
            total: finalTotal || 0,
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
              timestamp: '',
              message: 'Order confirmation pending'
            },
            shipped: {
              status: 'pending',
              timestamp: '',
              message: 'Order will be shipped soon'
            },
            delivered: {
              status: 'pending',
              timestamp: '',
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
            browser: navigator?.userAgent || 'Unknown browser',
            timestamp: Date.now(),
            currency: 'INR',
            locale: 'en-IN',
          },

          // Order Notes
          notes: {
            customer: '',
            internal: `Order placed via web cart with ${productsToUse.length} items`,
          }
        };

        // Sanitize order data to remove undefined values
        const sanitizedOrderData = sanitizeObject(orderData);

        // Debug: Log order data before saving
        console.log("Sanitized order data to be saved:", JSON.stringify(sanitizedOrderData, null, 2));

        // Save order to Firestore
        const orderRef = await addDoc(collection(db, "orders"), sanitizedOrderData);
        console.log("Order saved with ID:", orderRef.id);
        
        // Update order with Firestore document ID (optional, continue even if this fails)
        try {
          await addDoc(collection(db, "orders", orderRef.id, "history"), {
            action: 'order_created',
            timestamp: new Date(),
            details: 'Order successfully created and saved to database',
            orderId: orderId,
          });
        } catch (historyError) {
          console.warn("Failed to save order history:", historyError);
          // Continue with checkout even if history fails
        }

        console.log("Order created successfully:", orderId);
        
        // Clear cart after successful order
        dispatch(resetCart());
        
        // Navigate to payment with order details
        navigate("/paymentgateway", {
          state: {
            orderId: orderId,
            orderData: sanitizedOrderData,
            total: finalTotal
          }
        });

    } catch (error) {
      console.error("Error processing checkout: ", error);
      alert("Failed to place order. Please try again.");
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
