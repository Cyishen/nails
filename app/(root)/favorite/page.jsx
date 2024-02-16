"use client";

import WorkList from "@components/WorkList";
import "@styles/Favorite.scss";
import { useSession } from "next-auth/react";

const Favorite = () => {
  const { data: session } = useSession();
  const favorites = session?.user?.favorites;

  return (
    <>
      <h1 className="title-list">
        收藏妳感興趣的
      </h1>

      {favorites && favorites.length > 0 ? (
        <WorkList data={favorites} />
      ) : (
        <p className="favorite-word">收藏喜歡的風格</p>
      )}
    </>
  )
}

export default Favorite