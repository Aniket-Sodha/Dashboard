import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { app } from "./firebase"; // your Firebase config
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);
const user = auth.currentUser;

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const oredersRef = collection(db, "orders");
        const q = query(oredersRef, where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      fetchOrders(); // refresh list
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editorder/${id}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="pt-8 sm:p-6 md:p-8">
      <h2 className="text-2xl md:text-4xl font-semibold text-center mb-6 md:mb-10">
        Order List
      </h2>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-8 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-t text-sm md:text-base">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Product</div>
            <div>Qty</div>
            <div>Date</div>
            <div>Address</div>
            <div>Edit</div>
            <div>Delete</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <TableLoading />
          ) : (
            orders.map((order, index) => (
              <div
                key={order.id}
                className="grid grid-cols-8 px-4 py-3 border-b break-words  text-sm bg-white hover:bg-gray-50"
              >
                <div>{index + 1}</div>
                <div className="min-w-0 whitespace-normal break-words">
                  {order.customerName}
                </div>
                <div>{order.product}</div>
                <div>{order.quantity}</div>
                <div>{order.date}</div>
                <div>{order.address}</div>
                <div
                  className="text-blue-600 hover:underline px-3"
                  onClick={() => handleEdit(order.id)}
                >
                  <FaEdit className="cursor-pointer text-xl" />
                </div>
                <div
                  className="text-red-600 hover:underline px-3"
                  onClick={() => handleDelete(order.id)}
                >
                  <MdDeleteForever className="cursor-pointer text-xl" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowOrder;
function TableLoading() {
  return (
    <div>
      {Array(3)
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
