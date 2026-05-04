import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Card } from '@mui/material';
import Register from "./Register";
import Login from "./Login";

const Authentication = () => {
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Redirect to Home if user is already logged in
  useEffect(() => {
    if (auth.jwt || auth.user) {
      navigate("/", { replace: true });
    }
  }, [auth.jwt, auth.user, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side: Image */}
      <div className="w-2/3 hidden md:block">
        <img
          className="w-full h-full object-cover"
          src="social1.png" // Double check this filename!
          alt="Social Media Illustration"
        />
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center px-8 bg-gray-50">
        <Card className="p-8 h-full w-full max-w-md shadow-lg">
          
          <div className="flex flex-col items-center mb-8 space-y-2">
            <h1 className="logo text-4xl font-bold text-blue-600">SnapTalk</h1>
            <p className="text-center text-gray-500 text-sm">
              Connecting you to the world, one snap at a time.
            </p>
          </div>

          {/* 2. Nested Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          
          {/* 3. Toggle Link Helper */}
          <div className="mt-5 text-center">
            {location.pathname === "/register" ? (
              <p>Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer font-semibold">Login</span></p>
            ) : (
              <p>New to SnapTalk? <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer font-semibold">Create Account</span></p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Authentication;
