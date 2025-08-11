import {
  MdSpaceDashboard,
  MdManageAccounts,
  MdOutlineMyLocation,
} from "react-icons/md";
import { BiLogoMastercard } from "react-icons/bi";
import { GiShoppingBag } from "react-icons/gi";
import { FaBoxes } from "react-icons/fa";
import { SiBloglovin } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RiMenu3Fill } from "react-icons/ri";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





const Sidebar = ({ isOpen, setIsOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const nv = useNavigate();
 


  const sidebarArr = [
    { icon: <MdSpaceDashboard />, name: "Dashboard", navigate: "/dashboard" },
    {
      icon: <MdManageAccounts className="text-xl" />,
      name: "User Management",
      submenu: [{ name: "item-1" }, { name: "item-2" }, { name: "item-3" }],
    },
    {
      icon: <BiLogoMastercard />,
      name: "Masters",
      submenu: [
        { name: "Add Category", navigate: "/addcategory" },
        { name: "Add Product", navigate: "/addproduct" },
        { name: "Add Order", navigate: "/addorder" },
      ],
    },

    { icon: <GiShoppingBag />, name: "Orders", navigate: "/orders" },
    { icon: <AiFillProduct />, name: "Products", navigate: "/products" },
    { icon: <FaBoxes />, name: "Category", navigate: "/category" },
    { icon: <IoNotifications/>  , name: "Notification" },
    { icon: <IoMdSettings />, name: "Setting" , navigate: "/setting" ,   },
  ];

  return (
    <>
      
      <div
        className={`lg:left-0 lg:relative bg-[#151414] text-white/60 relative top-0 h-full pl-5 lg:pl-2  transition-all duration-300 z-20`}
      >
        <div className="text-3xl text-center font-bold mb-4">
          Logo
          <br />
          <span className="text-sm text-blue-400">
            Elevate Your Digital Life
          </span>
        </div>

        {sidebarArr.map((item, index) =>
          item.submenu ? (
            <div key={index} className={`mb-4   `} >
              <details className="lg:w-full list-none">
                <summary
                  onClick={() => {
                    setCurrentIndex(index);
                    
                  }}
                  className={`flex justify-between items-center cursor-pointer py-2 px-2 ${
                    currentIndex === index && "text-white duration-150 px-6"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon} {item.name}
                  </span>
                  <IoIosArrowDown />
                </summary>
                <ul className="pl-2 text-sm mt-2 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (

                    <li
             
                      key={subIndex}
                      onClick={() => {
                        nv(subItem.navigate);
                        setIsOpen(false)
                      }}
                      className={` text-gray-400 hover:text-white cursor-pointer px-8`}
                    >
             
                      {subItem.name}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ) : (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                nv(item.navigate);
                setIsOpen(!isOpen);
              }}
              className={`${
                currentIndex === index &&
                "text-white duration-150 scale-115 px-8 "
              } flex items-center gap-2 px-2 py-2 hover:text-white cursor-pointer duration-100 mb-2 mr-2`}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
            
          )
        )}
      </div>
    

    </>
  );
};

export default Sidebar;
