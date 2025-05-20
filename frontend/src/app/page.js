"use client";

import Image from "next/image";
import AppNavBar from './components/AppNavBar';
import MainTabs from './components/MainTabs';
import React, { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <AppNavBar onLogin={false} onHome={true} />
      <div className="relative min-h-screen">
        <Image
          src="/assets/wallpaper.jpeg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
          style={{ 
            objectPosition: 'center top',
            transform: 'scale(1)',
            opacity: 1,
            zIndex: '-1'
          }}
        />
        <div className="center-container">
          <Suspense fallback={<div>Loading tabs...</div>}>
            <MainTabs />
          </Suspense>
        </div>
      </div>
    </>
  );
}
