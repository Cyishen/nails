"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Form from '@components/Form'


const CreateWork = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const [work, setWork] = useState({
    creator: "",
    category: "",
    title: "",
    description: "",
    price: "",
    photos: []
  })

  if (session) {
    work.creator = session?.user?._id
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const newWorkForm = new FormData()

      for (var key in work) {
        newWorkForm.append(key, work[key])
      }

      work.photos.forEach((photo) => {
        newWorkForm.append("workPhotos", photo)
      })

      const response = await fetch("/api/work/new", {
        method: "POST",
        body: newWorkForm
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
        type="Create"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
  )
}

export default CreateWork