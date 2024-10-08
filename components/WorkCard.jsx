import { Delete, Favorite, FavoriteBorder } from "@mui/icons-material";
import "@styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import Link from 'next/link'
import Image from 'next/image'
import toast from "react-hot-toast";

// export const convertToBase64 = (photo) => {
//   if (photo?.contentType && photo?.data) {
//     return `data:${photo.contentType};base64,${Buffer.from(photo.data).toString('base64')}`;
//   } else {
//     return '';
//   }
// };

const WorkCard = ({ work }) => {
  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("要刪除此商品?");
    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  /* ADD TO WISHLIST */
  const favorites = session?.user?.favorites;
  const isLiked = favorites?.find((item) => item?._id === work._id);

  const patchLike = async () => {
    if (!userId) {
      toast.error('先登入~加入妳的喜愛 ❤️')
      return;
    }
    const response = await fetch(`api/users/${userId}/favorite/${work._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { favorites: data.favorites } })
  };

  return (
    <div className="work-card">
      <div className="slider-container">
        <div className="slider">
          {work.workPhotos && (
            <Link href={`/works/${work._id}`} className="slide">
              <Image src={work.workPhotos[0]} alt="work" fill/>
            </Link>
          )}
        </div>
      </div>


      <div className="info">
        <div className="info-title">
          <div className="cate">{work.category}</div>
          <div className="price">${work.price}</div>
        </div>

        <h3>{work.title}</h3>

        <div className="creator">
          <div className="creator-img">
            <div>
              <Image 
                src={work.creator?.profileImage || "/assets/person.jpg"} 
                alt="creator"
                width={50}
                height={50}
              />
            </div>
          </div>
          
          <div className="creator-name">
            <p>設計師</p>
            <span>{work.creator?.username}</span>
          </div>
        </div>
      </div>

      {userId === work.creator?._id ? (
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
        <div className="icon" onClick={(e) => { e.stopPropagation(); patchLike(); }} >
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
