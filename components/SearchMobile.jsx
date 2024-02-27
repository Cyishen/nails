"use client"

import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Search } from "@mui/icons-material";
import { useRouter } from 'next/navigation';

const SearchMobile = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className="search-mobile">
      <input
        placeholder="Search"
        className="input-search-mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <IconButton
        aria-label="search" 
        color="primary"  
        onClick={() => {
          if (search !== "") {
            router.push(`/search/${search}`);
          }
        }}
      >
        <Search />
      </IconButton>
    </div>
  )
}

export default SearchMobile