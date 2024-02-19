"use client"

import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Search } from "@mui/icons-material";
import { useRouter } from 'next/navigation';

const SearchBox = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className="search-box">
      <input
        placeholder="Search"
        className="input-search-box"
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

export default SearchBox