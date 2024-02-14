"use client";

import React, { useEffect, useState } from "react";
import Form from "@components/Form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UpdateWork = ( {params} ) => {
  const { id } = params;
  const { data: session } = useSession();

  const router = useRouter();

  const [work, setWork] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  })

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`/api/work/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setWork({
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        photos: data.workPhotos,
      });
    };

    if (id) {
      getWorkDetails();
    }

  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updateFormWork = new FormData()

      for (var key in work) {
        updateFormWork.append(key, work[key])
      }

      work.photos.forEach((photo) => {
        updateFormWork.append("workPhotos", photo)
      })

      const response = await fetch(`/api/work/${id}`, {
        method: "PATCH",
        body: updateFormWork
      })

      if (response.ok) {
        router.push("/")
      }
    } catch (err) {
      console.log("Publish Work failed", err.message)
    }
  }


  return (
    <Form
      type="Edit"
      work={work}
      setWork={setWork}
      handleSubmit={handleSubmit}
    />
  );
};

export default UpdateWork;
