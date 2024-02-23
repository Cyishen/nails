// // 這是卡片

// "use client";

// import { AddCircle, ArrowCircleLeft, Delete, RemoveCircle, ContactlessOutlined, LocalMallOutlined } from "@mui/icons-material";
// import IconButton from '@mui/material/IconButton';
// import Button from '@mui/material/Button';
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// import "@styles/Cart.scss";
// import getStripe from "@lib/getStripe";
// import toast from "react-hot-toast";


// const Cart = () => {
//   const { data: session, update } = useSession();
//   const cart = session?.user?.cart;
//   const userId = session?.user?._id;
//   const [localCart, setLocalCart] = useState([]);

//   // 在頁面加載時從本地存儲中獲取購物車數據
//   useEffect(() => {
//     const localCartData = JSON.parse(localStorage.getItem('cart')) || [];
//     setLocalCart(localCartData);
//   }, []);

//   // 在用戶登入後更新用戶的購物車數據
//   useEffect(() => {
//     if (userId && localCart.length > 0) {
//       updateCart(mergedCart);
//       // 更新用戶購物車後清空本地購物車數據
//       setLocalCart([]);
//       localStorage.removeItem('cart');
//     }
//   }, [userId, localCart]);

//   // 將本地購物車數據與用戶登錄後的購物車數據合併
//   const mergedCart = [...localCart, ...(session?.user?.cart || [])];

//   const updateCart = async (cart) => {
//     try {
//       const response = await fetch(`/api/users/${userId}/cart`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ cart }),
//       });
//       const data = await response.json();
//       update({ user: { cart: data } });
//     } catch (err) {
//       console.error('更新購物車數據時出錯：', err);
//     }
//   };

//   /* 計算 */
//   const calcSubtotal = (cart) => {
//     return cart?.reduce((total, item) => {
//       return total + item.quantity * item.price;
//     }, 0);
//   };

//   let subtotal;
//   if (!session) {
//     const localCart = JSON.parse(localStorage.getItem('cart')) || [];
//     subtotal = calcSubtotal(localCart);
//   } else {
//     subtotal = calcSubtotal(cart);
//   }

//   const updateUI = (newCart) => {  
//     newCart.forEach((item) => {
//       const quantityElement = document.getElementById(`quantity-number-${item.id}`);
//       const priceElement = document.getElementById(`price-number-${item.id}`);

//       if (quantityElement) {
//         quantityElement.textContent = item.quantity;
//       }
//       if (priceElement) { 
//         priceElement.textContent = (`$ ${item.quantity * item.price}`);
//       }

//       const subtotalElement = document.getElementById('subtotal');
//       if (subtotalElement) {
//         const newSubtotal = calcSubtotal(newCart);
//         subtotalElement.textContent = (`$ ${newSubtotal}`);
//       }
//     });
//   };

//   const increaseQty = (cartItem) => {
//     if (session) {
//       const newCart = cart?.map((item) => {
//         if (item === cartItem) {
//           item.quantity += 1;
//         }
//         return item;
//       });
//       updateCart(newCart);
//     } else {
//       const localCart = JSON.parse(localStorage.getItem('cart')) || [];
//       const newLocalCart = localCart.map((item) => {
//         if (item.id === cartItem.id) {
//           item.quantity += 1;
//         }
//         return item;
//       });
//       localStorage.setItem('cart', JSON.stringify(newLocalCart));
//       updateUI(newLocalCart)
//     }
//   };

//   const decreaseQty = (cartItem) => {
//     if (session) {
//       const newCart = cart?.map((item) => {
//         if (item === cartItem && item.quantity > 1) {
//           item.quantity -= 1;
//           return item;
//         } else return item;
//       });
//       updateCart(newCart);
//     } else {
//       const localCart = JSON.parse(localStorage.getItem('cart')) || [];
//       const newLocalCart = localCart.map((item) => {
//         if (item.id === cartItem.id && item.quantity > 1) {
//           item.quantity -= 1;
//         }
//         return item;
//       });
//       localStorage.setItem('cart', JSON.stringify(newLocalCart));
//       updateUI(newLocalCart)
//     }
//   };

//   /* 刪除 */
//   const removeFromCart = (cartItem) => {
//     if (window.confirm('要刪除此商品?')) {
//       if (session?.user) {
//         removeFromDatabase(cartItem);
//       } else {
//         removeFromLocalCart(cartItem);
//       }
//     }
//   };
  
//   // 從資料庫中刪除商品
//   const removeFromDatabase = async (cartItem) => {
//     try {
//       const newCart = cart.filter((item) => item.id !== cartItem.id);
//       await updateCart(newCart);
//       toast('移除商品成功!', {
//         icon: '🛍️',
//       });
//     } catch (error) {
//       console.error('刪除商品時出錯：', error);
//       toast.error('刪除商品失敗!');
//     }
//   };
  
//   // 從本地購物車中刪除商品
//   const removeFromLocalCart = (cartItem) => {
//     const newLocalCart = localCart.filter((item) => item.id !== cartItem.id);
//     setLocalCart(newLocalCart);
//     localStorage.setItem('cart', JSON.stringify(newLocalCart));
//     toast('移除商品成功!', {
//       icon: '🛍️',
//     });
//   };

//   /* CHECKOUT */
//   const handleCheckout = async () => {
//     if (!session) {
//       toast.error("請先登入");
//       return;
//     }
  
//     const stripe = await getStripe()

//     const response = await fetch("/api/stripe", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ cart, userId }),
//     })

//     if (response.statusCode === 500) {
//       return
//     }

//     const data = await response.json()

//     toast.loading("Redirecting to checkout...")

//     const result = stripe.redirectToCheckout({ sessionId: data.id })

//     if (result.error) {
//       console.log(result.error.message)
//       toast.error("Something went wrong")
//     }
//   }

//   const handleLinPay = async () => {
//     if (!session) {
//       toast.error("請先登入");
//       return;
//     }

//     try {
//       const response = await fetch("/api/line", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ cart, userId }),
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch");
//       }
  
//       const data = await response.json();

//       if (data.error) {
//         console.log(data.error.message);
//         toast.error("Something went wrong");
//       } else {
//         const url = data.info.paymentUrl.web;
//         window.location.href = url;
//         // console.log("Line Pay success:", data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <>
//       <div id="cart" className="cart">
//         <div className="details">
//           <div className="top">
//             <div className="top-cart-tittle">
//               <p><LocalMallOutlined /></p>
//               <h1>購物清單</h1>
//             </div>

//             <h2>
//               合計: <span id="subtotal">$ {subtotal}</span>
//             </h2>
//           </div>

//           {mergedCart?.length === 0 && <h4>Empty Cart</h4>}

//           {mergedCart?.length > 0 && (
//             <div className="all-items">
//               {mergedCart?.map((item, index) => (
//                 <div className="item" key={index}>
//                   <div className="item_info">
//                     <img src={item.image} alt="product" />
//                     <div className="text">
//                       <h3>{item.title}</h3>
//                       <p>類別: {item.category}</p>
//                       <p>設計師: {item.creator.username}</p>
//                     </div>
//                   </div>

//                   <div className="item-cost">
//                     <div className="quantity">
//                       <AddCircle
//                         onClick={() => increaseQty(item)}
//                         sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
//                         className="calculate-hover"
//                       />
//                       <h3 id={`quantity-number-${item.id}`}>{item.quantity}</h3>
//                       <RemoveCircle
//                         onClick={() => decreaseQty(item)}
//                         sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
//                         className="calculate-hover"
//                       />
//                     </div>

//                     <div className="price">
//                       <h2 id={`price-number-${item.id}`}>$ {item.quantity * item.price}</h2>
//                       <p>${item.price} / each</p>
//                     </div>

//                     <div className="remove">
//                       <IconButton
//                       type="button"
//                       aria-label="remove"
//                       size="small"
//                       color="error"  
//                       onClick={() => removeFromCart(item)}
//                       >
//                         <Delete sx={{ color: 'red' }}/>
//                       </IconButton>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <div className="bottom">
//                 <a href="/">
//                   <ArrowCircleLeft /> 再逛一下
//                 </a>

//                 <div className="bottom-pay">
//                   <Button
//                     variant="outlined"
//                     color="success"
//                     onClick={handleLinPay} 
//                   >
//                     <img src="/assets/line-pay.svg" width={60}/>
//                   </Button>
                  
//                   <Button
//                     variant="outlined"
//                     endIcon={<ContactlessOutlined />}
//                     onClick={handleCheckout} 
//                   >
//                     <img src="/assets/stripe.svg" width={40}/>
//                     付款
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };



// "use client"

// import React, { useEffect, useState } from 'react'
// import { ArrowForwardIos, Edit, FavoriteBorder, LocalMallOutlined, Favorite } from "@mui/icons-material";
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';

// import { useRouter } from 'next/navigation';
// import { useSession } from "next-auth/react";
// import Link from 'next/link'
// import Image from 'next/image'
// import toast from "react-hot-toast";
// import "@styles/WorkDetails.scss";

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, EffectFade, Autoplay, Navigation, Thumbs, FreeMode } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';
// import 'swiper/css/thumbs';
// import 'swiper/css/free-mode';


// const WorkDetails = ( { params } ) => {
//   const [work, setWork] = useState({});
//   const router = useRouter();

//   const { data: session, update } = useSession();
//   const userId = session?.user?._id;

//   const { id } = params;

//   useEffect(() => {
//     const getWorkDetails = async () => {
//       if (id) {
//         const response = await fetch(`/api/work/${id}`, {
//           method: "GET",
//         });
//         const data = await response.json();
//         setWork(data);
//       }
//     };

//     getWorkDetails();
//   }, [id]);
//   // console.log("Work details:", work);

//   /* SHOW MORE PHOTOS */
//   const [visiblePhotos, setVisiblePhotos] = useState(4);

//   const loadMorePhotos = () => {
//     setVisiblePhotos(work.workPhotos.length);
//   };

//   /* SELECT PHOTO TO SHOW */
//   const [swiper, setSwiper] = useState(null);
//   const handleThumbnailClick = (index) => {
//     if (swiper) {
//       swiper.slideTo(index); 
//     }
//   };

//   /* ADD TO WISHLIST */
//   const favorites = session?.user?.favorites;
//   const isLiked = favorites?.find((item) => item?._id === work._id);

//   const patchLike = async () => {
//     if (!userId) {
//       toast.error('先登入~加入妳的喜愛 ❤️')
//       return;
//     }
//     const response = await fetch(`api/users/${userId}/favorite/${work._id}`, {
//       method: "PATCH",
//     });
//     const data = await response.json();
//     update({ user: { favorites: data.favorites } })
//   };

//   /* ADD TO CART */
//   const addToCart = async () => {
//     const newCartItem = {
//       id,
//       image: work.workPhotos[0],
//       title: work.title,
//       category: work.category,
//       creator: work.creator,
//       price: work.price,
//       quantity: 1,
//     };
  
//     if (!session) {
//       // 用戶未登入，新商品添加到本地購物車
//       let localCart = JSON.parse(localStorage.getItem('cart')) || [];
//       const isInLocalCart = localCart.find((item) => item.id === id);
  
//       if (!isInLocalCart) {
//         localCart = [...localCart, newCartItem];
//         localStorage.setItem('cart', JSON.stringify(localCart));
//         toast.success(' 🛍️ 已加入商品!');
//       } else {
//         toast.error('商品已經存在!');
//         return;
//       }
//     } else {
//       let userCart = session?.user?.cart || [];
  
//       // 將新商品添加到用戶購物車
//       const isInUserCart = userCart.find((item) => item.id === id);

//       if (!isInUserCart) {
//         userCart = [...userCart, newCartItem];
        
//         try {
//           await fetch(`/api/users/${userId}/cart`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ cart: userCart }),
//           });
//           update({ user: { ...session?.user, cart: userCart } });
//           toast.success(' 🛍️ 已加入商品!');
//         } catch (err) {
//           console.error(err);
//         }
//       } else {
//         toast.error('商品已經存在!');
//         return;
//       }
//     }
//   };
  
//   // const cart = session?.user?.cart;
//   // const isInCart = cart?.find((item) => item?.id === id);

//   // const addToCart = async () => {
//   //   const newCartItem = {
//   //     id,
//   //     image: work.workPhotos[0],
//   //     title: work.title,
//   //     category: work.category,
//   //     creator: work.creator,
//   //     price: work.price,
//   //     quantity: 1,
//   //   };

//   //   if (!isInCart) {
//   //     const newCart = [...cart, newCartItem];

//   //     try {
//   //       await fetch(`/api/users/${userId}/cart`, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ cart: newCart }),
//   //       });
//   //       update({ user: { cart: newCart } });
//   //       toast.success(' 🛒 已加入商品!')
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   } else {
//   //     toast.error('This item is already in your cart!')
//   //     return;
//   //   }
//   // };
  
//     return (
//       <div className="work-details">
//         <div className="title">
//           <h1 className="border">{work.category}</h1>
//           {work.creator?._id === userId ? (
//             <div className='like'>
//               <span>Edit</span>
//               <Link href={`/works/${id}/update`}>
//                 <IconButton
//                   type="button"
//                   aria-label="edit"
//                   size="small"
//                   color="primary"  
//                 >
//                   <Edit />
//                 </IconButton>
//               </Link>
//             </div>
//           ) : (
//             <div className="like">
//               <span>Like</span>
//               <IconButton
//                 type="button"
//                 aria-label="like" 
//                 size="small"
//                 color="error"
//                 onClick={patchLike}
//               >
//                 {isLiked ? (
//                   <Favorite />
//                 ) : (
//                   <FavoriteBorder />
//                 )}
//               </IconButton>
//             </div>
//           )}
//         </div>

//         <div className="slider-container">
//           <Swiper
//               modules={[ Pagination ]}
//               spaceBetween={50}
//               slidesPerView={1}
//               pagination={{ clickable: true }} 
//               grabCursor={true}
//               style={{
//                 '--swiper-pagination-color': '#fff',
//               }}
              
//               className="slider"
//               onSwiper={setSwiper}
//             >
//               {work.workPhotos?.map((photo, index) => (
//                 <SwiperSlide key={index} className='slide'>    
//                   <img src={photo} alt="work" />
//                 </SwiperSlide>
//               ))}
//           </Swiper>

//           {work && work.workPhotos && (
//             <div className="photos grid sm:grid-cols-2 lg:grid-cols-3">
//               {work.workPhotos.slice(0, visiblePhotos).map((photo, index) => (
//                 <img 
//                   src={photo} 
//                   alt="work-demo" 
//                   key={index} 
//                   onClick={() => handleThumbnailClick(index)}
//                 />
//               ))}

//               {visiblePhotos < work.workPhotos.length && (
//                 <div className="show-more" onClick={loadMorePhotos}>
//                   <ArrowForwardIos sx={{ fontSize: "40px" }} />
//                   <p>Show More ({work.workPhotos?.length})</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <hr />

//         <div className="profile">
//           <div className="profile-shop" >
//             <Image 
//               src={work.creator?.profileImage || "/assets/person.jpg"} 
//               alt="profile" 
//               width={60} 
//               height={60}
//             />
//             <div className='profile-info'>
//               <div className="profile-name">
//                 <p>設計師</p>
//                 <h3>{work.creator?.username}</h3>
//               </div>

//               <h2 onClick={() => router.push(`/shop/${work.creator?._id}`)} className='border rounded-lg'>
//                 逛逛我的設計
//               </h2>
//             </div>
//           </div>
//         </div>
        
//         <hr />

//         <h3 className='mb-5'>{work.title}</h3>
//         <div className='work-content'>
//           {work.description?.split('\n').map((line, index) => (
//             <div key={index}>
//               {line.trim() !== '' ? line : '\u00A0'}
//             </div>
//           ))}
//         </div>
        
//         <div className="add">
//           <h1 className="price">${work.price}</h1>
//           <Button 
//             variant="outlined" 
//             endIcon={<LocalMallOutlined />} 
//             type="submit"
//             onClick={addToCart} 
//             // disabled={!userId}
//           >
//             加入商品
//           </Button>
//         </div>
//       </div>
//     )
// }
