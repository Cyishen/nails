"use client";


import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setValue('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">編輯個人資料</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full object-cover"
          />
          {/* <div className="flex flex-col gap-3">
            <label htmlFor="profileImage" className="text-body-bold cursor-pointer flex flex-col items-center" >
              Upload new photo
              <img src="/assets/upload.svg" alt="upload" width={50} height={50} />
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              />
          </div> */}
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="pynmmnkw"
          >
            <div className="flex flex-col items-center gap-3">
              <p className="text-body-bold">上傳個人圖像</p>
              <img src="/assets/upload.svg" alt="upload" width={50} height={50}/>
            </div>
          </CldUploadButton>
        </div>

        <button className="btn" type="submit">
          儲存
        </button>
      </form>
    </div>
  );
};

export default Profile;
