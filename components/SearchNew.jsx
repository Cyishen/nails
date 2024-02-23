"use client"

import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string'

const SearchNew = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';

      if(query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        })
      }

      router.push(newUrl, { scroll: false });
    }, 300)

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router])


  return (
    <div className="search-box">
      <input
        placeholder="Search"
        className="input-search-box"
        value={query}
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <IconButton
        aria-label="search" 
        color="primary"  
      >
        <Search />
      </IconButton>
    </div>
  )
}

export default SearchNew


export function formUrlQuery({ params, key, value }) {
  const currentUrl = qs.parse(params)
  currentUrl[key] = value

  const newUrl = qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )

  return newUrl
}

export function removeKeysFromQuery({ params, keysToRemove }) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}