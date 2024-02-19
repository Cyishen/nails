"use client";

import { categories } from "@data";
import { useEffect, useState } from "react";

import WorkList from "./WorkList";
import Loader from "./Loader";
import SearchBox from "./Search";


const Feed = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("全部");

  const [workList, setWorkList] = useState([]);

  const getWorkList = async () => {
    const response = await fetch(`/api/work/list/${selectedCategory}`);
    const data = await response.json();
    setWorkList(data);
    setLoading(false);
  };

  useEffect(() => {
    getWorkList();
  }, [selectedCategory]);

  return (
    <>
      <div className="wrapper sticky top-[72px] flex flex-wrap gap-1 sm:gap-8 sm:mb-8 justify-center z-10 bg-white backdrop-blur-md opacity-80">
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

      <div className="px-5"> 
        <SearchBox />
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
