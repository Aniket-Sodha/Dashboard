import { IoSearch } from "react-icons/io5";
import admin from "./Images/admin.jpg";
import { RiMenu3Fill } from "react-icons/ri";

let Navbar = ({ isOpen, setIsOpen }) => {
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
        <span className="mr-5 ">john</span>
      </div>
    </div>
  );
};

export default Navbar;
