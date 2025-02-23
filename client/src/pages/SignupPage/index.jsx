import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupPage() {

const userSchema = z.object({
  username: z.string().min(6,"atleast 6 characters").max(30,"username can be upto 30 characters"),
  email: z.string().email({message:"Invalid email address"}),
  password:z.string().min(6,"atleast 6 characters"),
  confirmPassword:z.string().min(6,"atleast 6 characters"),
  firstName: z.string(),
  lastName: z.string(),
}).refine((data)=>data.password===data.confirmPassword,{
  message:"Password do not match",
  path: ["confirmPassword"]
})

const deptSchema = z.object({
  departmentName: z.string(),
  email: z.string().email({message:"Invalid email address"}),
  password:z.string().min(6,"atleast 6 characters"),
  confirmPassword:z.string().min(6,"atleast 6 characters"),
  adminName: z.string(),
  departmentRole: z.string(),
}).refine((data)=>data.password===data.confirmPassword,{
  message:"Password do not match",
  path: ["confirmPassword"]
})

const [role, setRole] = useState("User");
const navigate = useNavigate();

const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm({
  resolver: zodResolver(role === "User" ? userSchema : deptSchema),
});

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
    // Remove empty fields
    delete data.confirmPassword;
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });

    // Ensure location is set
    let loc = location;
    if (!loc) {
      loc = await getLocation(); // Wait until location is fetched
    }
    data.latitude = loc.latitude;
    data.longitude = loc.longitude;

    if(role!=="User"){
      try {
        delete data.confirmPassword
        const response=await fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/register`,
          {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(data)
          }
        )
        if(response.ok){
          console.log("department registered")
        }
      } catch (error) {
        console.error(error)
      }
    }
   

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
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            
          />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg p-3 hover:scale-[1.02] duration-500 "
      >
        
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-1/2 text-[#EAEAEA] hidden md:block"
        >
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img
            src="/signup_box.png"
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover rounded-xl hover:blur-[2px] duration-500"
          />
            <h2 className=" absolute top-16 left-10 text-5xl font-semibold ">Create your Account</h2>
            <div>
            <div className="absolute bottom-10 left-1/4">
            <p className="mt-2">Already a member?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 rounded-4xl border-white px-8 py-2 text-white hover:bg-white hover:text-gray-900 border-3"
              onClick={()=>{navigate("/login")}}
              >
              Sign In
            </motion.button>
            </div>
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:w-1/2 p-10"
        >
          <h2 className="text-2xl font-semibold text-gray-900">Sign up</h2>
          <p className="text-gray-600">Welcome to SafetyNet</p>

          <div className="mt-4 flex border-b">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-1/2 border-b-2 py-2 font-semibold ${role === "User" ? "border-gray-900" : "text-gray-500"}`}
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
          <input type="text" placeholder={role === "User" ? "Username" : "Department Name"} {...register(role === "User" ? "username" : "departmentName")} className="w-full rounded border p-2" />
            <div className="flex space-x-2">
              <AnimatePresence mode="wait">
                <motion.input
                  key={role === "User" ? "firstName" : "adminName"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder={role === "User" ? "First Name" : "Admin Name"}
                  {...register(role === "User" ? "firstName" : "adminName")}
                  className={"w-1/2 rounded border p-2"}
                />
              </AnimatePresence>
              <AnimatePresence>
                
                  <motion.input
                    key={role === "User" ? "lastName" : "departmentRole"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder={role === "User" ? "Last Name" : "Department Role"}
                    {...register(role === "User" ? "lastName" : "departmentRole")}
                    className="w-1/2 rounded border p-2"
                  />
                
                
                
              </AnimatePresence>
            </div>
            
            <input type="email" placeholder="Email" {...register("email")} className="w-full rounded border p-2" />
            {errors.email && <p>{errors.email.message}</p>}
            <input type="password" placeholder="Password" {...register("password")} className="w-full rounded border p-2" />
            {errors.password && <p>{errors.password.message}</p>}
            <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} className="w-full rounded border p-2" />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            <motion.button type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-700"
            >
              Create Account
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}