import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebase"; // your Firebase config
import { toast } from "react-toastify"; // optional for feedback

const db = getFirestore(app);

const AddOrder = () => {
  const [orderData, setOrderData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    date: "",
    address: "",
  });

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "orders"), {
        ...orderData,
 
      });

      toast.success("Order placed successfully!");

      setOrderData({
        customerName: "",
        product: "",
        quantity: "",
        date: "",
        address: "",
      });
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Order</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={orderData.customerName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Product</label>
          <input
            type="text"
            name="product"
            value={orderData.product}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Product"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={orderData.quantity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Quantity"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={orderData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Shipping Address</label>
          <textarea
            name="address"
            value={orderData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Address"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
