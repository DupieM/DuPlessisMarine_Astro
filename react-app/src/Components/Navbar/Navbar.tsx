import React, { useState, useEffect, useRef } from "react";
import styles from "./NavbarStyle.module.scss";
import HomeIcon from "../../assets/icons/HomeIcon.svg";
import CurrencyIcon from "../../assets/icons/CurrencyIcon.svg";
import StackIcon from "../../assets/icons/StackIcon.svg";
import AdminIcon from "../../assets/icons/AdminIcon.svg";
import MoreIcon from "../../assets/icons/MoreIcon.svg";
import Logo from "../../assets/login/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
// import axios from "axios";

export const fetchUserDetails = async (setUser: (user: any) => void) => {
  const email = localStorage.getItem('email_to_validate');
  if (!email) {
    console.error('No email found');
    return;
  }

  const url = `http://localhost:5122/api/User/email?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    const data = await response.json();
    setUser({
      name: data.username,
      email: data.email,
      role: data.role, // Include role in the user object
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // const handleLogout = async () => {
  //   try {
  //     try {
  //       const response = await fetch('http://localhost:5122/api/Auth/logout', {
  //         method: 'POST'
  //       });
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //       alert("An error occurred. Please try again.");
  //     }

  //     // Clear the token from local storage
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('email_to_validate');

  //     // Navigate to the login page
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     // Optionally, handle the error (e.g., show a notification)
  //   }
  // };



  const handleLogout = async () => {
    const email = localStorage.getItem("email_to_validate");

    if (!email) {
      alert("No email found for logout.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5122/api/Auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally add token if needed, otherwise remove this line
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is not empty
      const responseText = await response.text();
      if (response.ok) {
        const data = responseText ? JSON.parse(responseText) : {};
        localStorage.removeItem("token"); // Clear the token from local storage
        localStorage.removeItem("email_to_validate");
        alert(data.message || "Logout successful.");
        logout(); //Set the user as logged out in auth context
        navigate("/login");
      } else {
        // Handle server errors
        alert(responseText || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    fetchUserDetails(setUser);

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.navigation}>
        <div className={styles.frame}>
          <img className={styles.group} alt="Group" src={Logo} />
          <div className={styles["text-wrapper"]}>Astro</div>
        </div>
        <div className={styles.vector}></div>
        <div>
          <div className={styles["text-wrapper-2"]}>MAIN</div>
        </div>
        <div className={styles.tab} onClick={() => navigate("/overview")}>
          <img className={styles.img} alt="Frame" src={HomeIcon} />
          <div
            className={`${styles["text-wrapper-tab"]} ${
              isActive("/overview") ? styles.active : ""
            }`}
          >
            Overview
          </div>
        </div>
        <div className={styles.tab} onClick={() => navigate("/purchasing")}>
          <img className={styles.img} alt="Frame" src={CurrencyIcon} />
          <div
            className={`${styles["text-wrapper-tab"]} ${
              isActive("/purchasing") ? styles.active : ""
            }`}
          >
            Trade
          </div>
        </div>
        <div className={styles.tab} onClick={() => navigate("/transactions")}>
          <img className={styles.img} alt="Frame" src={StackIcon} />
          <div
            className={`${styles["text-wrapper-tab"]} ${
              isActive("/transactions") ? styles.active : ""
            }`}
          >
            Transactions
          </div>
        </div>
        {user?.role === "admin" && (
          <div className={styles.tab} onClick={() => navigate("/admin")}>
            <img className={styles.img} alt="Frame" src={AdminIcon} />
            <div
              className={`${styles["text-wrapper-tab"]} ${
                isActive("/admin") ? styles.active : ""
              }`}
            >
              Admin
            </div>
          </div>
        )}
      </div>
      <div className={styles["user-info"]}>
        <div className={styles.vector}></div>
        <div className={styles["frame-2"]}>
          <div className={styles.ellipse}></div>
          <div className={styles["group-2"]}>
            <div className={styles["text-wrapper-5"]}>{user?.name}</div>
            <div className={styles["text-wrapper-6"]}>{user?.email}</div>
          </div>
          <img
            className={styles["frame-3"]}
            alt="Frame"
            src={MoreIcon}
            onClick={handleDropdownToggle}
          />
          {dropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
