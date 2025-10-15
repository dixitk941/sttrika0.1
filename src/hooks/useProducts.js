import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../config/firebase";

// Hook to fetch all products from Firestore
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            _id: doc.id, // Use Firestore doc ID consistently as _id
            ...docData,
            // Convert Firestore data to match existing format
            productName: docData.name,
            img: docData.image, // Map image field to img for compatibility
            color: docData.colors?.join(", ") || "Available in multiple colors",
            des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            badge: docData.badge === "New" || docData.badge === "Sale" || docData.badge === "Hot" || docData.badge === "Best Seller"
          };
        });
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, refetch: () => window.location.reload() };
};

// Hook to fetch products by category
export const useProductsByCategory = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = category === "all" 
          ? query(productsRef, orderBy("createdAt", "desc"))
          : query(productsRef, where("category", "==", category), orderBy("createdAt", "desc"));
        
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            _id: doc.id, // Use Firestore doc ID consistently as _id
            ...docData,
            productName: docData.name,
            img: docData.image, // Map image field to img for compatibility
            color: docData.colors?.join(", ") || "Available in multiple colors",
            des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            badge: docData.badge === "New" || docData.badge === "Sale" || docData.badge === "Hot" || docData.badge === "Best Seller"
          };
        });
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products by category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return { products, loading, error };
};

// Hook to fetch featured products
export const useFeaturedProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = query(
          productsRef, 
          where("featured", "==", true),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        let productsData = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            _id: doc.id, // Use Firestore doc ID consistently as _id
            ...docData,
            productName: docData.name,
            img: docData.image, // Map image field to img for compatibility
            color: docData.colors?.join(", ") || "Available in multiple colors",
            des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            badge: docData.badge === "New" || docData.badge === "Sale" || docData.badge === "Hot" || docData.badge === "Best Seller"
          };
        });

        // If no featured products, get latest products
        if (productsData.length === 0) {
          const allProductsQuery = query(productsRef, orderBy("createdAt", "desc"));
          const allProductsSnapshot = await getDocs(allProductsQuery);
          productsData = allProductsSnapshot.docs.slice(0, limit).map(doc => {
            const docData = doc.data();
            return {
              id: doc.id,
              _id: doc.id, // Use Firestore doc ID consistently as _id
              ...docData,
              productName: docData.name,
              img: docData.image, // Map image field to img for compatibility
              color: docData.colors?.join(", ") || "Available in multiple colors",
              des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              badge: docData.badge === "New" || docData.badge === "Sale" || docData.badge === "Hot" || docData.badge === "Best Seller"
            };
          });
        }

        setProducts(productsData.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

// Hook to fetch products with specific badges
export const useProductsByBadge = (badge, limit = 4) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByBadge = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = query(
          productsRef, 
          where("badge", "==", badge),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        let productsData = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            _id: doc.id, // Use Firestore doc ID consistently as _id
            ...docData,
            productName: docData.name,
            img: docData.image, // Map image field to img for compatibility
            color: docData.colors?.join(", ") || "Available in multiple colors",
            des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            badge: true
          };
        });

        // If no products with specific badge, get latest products
        if (productsData.length === 0) {
          const allProductsQuery = query(productsRef, orderBy("createdAt", "desc"));
          const allProductsSnapshot = await getDocs(allProductsQuery);
          productsData = allProductsSnapshot.docs.slice(0, limit).map(doc => {
            const docData = doc.data();
            return {
              id: doc.id,
              _id: doc.id, // Use Firestore doc ID consistently as _id
              ...docData,
              productName: docData.name,
              img: docData.image, // Map image field to img for compatibility
              color: docData.colors?.join(", ") || "Available in multiple colors",
              des: docData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              badge: true
            };
          });
        }

        // Ensure no duplicates based on _id and name
        const uniqueProductsData = productsData.filter((product, index, self) => {
          return index === self.findIndex(p => 
            p._id === product._id || 
            (p.productName === product.productName && p.price === product.price)
          );
        });

        console.log(`useProductsByBadge(${badge}): Found ${productsData.length} products, ${uniqueProductsData.length} unique`);
        setProducts(uniqueProductsData.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error("Error fetching products by badge:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByBadge();
  }, [badge, limit]);

  return { products, loading, error };
};

// Hook to fetch available categories (only categories that have products)
export const useAvailableCategories = (refreshTrigger) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableCategories = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      
      // Extract unique categories and count products
      const categoryMap = new Map();
      let totalProducts = 0;
      
      querySnapshot.docs.forEach(doc => {
        const category = doc.data().category;
        if (category && category.trim() !== "") {
          const currentCount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCount + 1);
          totalProducts++;
        }
      });

      // Convert to array and sort alphabetically
      const availableCategories = Array.from(categoryMap.keys()).sort();
      
      // Create category objects with proper format and product count
      const categoryObjects = [
        {
          _id: 1,
          title: "All Products",
          value: "all",
          count: totalProducts,
        },
        ...availableCategories.map((category, index) => ({
          _id: index + 2,
          title: category,
          value: category,
          count: categoryMap.get(category),
        }))
      ];
      
      setCategories(categoryObjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching available categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCategories();
  }, [refreshTrigger]);

  return { categories, loading, error, refetch: fetchAvailableCategories };
};