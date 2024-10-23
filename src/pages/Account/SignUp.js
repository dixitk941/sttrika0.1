import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { auth } from "./firebaseConfig"; // Import auth from firebase.js
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase method for signup
import { db } from "./firebaseConfig"; // Import Firestore database
import { doc, setDoc } from "firebase/firestore"; // Firestore methods

const SignUp = () => {
  // States (as before)
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState(false);

  // Error and Success Messages
  const [errName, setErrName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errCity, setErrCity] = useState("");
  const [errCountry, setErrCountry] = useState("");
  const [errZip, setErrZip] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleName = (e) => setName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  const handleZip = (e) => setZip(e.target.value);

  // Email Validation
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  // Handle SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (checked) {
      // Validation (as before)
      if (!Name) setErrName("Enter your name");
      if (!email) setErrEmail("Enter your email");
      else if (!EmailValidation(email)) setErrEmail("Enter a valid email");
      if (!phone) setErrPhone("Enter your phone number");
      if (!password) setErrPassword("Create a password");
      else if (password.length < 6) setErrPassword("Passwords must be at least 6 characters");
      if (!address) setErrAddress("Enter your address");
      if (!city) setErrCity("Enter your city");
      if (!country) setErrCountry("Enter your country");
      if (!zip) setErrZip("Enter your zip code");

      // If all fields are valid
      if (Name && email && password && password.length >= 6 && address && city && country && zip) {
        try {
          // Create user using Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Save user details in Firestore
          await setDoc(doc(db, "users", user.uid), {
            Name,
            // email,
            phone,
            address,
            city,
            country,
            zip
          });

          setSuccessMsg(`Hello ${Name}, your account has been created! Check your email (${email}) for confirmation.`);
          
          // Clear form
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setAddress("");
          setCity("");
          setCountry("");
          setZip("");
        } catch (error) {
          const errorMessage = error.message;
          setErrEmail(errorMessage);
        }
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/" className="flex flex-col items-center text-center">
            <span className="text-3xl font-bold tracking-wide text-white" style={{ fontFamily: 'Times New Roman, serif' }}>
              Sttrika
            </span>
            <p className="text-lg font- text-white mt-2" style={{ fontFamily: 'Times New Roman, serif' }}>
              Style Meets Comfort
            </p>
            <div className="border-b-4 border-white w-1/2 mt-1"></div>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Get started for free
            </h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with Sttrika
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all Sttrika services
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              © Sttrika
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signin">
              <button
                className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold 
                tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign in
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Create your account
              </h1>
              <div className="flex flex-col gap-3">
                {/* Name */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Name</p>
                  <input
                    type="text"
                    onChange={handleName}
                    value={Name}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your name"
                  />
                  {errName && <p className="text-red-600">{errName}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Email</p>
                  <input
                    type="text"
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your email"
                  />
                  {errEmail && <p className="text-red-600">{errEmail}</p>}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Phone Number</p>
                  <input
                    type="text"
                    onChange={handlePhone}
                    value={phone}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your phone number"
                  />
                  {errPhone && <p className="text-red-600">{errPhone}</p>}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Password</p>
                  <input
                    type="password"
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Create a password"
                  />
                  {errPassword && <p className="text-red-600">{errPassword}</p>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Address</p>
                  <input
                    type="text"
                    onChange={handleAddress}
                    value={address}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your address"
                  />
                  {errAddress && <p className="text-red-600">{errAddress}</p>}
                </div>

                {/* City */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">City</p>
                  <input
                    type="text"
                    onChange={handleCity}
                    value={city}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your city"
                  />
                  {errCity && <p className="text-red-600">{errCity}</p>}
                </div>

                {/* Country */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Country</p>
                  <input
                    type="text"
                    onChange={handleCountry}
                    value={country}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your country"
                  />
                  {errCountry && <p className="text-red-600">{errCountry}</p>}
                </div>

                {/* Zip */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold">Zip Code</p>
                  <input
                    type="text"
                    onChange={handleZip}
                    value={zip}
                    className="w-full h-10 rounded-md border-[1px] border-gray-300 px-2 text-base text-black outline-none
                    focus:border-primeColor duration-300"
                    placeholder="Enter your zip code"
                  />
                  {errZip && <p className="text-red-600">{errZip}</p>}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="h-4 w-4 accent-primeColor"
                  />
                  <p className="text-base">
                    I agree to the{" "}
                    <span className="text-primeColor font-semibold cursor-pointer hover:underline">
                      Terms and Conditions
                    </span>
                  </p>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSignUp}
                className="w-full h-10 mt-3 rounded-md bg-primeColor text-gray-200 text-base font-titleFont font-semibold
                tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign Up
              </button>

              {/* Existing User Link */}
              <p className="text-base text-center mt-4">
                Already have an account?{" "}
                <Link to="/signin">
                  <span className="text-primeColor font-semibold cursor-pointer hover:underline">Sign In</span>
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
