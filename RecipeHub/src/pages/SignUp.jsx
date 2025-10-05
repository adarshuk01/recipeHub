import React from 'react';
import Register from '../component/Auth/Register';
import Login from '../component/Auth/Login';

const SignUp = () => {
  return (
    <div className=" flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        {/* Left Section - Illustration */}
        <div className="md:w-1/2 bg-orange-500 p-8 hidden lg:flex items-center flex-col justify-center relative">
        <div className='bg-white rounded-full'>
          <img className=' ' src="public/logo3-m.png" alt="" />
          

        </div>
        <h2 className='pacifico-regular text-4xl'>Recipe<span className='text-white pacifico-regular'>Hub</span> </h2>
        </div>

        {/* Right Section - Signup Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
         

         <Register/>
         <Login/>
          <p className="mt-8 text-center text-gray-600 text-sm">
            Already have an account? <a href="#" className="text-orange-500 hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;