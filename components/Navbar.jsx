"use client";

import { Search, Person, LocalMallOutlined } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { useCartStore } from '@lib/store';

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const cart = user?.cart

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCartStore();
  useEffect(() => {
    useCartStore.persist.rehydrate()
  },[])

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
      <div className="navbar-container">
        <Link href="/">
          <h1 className="text-heading1-bold">Nails</h1>
        </Link>

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
              // disabled={search === ""}
              onClick={() => {
                if (search !== "") {
                  router.push(`/search/${search}`);
                }
              }}
            >
              <Search />
            </IconButton>
          </div>

          <Link href={"/cart"} className="shopping-bag">
            <LocalMallOutlined />
            <p>購物</p>
            {user ? <p>({cart?.length})</p> : <p>({totalItems})</p>}
          </Link>
          
          <button  
            onClick={() => setDropdownMenu(!dropdownMenu)}
          >
            {!user ? (
              <Link href="/login" className="login">
                <p>登入</p>
                <Person />
              </Link>
            ) : (
              <Image 
                src={user?.profileImage || "/assets/person.jpg"} 
                alt="profile" 
                className="profile-icon"
                width={40}
                height={40}
              />
            )}
          </button>

          {dropdownMenu && user && (
            <div className='dropdown-menu'>
              <Link href="/profile">個人頁面</Link>
              <Link href="/favorite">收藏</Link>
              <Link href="/cart">購物<span>({cart?.length})</span></Link>
              <Link href="/order">已購買</Link>
              <hr />
              <Link href="/works/create">建立作品</Link>
              <Link href={`/shop/${user._id}`}>目前作品</Link>
              <hr />
              <a onClick={handleLogout}>Log Out</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
