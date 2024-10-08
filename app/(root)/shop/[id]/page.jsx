"use client";


import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import WorkList from "@components/WorkList";
import Button from '@mui/material/Button';
import Image from 'next/image'

import "@styles/Shop.scss"

const Shop = ( { params } ) => {
  const { id } = params;

  const { data: session } = useSession();
  const loggedInUserId = session?.user?._id;

  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getShopWorkList = async () => {
      const response = await fetch(`/api/users/${id}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWorkList(data.workList);
      setProfile(data.user);
    };

    if (id) {
      getShopWorkList();
    }
  }, [id]);

  return (
    <>
      <div className="title">
        <div className="title-list">
          <Image 
            src={profile.profileImage || "/assets/person.jpg"} 
            alt="profile" 
            width={140}
            height={140}
          />
          <div className="title-name">
            <h1>{loggedInUserId === id ? "Your" : profile.username}</h1>
            <h2><span>|</span>作品</h2>
          </div>
        </div>
      </div>
      
      <div className="shop-focus">
        <h3>101 <span>關注</span></h3>
        <h3>101 <span>粉絲</span></h3>
        {loggedInUserId !== id && (
          <Button variant="outlined" color="secondary">追蹤</Button>
        )}
      </div>

      <div className="shop-info">
        <h3>預約：123-123-123</h3>
        <h3>地址：台北市信義區</h3>
      </div>

      <WorkList data={workList}/>
    </>
  );
};

export default Shop;
