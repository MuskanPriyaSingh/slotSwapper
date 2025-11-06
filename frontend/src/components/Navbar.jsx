import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoLogIn, IoLogOut, IoMenu, IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import API from "../api/axios";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await API.get("/user/logout", { withCredentials: true });
      toast.success(response.data.message || "Logged out successfully!");
      logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error logging out");
    }
  };

  // Active Link style
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold border-b-2 border-blue-400 transition-all"
      : "hover:text-blue-400 transition-all";

  // Navbar toggle function
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-gray-900 text-white px-6 md:px-10 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <h1
        className="font-bold text-2xl text-green-400 cursor-pointer"
        onClick={() => navigate("/")}
      >
        SlotSwapper
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/marketplace" className={linkClass}>
              Marketplace
            </NavLink>
            <NavLink to="/requests" className={linkClass}>
              Requests
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md cursor-pointer transition"
            >
              <IoLogOut className="mr-2 text-lg" />
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/signup"
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition"
          >
            <IoLogIn className="mr-2 text-lg" />
            Sign Up
          </NavLink>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={toggleMenu}
      >
        {menuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 border-t border-gray-700 flex flex-col items-center py-4 space-y-4 md:hidden z-50">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/marketplace"
                className={linkClass}
                onClick={closeMenu}
              >
                Marketplace
              </NavLink>
              <NavLink to="/requests" className={linkClass} onClick={closeMenu}>
                Requests
              </NavLink>

              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer transition"
              >
                <IoLogOut className="mr-2 text-lg" />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/signup"
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition"
              onClick={closeMenu}
            >
              <IoLogIn className="mr-2 text-lg" />
              Sign Up
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
