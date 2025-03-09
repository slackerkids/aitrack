"use client";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "../axios/instance";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const commonStyles = {
  inputIcon:
    "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
  input:
    "block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white caret-blue-600",
  button:
    "inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-[#16a07c] to-[#75eea1] focus:outline-none hover:opacity-80 focus:opacity-80",
  socialButton:
    "relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none",
  link: "font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline",
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true); // New state variable for toggling

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/register/", formData);
      setSuccess("Successfully signed up!");
      toast("Login successful");

      // Saving JWT Token to localStorage
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("token", token);

      // Check role and push based on role
      if (response.data.role === "patient") {
        router.push("/client");
      } else {
        router.push("/doctor");
      }

      setError("");
    } catch (err) {
      setError("Sign-up failed. Please try again.");
      toast.error("Sign-up failed. Please try again.");
      setSuccess("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData = {
      email: formData.email,
      password: formData.password,
    };
    console.log(newData);
    try {
      const response = await axiosInstance.post("/login/", newData);
      setSuccess("Successfully loged in!");
      toast("Login successful");

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      const role = response.data.role;
      localStorage.setItem("role", role);
      console.log(role, token);
      // Check role and push based on role
      if (response.data.role === "patient") {
        router.push("/client");
      } else {
        router.push("/doctor");
      }

      setError("");
    } catch (err) {
      setError("Login failed. Please try again.");
      toast.error("Sign-up failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <section className="bg-white max-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8 l  max-h-screen">
          <div className="absolute inset-0">
            <Image
              className="object-cover"
              src="https://images.unsplash.com/photo-1690321607822-669326f4e3cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Green abstract"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent max-h-screen"></div>
          <div className="relative">
            <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
              <div className="flex justify-start">
                <h3 className="text-6xl font-bold text-white">HealHunter</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24 h-screen">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              {isLogin ? (
                <>
                  Sign in to{" "}
                  <span className="text-4xl font-bold bg-gradient-to-tr from-green-500 via-green-400 to-green-600 text-transparent bg-clip-text">
                    HealHunter
                  </span>
                </>
              ) : (
                <>
                  Sign up to{" "}
                  <span className="text-4xl font-bold bg-gradient-to-tr from-green-500 via-green-400 to-green-600 text-transparent bg-clip-text">
                    HealHunter
                  </span>
                </>
              )}
            </h2>
            <p className="mt-2 text-base text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={commonStyles.link}
              >
                {isLogin ? "Create a free account" : "Login"}
              </button>
            </p>
            {isLogin ? (
              <form
                action="#"
                method="POST"
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className={commonStyles.inputIcon}>
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter email to get started"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className={commonStyles.inputIcon}>
                      <FaLock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className={commonStyles.button}>
                    Log in
                  </button>
                </div>
              </form>
            ) : (
              <form
                action="#"
                method="POST"
                onSubmit={handleSignUp}
                className="mt-8 space-y-5"
              >
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <div>
                  <label className="text-base font-medium text-gray-900">
                    First & Last name
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className={commonStyles.inputIcon}>
                      <FaUser className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className={commonStyles.inputIcon}>
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter email to get started"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className={commonStyles.inputIcon}>
                      <FaLock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className={commonStyles.button}>
                    Create account
                  </button>
                </div>
              </form>
            )}

            <div className="mt-3 space-y-3">
              <button type="button" className={commonStyles.socialButton}>
                <div className="absolute inset-y-0 left-0 p-4">
                  <FaGoogle className="w-6 h-6 text-rose-500" />
                </div>
                Sign up with Google
              </button>
            </div>

            <p className="mt-5 text-sm text-gray-600">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link href="#" className={commonStyles.link}>
                Privacy Policy
              </Link>{" "}
              &{" "}
              <Link href="#" className={commonStyles.link}>
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
