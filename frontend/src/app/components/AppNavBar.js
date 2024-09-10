import { GiTennisBall } from 'react-icons/gi';
import Link from 'next/link';

export default function AppNavBar() {
  return (
    <nav className="bg-[#003060] shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <GiTennisBall style={{ marginRight: "1rem", fontSize: "3em", color: "white" }} />
          <span className="text-4xl font-bold text-white">
            Padel Website
          </span>
        </div>
        <div>
          <Link href="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
