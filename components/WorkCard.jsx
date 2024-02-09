import { Delete, Favorite, FavoriteBorder } from "@mui/icons-material";
import "@styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const convertToBase64 = (photo) => {
  return `data:${photo.contentType};base64,${Buffer.from(photo.data).toString('base64')}`;
};

const WorkCard = ({ work }) => {

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");
    if (hasConfirmed) {
      try {
        await fetch(`api/work/${work._id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const router = useRouter();
  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  /* ADD TO WISHLIST */
  const wishlist = session?.user?.wishlist;
  const isLiked = wishlist?.find((item) => item?._id === work._id);

  const patchWishlist = async () => {
    const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } })
  };

  return (
    <div className="work-card">
      <div className="slider-container">
        <div className="slider">
        {/* //TODO* single photo */}
          {work.workPhotos && (
            <div className="slide">
              <img src={convertToBase64(work.workPhotos[0])} alt="work" />
            </div>
          )}
        </div>

        {/* //TODO? map all photo */}
        {/* <Swiper
          modules={[ Pagination, EffectFade, Autoplay ]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }} 
          loop={true}
          grabCursor={true}
          effect={'fade'}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="slider"
        >
          {work.workPhotos?.map((photo, index) => (
            <SwiperSlide key={index}>
              <div className="slide">
                <img src={convertToBase64(photo)} alt="work" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}
      </div>


      <div className="info">
        <div className="info-title">
          <div className="cate">{work.category}</div>
          <div className="price">${work.price}</div>
        </div>

        <h3>{work.title}</h3>

        <div className="creator">
          <img 
            src={work.creator.profileImage} 
            alt="creator"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/shop?id=${work.creator._id}`)
            }} 
          />
          <span>{work.creator.username}</span>
        </div>
      </div>

      {userId === work?.creator._id ? (
        <div className="icon" onClick={(e) => { e.stopPropagation(); handleDelete(); }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      ) : (
        <div className="icon" onClick={(e) => { e.stopPropagation(); patchWishlist(); }} >
          {isLiked ? (
            <Favorite
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                color: "red",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                opacity: 0.5,
                padding: "5px",
                fontSize: "30px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCard;
