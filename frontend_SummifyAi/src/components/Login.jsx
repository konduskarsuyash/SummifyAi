import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
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
      const response = await fetch('http://127.0.0.1:8000/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.data.access);
        localStorage.setItem('username', data.data.username);
        
        // Show success message
        toast.success('Login successful!');

        // Redirect to the main landing page
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <>
      <Toaster /> {/* Toast container for displaying notifications */}
      <div className="main flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="form flex flex-col gap-4 bg-white p-8 w-full max-w-md rounded-2xl font-sans">
          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold">Username</label>
            <div className="inputForm flex items-center px-3 border border-gray-200 rounded-lg h-12 transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
              <input 
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text" 
                className="input ml-3 w-full h-full border-none focus:outline-none text-black text-lg" 
                placeholder="Enter your Username" 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold">Password</label>
            <div className="inputForm flex items-center px-3 border border-gray-200 rounded-lg h-12 transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="-64 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
              </svg>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input ml-3 w-full h-full border-none focus:outline-none text-black text-lg" 
                placeholder="Enter your Password" 
              />
            </div>
          </div>

          <button className="button-submit bg-gray-800 text-white font-medium rounded-lg h-12 w-full hover:bg-gray-700 transition-colors duration-200 text-lg">
            Login
          </button>
          <p className="text-center text-gray-700 text-lg">
            Don't have an account?{' '}
            <Link to="/signup">
              <span className="text-blue-500 font-medium cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;