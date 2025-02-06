"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaSun, FaMoon } from 'react-icons/fa';
import Image from 'next/image';

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
        {/* eslint-disable-next-line react/no-unescaped-entities */}
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
      <div className="max-w-[30rem] h-[42rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <Image
          src="/images/deep.jpg"
          alt="Deep Fakes"
          width={384}
          height={256}
          className="object-cover w-full h-64"
        />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Deep Fakes
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        Deepfakes use advanced machine learning techniques, such as deep neural networks and generative adversarial networks, to create or alter images and videos in a highly realistic manner. These technologies can seamlessly blend or superimpose faces, voices, and movements, making it appear as though someone said or did something they never did. While this technology offers creative innovations in entertainment and digital art, it also raises significant concerns about misinformation, privacy breaches, and the potential for fraud or manipulation.
        </p>
      </div>
      </div>
      <div className="max-w-[30rem] h-[42rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <Image
          src="/images/deepfake.png"
          alt="AI"
          width={384}
          height={256}
          className="object-cover w-full h-64"
        />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        AI
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        Artificial Intelligence (AI) is a branch of computer science focused on creating systems that can perform tasks typically requiring human cognition—such as learning, reasoning, and problem-solving. AI leverages techniques like machine learning, deep learning, and neural networks to analyze data, adapt to new inputs, and make decisions, driving innovations across industries from healthcare to finance.
        </p>
      </div>
      </div>
      <div className="max-w-[30rem] h-[42rem] flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
        <Image
          src="/images/javascript.jpg"
          alt="Client Side"
          width={384}
          height={256}
          className="object-cover w-full h-64"
        />
      </div>
      <div className="p-6">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Client Side
        </h4>
        <p className="block mt-3 font-sans text-xl antialiased font-normal leading-relaxed text-gray-700">
        This application runs entirely on the client side, harnessing React's dynamic rendering and state management to deliver fast, interactive user experiences directly in the browser.
        </p>
      </div>
      </div>
    </div>
    </div>
  );
}
