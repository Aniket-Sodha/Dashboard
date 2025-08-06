import { useNavigate } from "react-router-dom";
import log from "./Images/Login.jpg";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase";

let Register = () => {
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const nv = useNavigate();
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSymbol
    );
  };

  // check
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !Username) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Weak password");
      return;
    }

    

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        // console.log("User signed up:", userCredential);
        toast.success("Successfully Registered");
        setTimeout(() => {
          nv("/");
        }, 1000);
      })
      .catch((err) => {
        // console.error("Signup Error:", err);
        toast.error(err.message);
      });
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 px-4 ">
      <ToastContainer position="bottom-right" />
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className=" lg:w-1/2 md:w-full md:h-full ">
          <img
            src={log}
            alt="Login Visual"
            className="h-full w-full object-cover sm:w-full sm:h-1/2 "
          />
        </div>

        <div className="w-full lg:w-1/2  bg-[#48A3DA] p-8 flex">
          <form
            className=" flex-col justify-center items-center"
            // onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-4xl font-semibold text-white mb-2">Register</h2>
            <p className="text-sm text-white mb-6">Hii User 🖐️</p>

            <input
              type="text"
              required
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full max-w-md h-10 px-3 mb-4 rounded-md border border-gray-300"
            />

            <input
              type="email"
              required
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-md h-10 px-3 mb-4 rounded-md border border-gray-300"
            />
            <input
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-md h-10 px-3 mb-6 rounded-md border border-gray-300"
            />

            <button
              onClick={handleRegister}
              className="w-full max-w-md h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sign-In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
