import { IoSearch } from "react-icons/io5";
import admin from "./Images/admin.jpg";
import { RiMenu3Fill } from "react-icons/ri";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

let Navbar = ({ isOpen, setIsOpen }) => {
  const nv = useNavigate();
  const [user, setUser] = useState(null);

  const auth = getAuth(app);
  //check if user is logged in

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // console.log("User is logged in:", currentUser);
        setUser(currentUser);
      } else {
        // console.log("No user is logged in");
        nv("/");
        <Login />;
      }
    });
  }, [auth, nv]);
  return (
    <div className=" flex items-center shadow-md shadow-gray-200 w-full py-2">
      <div className="block lg:hidden ml-5">
        <RiMenu3Fill
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            isOpen ? "z-30 text-white delay-200" : ""
          } relative text-3xl cursor-pointer`}
        />
      </div>
      <IoSearch className=" text-3xl lg:ml-2 ml-5" />
      <div className=" flex justify-end items-center w-full gap-5 ">
        <img src={admin} alt="" className="rounded-full h-10 w-10" />
        <span className="mr-5 ">{user ? user.email : "Loading..."}</span>
      </div>
    </div>
  );
};

export default Navbar;
