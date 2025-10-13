import React from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Payment = () => {
  const location = useLocation();
  const { orderId, orderData, total } = location.state || {};

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Payment Gateway" />
      <div className="pb-10">
        {orderData ? (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-titleFont font-bold text-primeColor mb-2">
                Order Placed Successfully! 🎉
              </h2>
              <p className="text-lightText">Your order has been received and is being processed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-titleFont font-semibold text-primeColor mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-lightText">Order ID:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lightText">Items:</span>
                    <span className="font-medium">{orderData.itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lightText">Total Quantity:</span>
                    <span className="font-medium">{orderData.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primeColor border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-titleFont font-semibold text-primeColor mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-lightText">Status:</span>
                    <span className="font-medium text-green-600">Order Placed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lightText">Estimated Delivery:</span>
                    <span className="font-medium">
                      {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lightText">Delivery Address:</span>
                    <span className="font-medium text-right text-sm">
                      {orderData.customerInfo.address.street || 'Address not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="font-titleFont font-semibold text-primeColor mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{orderData.pricing.subtotal}</span>
                </div>
                {orderData.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({orderData.pricing.discountPercentage}%):</span>
                    <span>-₹{orderData.pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (GST {orderData.pricing.taxRate}%):</span>
                  <span>₹{orderData.pricing.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{orderData.pricing.shippingCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-primeColor">
                  <span>Final Total:</span>
                  <span>₹{orderData.pricing.total}</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-lightText mb-4">
                Payment gateway integration is currently in development. 
                Your order has been recorded successfully.
              </p>
              <div className="space-x-4">
                <Link to="/profile">
                  <button className="bg-primeColor text-white px-6 py-2 hover:bg-black duration-300">
                    View Orders
                  </button>
                </Link>
                <Link to="/">
                  <button className="bg-gray-500 text-white px-6 py-2 hover:bg-gray-600 duration-300">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lightText mb-4">No order information found.</p>
            <Link to="/">
              <button className="w-52 h-10 bg-primeColor text-white text-lg hover:bg-black duration-300">
                Explore More
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
