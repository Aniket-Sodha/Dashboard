import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase";
import { toast, ToastContainer } from "react-toastify";

const db = getFirestore(app);

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    date: "",
    address: "",

  });

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        alert("Order not found!");
        navigate("/updateorder");
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, formData);
      toast.success("Order updated successfully!");
      navigate("/updateorder");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ToastContainer position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4">Edit Order</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {[
          { label: "Customer Name", name: "customerName" },
          { label: "Product", name: "product" },
          { label: "Quantity", name: "quantity" },
          { label: "Date", name: "date", type: "date" },
          { label: "Shipping Address", name: "address" },
   
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded "
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default UpdateOrder;
