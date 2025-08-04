import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const db = getFirestore(app);

const UpdateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [categoryImg, setCategoryImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const docRef = doc(db, "category", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setCategoryName(data.name);
        setExistingImage(data.image);
      } else {
        toast.error("Category not found");
      }
    };

    fetchData();
  }, [id]);


  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = existingImage;

      if (categoryImg) {
        const formData = new FormData();
        formData.append("file", categoryImg);
        formData.append("upload_preset", "dashboard");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/djuvvurva/image/upload",
          formData
        );

        imageUrl = res.data.secure_url;
      }

      await updateDoc(doc(db, "category", id), {
        name: categoryName,
        image: imageUrl,
      });

      navigate("/categories"); 
      toast.success("Category updated!");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-xl lg:max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Category</h2>

      <form onSubmit={handleUpdateCategory}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name"
            className="w-full border border-gray-300 rounded-xl p-3 mb-3"
          />

          <label htmlFor="category-img" className="block text-gray-700 font-medium mb-2">
            Category Image
          </label>
          <input
            type="file"
            id="category-img"
            accept="image/*"
            ref={inputRef}
            onChange={(e) => setCategoryImg(e.target.files[0])}
            className="w-1/2 border p-2 rounded-xl border-gray-300 bg-gray-50 mb-3"
          />

          {existingImage && (
            <img src={existingImage} alt="Current" className="w-32 h-32 object-cover rounded-xl mt-2" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
