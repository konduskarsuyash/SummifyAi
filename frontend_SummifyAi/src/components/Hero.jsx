import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ... (import image files)

const Button = ({ children, className, variant, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-colors";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "bg-transparent border border-current hover:bg-white hover:text-zinc-900",
  };

  return (
    <button className={`${baseStyle} ${variantStyles[variant || 'default']} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function Hero() {
  const [user, setUser] = useState(null); // State to hold user information
  const navigate = useNavigate(); // Hook for navigation


  const handleGetStartedClick = () => {
    if (user) {
      navigate('/features');
    } else {
      navigate('/login');
    }
  };

  // Function to get user's initials
  const getInitials = (name) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0).toUpperCase()).join('');
  };

  const images = [
    // ... (image files)
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-zinc-800 bg-opacity-80 z-10">
        <div className="flex items-center space-x-4 gap-40">
          <Link to="/" className="text-2xl font-bold text-white">SummifyAI</Link>
          <div className="flex items-center justify-center gap-20">
            <Link to="/about" className="text-lg hover:text-gray-300">About Us</Link>
            <Link to="/features" className="text-lg hover:text-gray-300">Features</Link>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {getInitials(user.username)}
              </div>
              <span className="text-lg">{user.username}</span>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="text-white border-white">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-zinc-900 hover:bg-gray-200">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-grow relative overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-7 gap-8 p-4">
          {images.map((src, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden relative">
              <img
                src={src}
                alt={`background ${index}`}
                className="w-full h-full object-cover opacity-30 transition-opacity duration-300 hover:opacity-40"
              />
              <div className="absolute inset-0 hover:opacity-0 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Stronger Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 opacity-90" />

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SummifyAI : Where Curiosity Meets Clarity !</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Harness the power of AI to summarize educational content and enhance your learning journey.</p>
          <div className="relative group inline-block">
            <button onClick={handleGetStartedClick} className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-100 transition-opacity duration-500"></span>
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950 group-hover:bg-transparent">
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1">Let's get started</span>
                  <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" fillRule="evenodd"></path>
                  </svg>
                </div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
