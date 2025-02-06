"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { FaSun, FaMoon } from 'react-icons/fa';
import Image from 'next/image';

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----(BEGIN|END)[\w\s]+-----/g, "").replace(/\s+/g, "");
  const binaryDerString = atob(b64);
  const len = binaryDerString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryDerString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState<File | null>(null);
  const [publicKey, setPublicKey] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ type: string, message: string } | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>, inputId: string) => {
    setFile(null);
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleSign = async () => {
    if (!privateKey || !image) {
      showAlert('warning', 'Please upload both an image and a private key.');
      return;
    }

    const subtle = window.crypto.subtle;

    // Import private key
    const privateKeyText = await privateKey.text();
    const privateKeyData = pemToArrayBuffer(privateKeyText.trim());
    const privateKeyObj = await subtle.importKey(
      "pkcs8",
      privateKeyData,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );

    // Calculate hash of image
    const imageData = new Uint8Array(await image.arrayBuffer());
    const hashBuffer = await subtle.digest("SHA-256", imageData);

    // Sign the hash
    const signature = await subtle.sign(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
      privateKeyObj,
      hashBuffer
    );

    // Create signed image file with signature delimiter
    const delimiter = new TextEncoder().encode('\n--SIGNATURE--\n');
    const signedData = new Blob([
      new Uint8Array(imageData),
      delimiter,
      new Uint8Array(signature)
    ]);

    // Download the signed image
    const url = URL.createObjectURL(signedData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed_' + image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showAlert('success', 'Image signed successfully! The signed image has been downloaded.');
  };

  const handleValidate = async () => {
    try {
      if (!image || !publicKey) {
        showAlert('warning', 'Please upload both a signed image and a public key.');
        return;
      }

      const subtle = window.crypto.subtle;

      // Read the signed image
      const signedDataArray = new Uint8Array(await image.arrayBuffer());
      const delimiter = new TextEncoder().encode('\n--SIGNATURE--\n');

      function arrayIndexOf(arr: Uint8Array, subarr: Uint8Array): number {
        for (let i = 0; i <= arr.length - subarr.length; i++) {
          let match = true;
          for (let j = 0; j < subarr.length; j++) {
            if (arr[i + j] !== subarr[j]) {
              match = false;
              break;
            }
          }
          if (match) return i;
        }
        return -1;
      }

      const delimiterIndex = arrayIndexOf(signedDataArray, delimiter);

      if (delimiterIndex === -1) {
        showAlert('danger', 'The file does not contain a valid signature.');
        return;
      }

      const imageData = signedDataArray.slice(0, delimiterIndex);
      const signature = signedDataArray.slice(delimiterIndex + delimiter.length);

      // Import public key
      const publicKeyText = await publicKey.text();
      const publicKeyData = pemToArrayBuffer(publicKeyText);
      const publicKeyObj = await subtle.importKey(
        "spki",
        publicKeyData,
        {
          name: "RSA-PSS",
          hash: { name: "SHA-256" },
        },
        false,
        ["verify"]
      );

      // Calculate hash of original image
      const hashBuffer = await subtle.digest("SHA-256", imageData);

      // Verify signature
      const isValid = await subtle.verify(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        publicKeyObj,
        signature,
        hashBuffer
      );

      if (isValid) {
        showAlert('success', 'Image signature is valid!');
      } else {
        showAlert('danger', 'Image signature is invalid!');
      }
    } catch (error) {
      if (error instanceof Error) {
        showAlert('danger', `An error occurred during validation: ${error.message}`);
      } else {
        showAlert('danger', 'An unknown error occurred during validation.');
      }
    }
  };

  const handleGenerateKeyPair = async () => {
    const subtle = window.crypto.subtle;

    // Generate key pair
    const keyPair = await subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    );

    // Export keys
    const privateKeyData = await subtle.exportKey("pkcs8", keyPair.privateKey);
    const publicKeyData = await subtle.exportKey("spki", keyPair.publicKey);

    // Convert keys to PEM format
    function arrayBufferToPem(buffer: ArrayBuffer, type: "PRIVATE" | "PUBLIC"): string {
      const binary = String.fromCharCode(...new Uint8Array(buffer));
      const b64 = btoa(binary);
      const pem = `-----BEGIN ${type} KEY-----\n${b64.match(/.{1,64}/g)?.join("\n")}\n-----END ${type} KEY-----`;
      return pem;
    }

    const privateKeyPem = arrayBufferToPem(privateKeyData, "PRIVATE");
    const publicKeyPem = arrayBufferToPem(publicKeyData, "PUBLIC");

    // Create zip file
    const zip = new JSZip();
    zip.file("private_key.pem", privateKeyPem);
    zip.file("public_key.pem", publicKeyPem);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Download zip file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "key_pair.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showAlert('success', 'Key pair generated successfully! The key pair has been downloaded.');
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col items-center justify-start p-8 sm:p-20 transition-colors duration-300`}>
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
      <h1 className={`text-6xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-12 mt-12 tracking-tight`}>
        ImageSign
      </h1>
      <div className={`bg-grey shadow-md rounded-lg p-8 w-full max-w-lg mt-12 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 rounded-lg">
          <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          {image && <button onClick={() => handleRemoveFile(setImage, "file-upload-image")} className="text-red-500 font-bold">x</button>}
          <label htmlFor="file-upload-image" className={`cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded-full shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105`}>
        {image ? image.name : "Upload Image"}
          </label>
          <input id="file-upload-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setImage)} />
        </div>
        <div className="flex items-center gap-2">
          {privateKey && <button onClick={() => handleRemoveFile(setPrivateKey, "file-upload-private-key")} className="text-red-500 font-bold">x</button>}
          <label htmlFor="file-upload-private-key" className={`cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded-full shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105`}>
        {privateKey ? privateKey.name : "Upload Private Key"}
          </label>
          <input id="file-upload-private-key" type="file" accept=".pem" className="hidden" onChange={(e) => handleFileChange(e, setPrivateKey)} />
        </div>
        <div className="flex items-center gap-2">
          {publicKey && <button onClick={() => handleRemoveFile(setPublicKey, "file-upload-public-key")} className="text-red-500 font-bold">x</button>}
          <label htmlFor="file-upload-public-key" className={`cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded-full shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105`}>
        {publicKey ? publicKey.name : "Upload Public Key"}
          </label>
          <input id="file-upload-public-key" type="file" accept=".pem" className="hidden" onChange={(e) => handleFileChange(e, setPublicKey)} />
        </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-5 justify-center">
          <button onClick={handleSign} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 py-3 px-6 font-bold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Sign
          </button>
          <button onClick={handleValidate} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 py-3 px-6 font-bold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Validate
          </button>
          <button onClick={handleGenerateKeyPair} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-700 py-3 px-6 font-bold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300">
            Generate Key Pair
          </button>
        </div>
      </div>
      <div className="absolute top-5 left-5">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-black text-white font-medium py-2 px-4 rounded-full hover:bg-gray-800 transition duration-300"
          >
          Home
        </button>
      </div>

      {alert && (
        <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 rounded-xl text-sm ${alert?.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0043 13.3333V9.16663M9.99984 6.66663H10.0073M9.99984 18.3333C5.39746 18.3333 1.6665 14.6023 1.6665 9.99996C1.6665 5.39759 5.39746 1.66663 9.99984 1.66663C14.6022 1.66663 18.3332 5.39759 18.3332 9.99996C18.3332 14.6023 14.6022 18.3333 9.99984 18.3333Z" stroke={alert?.type === 'success' ? '#10B981' : '#EF4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="font-semibold mr-1">{alert?.type === 'success' ? 'Success' : 'Error'}</span> {alert?.message}
        </div>
      )}
      <a href="https://github.com/IndianTechSupport69/ImageSigning" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4">
        <Image 
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
          alt="GitHub" 
          width={48} 
          height={48} 
          className="rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300" 
        />
      </a>
    </div>
  );
}

