import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-hot-toast'; // Import toast

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/account/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      } else {
        // Handle success
        toast.success('Sign up successful!'); // Show success message

        // Delay for 2 seconds before navigating to the login page
        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2000 milliseconds for a 2-second delay
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="main flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="form flex flex-col gap-4 bg-white p-8 w-full max-w-md rounded-2xl font-sans">
          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold text-lg">Email</label>
            <div className="inputForm flex items-center px-3 border border-gray-300 rounded-lg h-12 transition-colors duration-200">
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input ml-3 w-full h-full border-none focus:outline-none text-lg text-black" 
                placeholder="Enter your Email" />
            </div>
          </div>

          {/* Username Input */}
          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold text-lg">Username</label>
            <div className="inputForm flex items-center px-3 border border-gray-300 rounded-lg h-12 transition-colors duration-200">
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange} 
                className="input ml-3 w-full h-full border-none focus:outline-none text-lg  text-black" 
                placeholder="Enter your Username" />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold text-lg">Password</label>
            <div className="inputForm flex items-center px-3 border border-gray-300 rounded-lg h-12 transition-colors duration-200">
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input ml-3 w-full h-full border-none focus:outline-none text-lg  text-black"
                placeholder="Enter your Password" />
            </div>
          </div>

          <button className="button-submit bg-gray-800 text-white font-medium rounded-lg h-12 w-full hover:bg-gray-700 transition-colors duration-200 text-lg">
            Sign Up
          </button>
          <p className="text-center text-gray-700 text-lg">
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-blue-500 font-medium cursor-pointer ">Sign In</span>
            </Link>
          </p>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Signup;