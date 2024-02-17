import React from 'react'
import WorkCard from './WorkCard'
import "@styles/WorkList.css"

const WorkList = ({ data }) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="work-list">
          <ul>
            {data.map((work) => {
              return (
                <li key={work._id}>
                  <WorkCard work={work} />
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="wrapper data-none">
          <h4>No Design Found.</h4>
          <p>Come back later.</p>
        </div>
      )} 
    </>
  )
}

export default WorkList