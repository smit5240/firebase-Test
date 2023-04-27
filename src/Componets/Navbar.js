import React from "react";
import { Link, useLocation } from "react-router-dom";
export default function Navbar() {
  const location = useLocation();
  const logoutuser = () => {
    window.alert("Are sure Logout User");
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("email");
  };
  return (
    <div>
      <nav className="bg-white dark:bg-gray-900  w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 w-full">
          <a href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Firebase
            </span>
          </a>
          <div className="flex md:order-2 md:hidden">
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only"></span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900  dark:border-gray-700">
              {localStorage.getItem("token") && (
                <li>
                  <Link
                    to="/"
                    className={`block py-2 pl-3 pr-4 text-white hover:text-blue-700  ${
                      location.pathname === "/" ? "text-[#1A65F6]" : ""
                    }`}
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
              )}
              {!localStorage.getItem("token") && (
                <li>
                  <Link
                    to="/register"
                    className={`block py-2 pl-3 pr-4 text-white hover:text-blue-700  ${
                      location.pathname === "/register" ? "text-[#1A65F6]" : ""
                    }`}
                  >
                    Register
                  </Link>
                </li>
              )}
              {!localStorage.getItem("token") && (
                <li>
                  <Link
                    to="/login"
                    className={`block py-2 pl-3 pr-4 text-white hover:text-blue-700  ${
                      location.pathname === "/login" ? "text-[#1A65F6]" : ""
                    }`}
                  >
                    Login
                  </Link>
                </li>
              )}
              {localStorage.getItem("token") && (
                <li onClick={() => logoutuser()}>
                  <Link
                    to="/login"
                    className={`block py-2 pl-3 pr-4 text-white hover:text-blue-700  ${
                      location.pathname === "/logout" ? "text-[#1A65F6]" : ""
                    }`}
                  >
                    Logout
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
