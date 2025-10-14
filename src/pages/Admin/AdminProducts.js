import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaImage,
  FaSave,
  FaTimes
} from "react-icons/fa";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "Sttrika",
    image: "",
    badge: "",
    colors: [],
    size: "One Size",
    stock: 100,
    featured: false
  });

  const categories = [
    "Sarees",
    "Suits & Salwar Kameez",
    "Lehengas & Ghagras",
    "Kurtis & Tunics", 
    "Dresses",
    "Tops & Blouses",
    "Ethnic Wear",
    "Western Wear",
    "Indo-Western",
    "Accessories",
    "Jewelry",
    "Bags & Purses",
    "Footwear",
    "General"
  ];

  const badges = ["New", "Sale", "Hot", "Best Seller", ""];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsQuery = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(productsQuery);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      setUploading(true);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        updatedAt: new Date(),
        _id: editingProduct?.id || `product_${Date.now()}`
      };

      if (editingProduct) {
        // Update existing product
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, productData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
        alert("Product updated successfully!");
      } else {
        // Add new product
        productData.createdAt = new Date();
        const docRef = await addDoc(collection(db, "products"), productData);
        setProducts([{ id: docRef.id, ...productData }, ...products]);
        alert("Product added successfully!");
      }

      resetForm();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "Sttrika",
      image: product.image || "",
      badge: product.badge || "",
      colors: product.colors || [],
      size: product.size || "One Size",
      stock: product.stock || 100,
      featured: product.featured || false
    });
    setShowProductModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(p => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      price: "",
      description: "",
      category: "",
      brand: "Sttrika",
      image: "",
      badge: "",
      colors: [],
      size: "One Size",
      stock: 100,
      featured: false
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primeColor"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-primeColor mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
              Women's Fashion Collection
            </h2>
            <p className="text-lightText">Manage your beautiful collection of women's clothing and accessories</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-primeColor to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FaPlus className="mr-2" size={18} />
            <span className="font-medium">Add New Product</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primeColor" size={18} />
              <input
                type="text"
                placeholder="Search sarees, suits, dresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primeColor focus:border-primeColor transition-all duration-200"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-lightText">
                Showing <span className="font-semibold text-primeColor">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primeColor">
              <div className="relative overflow-hidden">
                <img
                  src={product.image || "/api/placeholder/300/200"}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-primeColor mb-2 truncate text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                  {product.name}
                </h3>
                <p className="text-sm text-lightText mb-3 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                  {product.category}
                </p>
                <p className="text-xl font-bold text-primeColor mb-4">
                  {formatCurrency(product.price)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-lightText mr-2">Stock:</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock || 0}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-primeColor hover:bg-primeColor hover:text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-8xl text-gray-300 mb-6">👗</div>
            <h3 className="text-2xl font-bold text-primeColor mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
              No Products Found
            </h3>
            <p className="text-lightText mb-6">Start building your women's fashion collection</p>
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-primeColor to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Add Your First Product
            </button>
          </div>
        )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand and Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <select
                    value={productForm.badge}
                    onChange={(e) => setProductForm({...productForm, badge: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                  >
                    {badges.map(badge => (
                      <option key={badge} value={badge}>{badge || "No Badge"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors
                </label>
                <div className="space-y-3">
                  {/* Color Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { name: 'Black', value: '#000000' },
                      { name: 'White', value: '#FFFFFF' },
                      { name: 'Red', value: '#EF4444' },
                      { name: 'Blue', value: '#3B82F6' },
                      { name: 'Green', value: '#10B981' },
                      { name: 'Pink', value: '#EC4899' },
                      { name: 'Purple', value: '#8B5CF6' },
                      { name: 'Yellow', value: '#F59E0B' },
                      { name: 'Orange', value: '#F97316' },
                      { name: 'Brown', value: '#92400E' },
                      { name: 'Gray', value: '#6B7280' },
                      { name: 'Navy', value: '#1E3A8A' }
                    ].map((color) => (
                      <div key={color.name} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const currentColors = productForm.colors || [];
                            const isSelected = currentColors.includes(color.name);
                            if (isSelected) {
                              setProductForm({
                                ...productForm,
                                colors: currentColors.filter(c => c !== color.name)
                              });
                            } else {
                              setProductForm({
                                ...productForm,
                                colors: [...currentColors, color.name]
                              });
                            }
                          }}
                          className={`
                            w-8 h-8 rounded-full border-2 transition-all duration-200 relative
                            ${productForm.colors?.includes(color.name) 
                              ? 'border-primeColor ring-2 ring-primeColor ring-opacity-30 scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                            }
                          `}
                          style={{ 
                            backgroundColor: color.value,
                            border: color.name === 'White' ? '2px solid #D1D5DB' : `2px solid ${color.value}`
                          }}
                        >
                          {productForm.colors?.includes(color.name) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className={`w-4 h-4 ${color.name === 'White' || color.name === 'Yellow' ? 'text-gray-800' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                        <span className="text-xs text-gray-600 mt-1">{color.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Selected Colors Display */}
                  {productForm.colors && productForm.colors.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Colors:</p>
                      <div className="flex flex-wrap gap-2">
                        {productForm.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primeColor text-white"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm({
                                  ...productForm,
                                  colors: productForm.colors.filter(c => c !== color)
                                });
                              }}
                              className="ml-2 text-white hover:text-gray-200 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Color Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add custom color (e.g., Maroon, Teal)"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const customColor = e.target.value.trim();
                          if (customColor && !productForm.colors?.includes(customColor)) {
                            setProductForm({
                              ...productForm,
                              colors: [...(productForm.colors || []), customColor]
                            });
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500">Press Enter to add</span>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await handleImageUpload(file);
                        if (url) {
                          setProductForm({...productForm, image: url});
                        }
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <FaImage className="mr-2" size={16} />
                    {uploading ? "Uploading..." : "Upload"}
                  </label>
                </div>
                {productForm.image && (
                  <img
                    src={productForm.image}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                  className="h-4 w-4 text-primeColor focus:ring-primeColor border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Feature this product
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center px-4 py-2 bg-primeColor text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <FaSave className="mr-2" size={16} />
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminProducts;