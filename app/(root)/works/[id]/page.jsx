"use client"

import React, { useEffect, useState } from 'react'
import { ArrowForwardIos, Edit, FavoriteBorder, ShoppingCart, Favorite } from "@mui/icons-material";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link'
import toast from "react-hot-toast";
import "@styles/WorkDetails.scss";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay, Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';


const WorkDetails = ( { params } ) => {
  const [work, setWork] = useState({});
  const router = useRouter();

  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  const { id } = params;

  useEffect(() => {
    const getWorkDetails = async () => {
      if (id) {
        const response = await fetch(`/api/work/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        setWork(data);
      }
    };

    getWorkDetails();
  }, [id]);
  // console.log("Work details:", work);

  /* SHOW MORE PHOTOS */
  const [visiblePhotos, setVisiblePhotos] = useState(4);

  const loadMorePhotos = () => {
    setVisiblePhotos(work.workPhotos.length);
  };

  /* SELECT PHOTO TO SHOW */
  const [swiper, setSwiper] = useState(null);
  const handleThumbnailClick = (index) => {
    if (swiper) {
      swiper.slideTo(index); 
    }
  };

  /* ADD TO WISHLIST */
  const favorites = session?.user?.favorites;
  const isLiked = favorites?.find((item) => item?._id === work._id);

  const patchLike = async () => {
    if (!userId) {
      confirm('Login to add you like')
      return;
    }
    const response = await fetch(`api/users/${userId}/favorite/${work._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { favorites: data.favorites } })
  };

  /* ADD TO CART */
  const cart = session?.user?.cart;
  const isInCart = cart?.find((item) => item?.id === id);

  const addToCart = async () => {
    const newCartItem = {
      id,
      image: work.workPhotos[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if (!isInCart) {
      const newCart = [...cart, newCartItem];

      try {
        await fetch(`/api/users/${userId}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: newCart }),
        });
        update({ user: { cart: newCart } });
        toast.success(' 🛒 已加入商品!')
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error('This item is already in your cart!')
      return;
    }
  };
  
    return (
      <div className="work-details">
        <div className="title">
          <h1 className="border">{work.category}</h1>
          {work.creator?._id === userId ? (
            <div className='like'>
              <span>Edit</span>
              <Link href={`/works/${id}/update`}>
                <IconButton
                  type="button"
                  aria-label="edit"
                  size="small"
                  color="primary"  
                >
                  <Edit />
                </IconButton>
              </Link>
            </div>
          ) : (
            <div className="like">
              <span>Like</span>
              <IconButton
                type="button"
                aria-label="like" 
                size="small"
                color="error"
                onClick={patchLike}
              >
                {isLiked ? (
                  <Favorite />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </div>
          )}
        </div>

        <div className="slider-container">
          <Swiper
              modules={[ Pagination ]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true }} 
              grabCursor={true}
              style={{
                '--swiper-pagination-color': '#fff',
              }}
              
              className="slider"
              onSwiper={setSwiper}
            >
              {work.workPhotos?.map((photo, index) => (
                <SwiperSlide key={index} className='slide'>    
                  <img src={photo} alt="work" />
                </SwiperSlide>
              ))}
          </Swiper>

          {work && work.workPhotos && (
            <div className="photos grid sm:grid-cols-2 lg:grid-cols-3">
              {work.workPhotos.slice(0, visiblePhotos).map((photo, index) => (
                <img 
                  src={photo} 
                  alt="work-demo" 
                  key={index} 
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}

              {visiblePhotos < work.workPhotos.length && (
                <div className="show-more" onClick={loadMorePhotos}>
                  <ArrowForwardIos sx={{ fontSize: "40px" }} />
                  <p>Show More ({work.workPhotos?.length})</p>
                </div>
              )}
            </div>
          )}
        </div>

        <hr />

        <div className="profile">
          <div className="profile-shop" >
            <img src={work.creator?.profileImage} alt="profile" />

            <div className='profile-info'>
              <div className="profile-name">
                <p>設計師</p>
                <h3>{work.creator?.username}</h3>
              </div>

              <h2 onClick={() => router.push(`/shop/${work.creator?._id}`)} className='border rounded-lg'>
                逛逛我的設計
              </h2>
            </div>
          </div>
        </div>
        
        <hr />

        <h3 className='mb-5'>{work.title}</h3>
        <div className='work-content'>
          {work.description?.split('\n').map((line, index) => (
            <div key={index}>
              {line.trim() !== '' ? line : '\u00A0'}
            </div>
          ))}
        </div>
        
        <div className="add">
          <h1 className="price">${work.price}</h1>
          <Button 
            variant="outlined" 
            endIcon={<ShoppingCart />} 
            type="submit"
            onClick={addToCart} 
            disabled={!userId}
          >
            加入購物籃
          </Button>
        </div>
      </div>
    )
}

export default WorkDetails