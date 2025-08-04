import { useNavigate } from "react-router-dom";
import log from "./Images/Login.jpg";
import { toast, ToastContainer } from "react-toastify";
import { isValidElement, useState } from "react";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
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
  const handleLogin = (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please enter both Email and Password");
    return;
  }

  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  if (!isValidPassword(password)) {
    toast.error(
      "Password must be at least 6 characters and include uppercase, lowercase, number, and symbol"
    );
    return;
  }

  // Firebase: create account
  createUserWithEmailAndPassword(auth, email, password)
    .then((value) => {
      console.log("Firebase Response:", value);
      toast.success("Successfully Signed Up");
      setTimeout(() => nv("/Dashboard"), 1000);
    })

    // sign up
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential);
        toast.success("Successfully Logged In");
        setTimeout(() => nv("/Dashboard"), 1000);
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Invalid credentials or user does not exist");
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
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-4xl font-semibold text-white mb-2">Log In</h2>
            <p className="text-sm text-white mb-6">Welcome Back</p>

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
        onClick={handleLogin}
        
              className="w-full max-w-md h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
