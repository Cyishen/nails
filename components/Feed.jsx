"use client";

import { categories } from "@data";
import { useEffect, useState } from "react";

import WorkList from "./WorkList";
import Loader from "./Loader";


const Feed = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("全部");

  const [workList, setWorkList] = useState([]);

  // const getWorkList = async () => {
  //   const response = await fetch(`/api/work/list/${selectedCategory}`);
  //   const data = await response.json();
  //   setWorkList(data);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   getWorkList();
  // }, [selectedCategory]);

  return (
    <>
      <div className="wrapper sticky top-[72px] flex flex-wrap sm:gap-8 my-8 justify-center">
        {categories?.map((item, index) => (
          <p
            onClick={() => setSelectedCategory(item)}
            className={`${item === selectedCategory ? "selected" : ""} p-1 cursor-pointer hover:bg-[#F6F6F6] rounded-lg`}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>
      
      {loading ? (
        <Loader />
      ):(
        <WorkList data={workList} />
      )}
    </>
  );
};

export default Feed;
