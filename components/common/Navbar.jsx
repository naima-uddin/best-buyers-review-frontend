"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Navbar = () => {
  const router=useRouter();


  return (
    <nav className="bg-white py-4 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" width={200} height={200} alt="Logo" ></Image>
        </div>

        {/* Search Box */}
       <div className="flex-1 max-w-xl">
          <div className="flex rounded-full overflow-hidden ">
            <input 
              type="text" 
              placeholder="Search for Products" 
              className="flex-1 px-6 py-2.5 text-white focus:outline-none bg-[#4c4c4c]"
            />
            <select className="px-4 py-2.5 border-l-2text-gray-700 bg-[#4c4c4c] focus:outline-none min-w-40">
              <option>All Categories</option>
              <option>Baby</option>
              <option>Beauty</option>
              <option>Fashion</option>
              <option>Fitness</option>
              <option>Food</option>
              <option>Garden</option>
              <option>Gifts</option>
              <option>Health</option>
              <option>Home</option>
              <option>Money</option>
              <option>Office</option>
              <option>Outdoor</option>
              <option>Pets</option>
              <option>Sports</option>
              <option>Tech</option>
              <option>Tools</option>
            </select>
            <button className="px-3 bg-[#FFBC03] text-black font-medium hover:bg-[#F27005] transition-colors flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>

        
      </div>
    </nav>
  );
};

export default Navbar;