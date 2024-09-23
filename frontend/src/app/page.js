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
          src="/assets/padel.png"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
          style={{ objectPosition: 'right'}} // Center the image
        />
        <div className="center-container">
          <MainTabs />
        </div>
      </div>
    </>
  );
}