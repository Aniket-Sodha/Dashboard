import { use, useEffect, useState } from "react";
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore";
import { app } from "./firebase"; // your Firebase config
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);
const user = auth.currentUser;




let ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

// to generate the edit link
const handleEdit = (id) => {
  navigate(`/edit/${id}`);
};


const fetchData = async () => {
  onAuthStateChanged(auth, async (user) => {
    
    if (user) {
     
     
     const productsRef = collection(db, "products");
        const q = query(productsRef, where("uid", "==", user.uid)); // If you want to filter by uid, import and use 'where' from firestore

      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setProducts(items);
      setLoading(false);
    } else {
      setProducts([]);
      setLoading(false);
    }
  });
};

const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted successfully");
    setTimeout(() => {
      fetchData();
    }, 1000);
  } catch (error) {
    toast.error("Failed to delete product");
  }
};

  useEffect(() => {
     
    fetchData();
  }, []);

  // console.log("Products:", products);
  

  return (
    <div className="p-8">
      <div className="min-w-[800px]">
        <div className="flex justify-center items-center mb-5">
        <h2 className="text-4xl font-semibold text-center mb-10">
          Product List
        </h2></div>

        <div className="grid grid-cols-9  bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-t">
          <div>No.</div>
          <div>Item Group</div>
          <div>Item Name</div>
          <div>Brand</div>
          <div>Date</div>
          <div>Retail</div>
          <div>M.R.P.</div>
          <div>EDIT</div>
          <div>DELETE</div>
        </div>

        {loading ? (
          <TableLoading />
        ) : (
          <>
            {Array.isArray(products) && products.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-9 px-4  py-3 border-b text-sm bg-white hover:bg-gray-50 items-center justify-center"
              >
                <div>{index + 1}</div>
                <div className="text-sm font-medium break-words">{product.itemGroup}</div>


                <div className="break-words">{product.itemName}</div>
                <div className=" break-words">{product.brand}</div>
                <div className=" break-words">{product.date}</div>
                <div className=" break-words">{product.retail}</div>
                <div className=" break-words">{product.mrp}</div>
                <div className="px-2 text-xl " onClick={() => handleEdit(product.id)}>
                  <FaEdit className="cursor-pointer"/>
                </div>
                <div className=" px-3 text-2xl">
                  <MdDeleteForever onClick={() => handleDelete(product.id)} className="cursor-pointer" />
                 
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowProducts;

function TableLoading() {
  return (
    <div>
      {Array(5)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-8 px-2 gap-2 py-3 border-b text-sm bg-white items-center animate-pulse"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-300 rounded w-full  mx-2"
              ></div>
            ))}
          </div>
        ))}
    </div>
  );
}
