"use client";

import Image from "next/image";
import AppNavBar from './components/AppNavBar';
import MainTabs from './components/MainTabs';  

export default function Home() {

  return (
    <>
      <AppNavBar onLogin={false} onHome={true}/>
      <div className="relative min-h-screen">
        <Image
          src="/assets/wallpaper.jpeg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
          style={{ 
            objectPosition: 'center top', // Adjust positioning slightly
            transform: 'scale(1)', // Zoom out by scaling down
            opacity: 1, // Make it slightly translucent
            zIndex: '-1' // Ensure it's behind all other elements
          }} 
        />
        <div className="center-container">
          <MainTabs />
        </div>
      </div>
    </>
  );
}
