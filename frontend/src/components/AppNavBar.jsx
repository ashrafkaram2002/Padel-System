import React from "react";
import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { GiTennisBall } from "react-icons/gi";

export default function AppNavBar({ onLogin }) {
  return (
    <Navbar fluid rounded className="justify-center">
      <Navbar.Brand>
        <GiTennisBall
          size={"2.3rem"}
          color="gray"
          style={{ marginRight: "1rem" }}
        />
        <span className="self-center whitespace-nowrap text-4xl font-semibold text-gray-500">
          Padel Tracker
        </span>
      </Navbar.Brand>
      <div className="flex w-1/3 justify-between">
        <Link
          className="text-grey-500 font-semibold text-lg hover:text-blue-700"
          to={"/"}
        >
          Home
        </Link>
        <Link
          className="text-grey-500 font-semibold text-lg hover:text-blue-700"
          to={"/solo"}
        >
          Solos
        </Link>
        <Link
          className="text-grey-500 font-semibold text-lg hover:text-blue-700"
          to={"/"}
        >
          Pairs
        </Link>
      </div>
      <div className="flex items-center w-45">
        {!onLogin && (
          <Link to="/login">
            <Button color="blue" className="font-semibold">
              Login
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}
