import React from "react";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./firebase";

const Setting = () => {
  const auth = getAuth(app);
  const vigate = useNavigate("/setting");
  return (
    <div>
      <div className=" flex justify-center mt-5 text-4xl">
        <h2>Setting</h2>
      </div>
      <div className="flex justify-center items-center mt-10 font-medium">
        <ul className=" border-2 border-gray-300 px-10 py-15 text-2xl rounded-xl ">
          <div className="flex justify-center gap-5 px-2 rounded-lg items-center mb-5">
            <CgProfile />
            <li>User Profile </li>
          </div>
          <div className="flex justify-center gap-5 px-2 rounded-lg items-center p-15 ">
            <CgProfile />
            <li>User Profile </li>
          </div>

          <div
            className="flex justify-center gap-5 cursor-pointer text-white bg-red-500 px-2 rounded-lg items-center "
            onClick={() => signOut(auth)}
          >
            <RiLogoutBoxLine />
            <li>
              <button>Log Out</button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Setting;
