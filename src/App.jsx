import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./component/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import Content from "./component/Content";
import AddCategory from "./component/AddCategory";
import AddOrder from "./component/AddOrder";
// import AddBrand from "./component/AddBrand";
import ShowOrder from "./component/ShowOrder";
import ShowProducts from "./component/ShowProducts";
import ShowCategory from "./component/ShowCategory";
import Sidebar from "./component/Sidebar";
import UpdateProduct from "./component/UpdateProduct";
import UpdateCategory from "./component/UpdateCategory";
import UpdateOrder from "./component/UpdateOrder";
import Register from "./component/Register";
import { ToastContainer } from "react-toastify";
import Setting from "./component/Setting";
import AddProduct from "./component/AddProduct";

function App() {
  const path = useLocation();
  const isPath = ["/", "/register"].includes(path.pathname);
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {!isPath && (
        <div
          className={`${
            isOpen ? "left-0" : "-left-1000"
          } lg:left-0 lg:relative w-xs bg-[#151414] text-white/60 absolute top-0 h-full pl-5 lg:pl-2  transition-all duration-300 z-20`}
        >
          <Sidebar isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col w-full`}>
        {!isPath && (
          <Navbar isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)}   />
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/Dashboard" element={<Content />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/edit-category/:id" element={<UpdateCategory />} />
            <Route path="/edit/:id" element={<UpdateProduct />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/addorder" element={<AddOrder />} />
            <Route path="/editorder/:id" element={<UpdateOrder />} />
            <Route path="/orders" element={<ShowOrder />} />
            <Route path="/products" element={<ShowProducts />} />
            <Route path="/category" element={<ShowCategory />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
