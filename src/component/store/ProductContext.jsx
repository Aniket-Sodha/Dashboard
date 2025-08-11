// DropdownDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebase"; // adjust path to your firebase config

export const DropdownDataContext = createContext();

export const useDropdownData = () => useContext(DropdownDataContext);

export const DropdownDataProvider = ({ children }) => {
  const db = getFirestore(app);

  const [itemGroups, setItemGroups] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [itemGroupSnap, brandSnap] = await Promise.all([
          getDocs(collection(db, "itemGroups")),
          getDocs(collection(db, "brands")),
        ]);

        const fetchedItemGroups = itemGroupSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const fetchedBrands = brandSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItemGroups(fetchedItemGroups);
        setBrands(fetchedBrands);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
        setError("Failed to load dropdown data");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  });

  return (
    <DropdownDataContext.Provider value={{ itemGroups, brands, loading, error }}>
      {children}
    </DropdownDataContext.Provider>
  );
};
