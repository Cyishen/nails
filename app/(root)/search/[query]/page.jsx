"use client";

import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import "@styles/Search.scss"
import Loader from '@components/Loader';
import WorkList from '@components/WorkList';

const SearchPage = () => {
  const { query } = useParams()

  const decodedQuery = decodeURIComponent(query)

  const [loading, setLoading] = useState(true)

  const [workList, setWorkList] = useState([])

  const getSearchWorkList = async () => {
    try {
      const response = await fetch(`/api/work/search/${query}`, {
        method: 'GET',
      })

      const data = await response.json()
      setWorkList(data)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getSearchWorkList()
  }, [query])

  return loading ? <Loader /> : (
    <>
      <h1 className='title-list'>Search: '{decodedQuery}' </h1>

      {workList.length > 0 ? (
        <WorkList data={workList} hideCategories={true} />
      ) : (
        <div className='search-empty'>
          <h4>No Results Found.</h4>
          <p>Try a different search.</p>
        </div>
      )}
    </>
  )
}

export default SearchPage