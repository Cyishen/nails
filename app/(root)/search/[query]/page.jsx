"use client";

import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import "@styles/Search.scss"
import Loader from '@components/Loader';
import WorkList from '@components/WorkList';

const SearchPage = () => {
  const { query } = useParams()

  const [loading, setLoading] = useState(true)

  const [workList, setWorkList] = useState([])

  const getWorkList = async () => {
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
    getWorkList()
  }, [query])

  return loading ? <Loader /> : (
    <>
      <h1 className='title-list'>'{query}' result</h1>

      {workList.length > 0 ? (
        <WorkList data={workList} />
      ) : (
        <>
          <p>No results found.</p>
          <p>Try a different search.</p>
        </>
      )}
    </>
  )
}

export default SearchPage