"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col items-center justify-center transition-colors duration-300`}>
      <h1 className={`text-6xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-12 mt-12 tracking-tight`}>
        ImageSign
      </h1>
      <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
        Welcome to ImageSign, your trusted platform for secure image signing using private and public keys to mitigate deep fakes.
      </p>
      <Link href="/sign" className="bg-black text-white font-medium py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300 mt-10">
      Go to Sign Page
      </Link>
      <a href="https://github.com/IndianTechSupport69/ImageSigning" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-12 h-12 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300" />
      </a>
      <div className="absolute top-5 right-5">
      <label className="inline-flex items-center cursor-pointer">
        <input
        type="checkbox"
        checked={darkMode}
        onChange={toggleDarkMode}
        className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {darkMode ? <FaMoon /> : <FaSun />}
        </span>
      </label>
      </div>
      <hr className="w-1/2 border-t-2 border-gray-300 my-8" />

      <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mt-5 tracking-tight`}>
        Why us? </h2>
    <div className="flex justify-center items-center min-h-screen space-x-10">
      <div className="max-w-[24rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <img src="/images/deep.jpg" alt="" className="w-full h-64 object-cover" />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Deep Fakes
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit voluptates, voluptatibus ratione distinctio repellendus nesciunt veritatis quasi, aperiam accusamus omnis sint nostrum quos, exercitationem minus? Neque repudiandae inventore repellendus aut.
        </p>
      </div>
      </div>
      <div className="max-w-[24rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <img src="/images/deepfake.png" alt="" className="w-full h-64 object-cover" />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        AI
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit voluptates, voluptatibus ratione distinctio repellendus nesciunt veritatis quasi, aperiam accusamus omnis sint nostrum quos, exercitationem minus? Neque repudiandae inventore repellendus aut.
        </p>
      </div>
      </div>
      <div className="max-w-[24rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <img src="/images/javascript.jpg" alt="" className="w-full h-64 object-cover" />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Client Side
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit voluptates, voluptatibus ratione distinctio repellendus nesciunt veritatis quasi, aperiam accusamus omnis sint nostrum quos, exercitationem minus? Neque repudiandae inventore repellendus aut.
        </p>
      </div>
      </div>
    </div>
    </div>
  );
}
