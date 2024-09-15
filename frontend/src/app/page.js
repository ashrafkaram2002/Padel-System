"use client";

import Image from "next/image";
import Cookies from 'js-cookie';
import AppNavBar from './components/AppNavBar';
import MainTabs from './components/MainTabs';  
import { useState, useEffect } from 'react';

export default function Home() {

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  return (
    <>
      <AppNavBar onLogin={false} onHome={true} adminOn={isAdminLoggedIn}/>
      <div className="relative min-h-screen">
        <Image
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="center-container">
          <MainTabs />
        </div>
      </div>
    </>
  );
}