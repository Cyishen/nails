"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ArrowForwardIos, Edit, FavoriteBorder, ArrowBackIosNew, ShoppingCart, Favorite } from "@mui/icons-material";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link'
import "@styles/WorkDetails.scss";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay, Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { convertToBase64 } from '@components/WorkCard';


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
  const isInCart = cart?.find((item) => item?.workId === id);

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
      } catch (err) {
        console.log(err);
      }
    } else {
      confirm("This item is already in your cart");
      return;
    }
  };

    return (
      <div className="work-details">
        <div className="title">
          <h1>{work.category}</h1>
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
              modules={[ Pagination, EffectFade ]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true }} 
              grabCursor={true}
              effect={'fade'}
              className="slider"
              style={{
                '--swiper-pagination-color': '#fff',
              }}
              onSwiper={setSwiper}
            >
              {work.workPhotos?.map((photo, index) => (
                <SwiperSlide key={index} className='slide'>    
                  <img src={convertToBase64(photo)} alt="work" />
                </SwiperSlide>
              ))}
          </Swiper>

          {work && work.workPhotos && (
            <div className="photos grid sm:grid-cols-2 lg:grid-cols-3">
              {work.workPhotos.slice(0, visiblePhotos).map((photo, index) => (
                <img 
                  src={convertToBase64(photo)} 
                  alt="work-demo" 
                  key={index} 
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}

              {visiblePhotos < work.workPhotos.length && (
                <div className="show-more" onClick={loadMorePhotos}>
                  <ArrowForwardIos sx={{ fontSize: "40px" }} />
                  Show More ({work.workPhotos.length})
                </div>
              )}
            </div>
          )}

          {/* <Swiper
              onSwiper={setThumbsSwiper}
              modules={[ Thumbs, FreeMode, Navigation ]}
              spaceBetween={10}
              slidesPerView={3}
              freeMode={true}
              watchSlidesProgress={true}
              className='photos'
            >
              {work && work.workPhotos && (
                <div>
                  {work.workPhotos.slice(0, visiblePhotos).map((photo, index) => (
                    <SwiperSlide key={index}>
                      <img src={convertToBase64(photo)} alt="work-demo" />
                    </SwiperSlide>
                  ))}

                  {visiblePhotos < work.workPhotos.length && (
                    <div className="show-more" onClick={loadMorePhotos}>
                      <ArrowForwardIos sx={{ fontSize: "40px" }} />
                      Show More
                    </div>
                  )}
                </div>
              )}
          </Swiper> */}
        </div>

        <hr />

        <div className="profile">
          <img 
            src={work.creator?.profileImage} 
            alt="profile" 
            onClick={() => router.push(`/shop/${work.creator?._id}`)}
          />
          <h3>設計師: {work.creator?.username}</h3>
        </div>
        
        <hr />

        <h1 className='mb-5'>{work.title}</h1>
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
            variant="contained" 
            endIcon={<ShoppingCart />} 
            type="submit"
            onClick={addToCart} 
            disabled={!userId}
          >
            加入購物車
          </Button>
        </div>
      </div>
    )
}

export default WorkDetails