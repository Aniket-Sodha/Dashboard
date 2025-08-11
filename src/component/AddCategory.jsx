import { useState, useRef, use, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebase";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);
const user = auth.currentUser;



const AddCategory = () => {
  const [uid, setUid] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImg, setCategoryImg] = useState(null);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log(uid)
      } else {
        console.log("No user is logged in");
        setUid(null);
      }
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [auth]);

  const inputRef = useRef();
  const navigate = useNavigate();
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName || !categoryImg) {
      toast.error("Both fields are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", categoryImg);
      formData.append("upload_preset", "dashboard");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djuvvurva/image/upload",
        formData
      );

      const imageUrl = res.data.secure_url;

      await addDoc(collection(db, "category"), {
        uid: uid,
        name: categoryName,
        image: imageUrl,
      });

      toast.success("Category added successfully!");

      setTimeout(() => {
        setCategoryName("");
        setCategoryImg(null);
        navigate("/category");
      }, 1000);

      inputRef.current.value = "";
    } catch (error) {
      toast.error("Error adding category");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-xl lg:max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <ToastContainer position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add Category
      </h2>

      <form onSubmit={handleAddCategory}>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Name
          </label>
          <input
            type="text"
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <label
            htmlFor="category-img"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Image
          </label>
          <input
            type="file"
            id="category-img"
            accept="image/*"
            ref={inputRef}
            onChange={(e) => setCategoryImg(e.target.files[0])}
            className="w-1/2 border p-2 rounded-xl border-gray-300 bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
