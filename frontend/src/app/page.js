import Image from "next/image";
import AppNavBar from './components/AppNavBar';
import MainTabs from './components/MainTabs';  

export default function Home() {
  return (
    <>
      <AppNavBar />
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