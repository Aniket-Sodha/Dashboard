import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app } from "./firebase";
import defaultImg from "./Images/admin.jpg";

const db = getFirestore(app);

let ShowCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true); // start loading
    try {
      const snapshot = await getDocs(collection(db, "category"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "category", id));
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-8 text-4xl text-center mb-5">Categories</div>

      <div className="grid grid-cols-5 w-3/4 bg-gray-200 text-gray-700 font-semibold px-4 py-2 text-center">
        <div>No.</div>
        <div>Name</div>
        <div>Image</div>
        <div>Edit</div>
        <div>Delete</div>
      </div>

      {loading ? (
        <TableLoading />
      ) : (
        categories.map((cat, index) => (
          <div
            key={cat.id}
            className="grid grid-cols-5 w-3/4 px-4 py-3 border-b text-sm bg-white hover:bg-gray-50 items-center text-center"
          >
            <div>{index + 1}</div>
            <div>{cat.name}</div>
            <div>
              <img
                src={cat.image || defaultImg}
                alt="category"
                className="size-10 mx-auto object-cover"
              />
            </div>
            <div>
              <button
                onClick={() => handleEdit(cat.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
            </div>
            <div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-600 hover:text-red-800"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ShowCategory;

function TableLoading() {
  return (
    <div className="w-3/4">
      {Array(3)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 px-4 py-3 border-b bg-white animate-pulse items-center text-center"
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-300 rounded mx-auto w-4/5"
              ></div>
            ))}
          </div>
        ))}
    </div>
  );
}
