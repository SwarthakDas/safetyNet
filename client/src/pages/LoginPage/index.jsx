import { useForm } from "react-hook-form";
import { motion} from "framer-motion";
import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [role, setRole] = useState("User");
  const loginSchema = z.object({
    email: z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,"atleast 6 characters"),
  })
  const{
    register,
    handleSubmit,
    formState:{errors},
    reset
  }=useForm({
    resolver: zodResolver(loginSchema)
  })
  const navigate=useNavigate()
  
const [location, setLocation] = useState(null);

const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setLocation({ latitude, longitude });
        resolve({ latitude, longitude });
      },
      (err) => {
        console.error(err);
        reject(err);
      }
    );
  });
};

const onSubmit = async (data) => {
  try {

    // Ensure location is set
    let loc = location;
    if (!loc) {
      loc = await getLocation(); // Wait until location is fetched
    }
    data.latitude = loc.latitude;
    data.longitude = loc.longitude;

    if(role!=="User"){
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/department/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
          }
        )
        if (response.ok) {
          console.log("dept logged in")
          // Let's check all cookies
          console.log("All cookies:", document.cookie)
          console.log("JS-Cookie accessToken:", Cookies.get("accessToken"))
          
          // Let's also check the response
          const responseData = await response.json()
          console.log("Response data:", responseData)
        }
      } catch (error) {
        console.error("Error details:", error)
      }
    }
    else{
      try {
        const response=await fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/civilian/login`,
          {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(data)
          }
        )
        if(response.ok){
          console.log("user loggedin")
        }
      } catch (error) {
        console.error(error)
      }
    }
    navigate("/profile")
    console.log("Data:", data);

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 p-4">
      <img
            src="/signup_bg.jpg"
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-80 "
            
          />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg p-3 hover:scale-[1.02] duration-500 h-3/4"
      >
        
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-1/2 text-[#EAEAEA]"
        >
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img
            src="/signup_box.png"
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover rounded-xl hover:blur-[2px] duration-500"
          />
            <h2 className=" absolute top-16 left-10 text-5xl font-semibold ">Login</h2>
            <div className="absolute bottom-10 left-1/4">
            <p className="mt-2">New member?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 rounded-4xl border-white px-8 py-2 text-white hover:bg-white hover:text-gray-900 border-3"
              onClick={()=>{navigate("/signup")}}
              >
              Register
            </motion.button>
            </div>
            
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-1/2 p-10 h-full flex flex-col justify-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
          <p className="text-gray-600">Welcome to SafetyNet</p>
          <div className="mt-4 flex border-b">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-1/2  py-2 font-semibold ${role === "User" ? "border-gray-900 border-b-2" : "text-gray-500"}`}
              onClick={() => {setRole("User");reset()}}
            >
              User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-1/2 py-2 ${role === "Department" ? "border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => {setRole("Department");reset()}}
            >
              Department
            </motion.button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <input type="email" placeholder="Email" {...register("email")} className="w-full rounded border p-2" />
            <input type="password" placeholder="Password" {...register("password")} className="w-full rounded border p-2" />
            {errors.password && <p>{errors.password.message}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-700"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}