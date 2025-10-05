import React, { useState } from 'react'
import Register from '../component/Auth/Register';
import Login from '../component/Auth/Login';

function UserAuth() {
  const [isLogin, setIsLogin] = useState(true); // false = Register, true = Login

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        
        {/* Left Section - Illustration */}
        <div className="md:w-1/2 bg-orange-500 p-8 hidden lg:flex items-center flex-col justify-center relative">
          <div className="bg-white rounded-full p-2">
            <img src="public/logo3-m.png" alt="logo" />
          </div>
          <h2 className="pacifico-regular text-4xl">
            Recipe<span className="text-white pacifico-regular">Hub</span>
          </h2>
        </div>

        {/* Right Section - Auth Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {isLogin ? <Login /> : <Register />}

          <p className="mt-8 text-center text-gray-600 text-sm">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-orange-500 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-orange-500 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
