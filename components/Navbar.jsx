"use client";

import { Search, Person } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton } from '@mui/material'

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownMenu && !event.target.closest('.dropdown-menu')) {
      setDropdownMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
    
  }, [dropdownMenu]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };



  return (
    <div className={`navbar ${isScrolled ? "bg-black-1 text-white transition-colors duration-300" : ""}`}>
      <Link href="/">
        <h1 className="text-heading1-bold">Nails</h1>
      </Link>

      <div className="nav-links">
        <Link 
          href="/"
          className={`${
            pathname === "/" ? "text-pink-1" : ""
          } nav-link`} 
        >
          Home
        </Link>
        <Link 
          href="/my-shop" 
          className={`${
            pathname === "/my-shop" ? "text-pink-1" : ""
          } nav-link`} 
        >
          MyShop
        </Link>
      </div>

      <div className="nav-right">
        <div className="search">
          <input
            placeholder="Search"
            className="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton
            aria-label="search" 
            color="primary"  
            disabled={search === ""}
            onClick={() => router.push(`/search/${search}`)}
          >
            <Search sx={{ color: "primary" }} />
          </IconButton>
        </div>
        
        <button  
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          {!user ? (
            <Link href="/login" className="flex font-medium">
              <p>LogIn</p>
              <Person />
            </Link>
          ) : (
            <img 
              src={user?.profileImage || "/assets/person.jpg"} 
              alt="profile" 
              className="profile-icon"
            />
          )}
        </button>

        {dropdownMenu && user && (
          <div className='dropdown-menu'>
            <Link href="/profile">Profile</Link>
            <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
            <Link href="/wishlist">Favorites</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/order">Orders</Link>
            <Link href="/works/create">Create</Link>
            <a onClick={handleLogout}>Log-Out</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
