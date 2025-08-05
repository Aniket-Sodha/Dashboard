import { useNavigate } from "react-router-dom";
import log from "./Images/Login.jpg";
import { toast, ToastContainer } from "react-toastify";
import { isValidElement, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebase";
import { FcGoogle } from "react-icons/fc";

let Login = () => {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
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
      toast.error("Please enter email and password");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email");
      return;
    }
    if (!isValidPassword(password)) {
      toast.error("Invalid password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential);
        toast.success("Login successful");
        setTimeout(() => nv("/Dashboard"), 1500);
      })
      .catch((err) => {
        console.error("Login error:", err);
        toast.error("Invalid email or password");
      });
  };
  // Sign in with Google
  let signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      toast.success("Login successful");
      setTimeout(() => nv("/Dashboard"), 500);
    });
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 px-4 ">
      <ToastContainer position="bottom-right" />
      <div className="flex flex-col md:flex-row w-full max-w-5xl relative bg-white rounded-2xl overflow-hidden shadow-lg">
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
              className="w-full max-w-md h-10 font-medium mb-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Log-In
            </button>
            <div className="bg-gray-100 h-10  w-full max-w-md font-medium rounded-md flex justify-center items-center hover:bg-gray-200">
              <button onClick={signInWithGoogle} className="flex gap-2">
                <span>Sign In With Google</span>{" "}
                <FcGoogle className="text-2xl " />
              </button>
            </div>
            <div className="flex justify-center mt-10 gap-2">
              <span>Not a member? </span>
              <button
                onClick={() => nv("/register")}
                className="text-blue-100 cursor-grab"
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
