'use client'

import React, { useState, useEffect } from 'react'
import WorkCard from './WorkCard'
import "@styles/WorkList.css"
import { categories } from '@data'

const WorkList = ({ data, hideCategories }) => {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredData = selectedCategory === "All" ? data : data?.filter((work) => work.category === selectedCategory);
  const isEmpty = filteredData?.length === 0;

  return (
    <>
      {!hideCategories && (
        <div className="wrapper sticky top-[72px] flex flex-wrap gap-1 sm:gap-8 sm:mb-8 justify-center z-10 bg-white/50 backdrop-blur-md transition-all">
          {categories?.map((item, index) => (
            <p
              onClick={() => setSelectedCategory(item)}
              className={`${item === selectedCategory ? "selected" : "text-base-light sm:font-normal"} sm:text-heading4-bold p-2 cursor-pointer hover:bg-bg-1 rounded-lg border`}
              key={index}
            >
              {item}
            </p>
          ))}
        </div>
      )}

      {isEmpty ? (
        <div className="wrapper">
          <div className="data-none">
            <h4>No Design Found.</h4>
            <p>Come back later.</p>
          </div>
        </div>
      ) : (
        <div className="work-list">
          <ul>
            {filteredData?.map((work) => (
              <li key={work._id}>
                <WorkCard work={work} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {data?.length > 0 ? (
        <div className="work-list">
          <ul>
            {selectedCategory === "All" ? (
              data?.map((work) => (
                <li key={work._id}>
                  <WorkCard work={work} />
                </li>
              ))
            ) : (
              data?.filter((work) => work.category === selectedCategory)?.map((work) => (
                <li key={work._id}>
                  <WorkCard work={work} />
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <div className="wrapper">
          <div className="data-none">
            <h4>No Design Found.</h4>
            <p>Come back later.</p>
          </div>
        </div>
      )}  */}
    </>
  )
}

export default WorkList