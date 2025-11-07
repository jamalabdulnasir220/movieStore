import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  return (
    <div className="border-b border-gray-300/30 flex items-center justify-between px-6 md:px-10 h-16">
      <Link to={"/"}>
        <img className="w-36 h-auto" src={assets.logo} alt="logo" />
      </Link>
    </div>
  );
};

export default AdminNavbar;
