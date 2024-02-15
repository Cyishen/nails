import { categories } from "@data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import Button from '@mui/material/Button';

import "@styles/WorkForm.css"
import { convertToBase64 } from "./WorkCard";
import { CldUploadButton } from "next-cloudinary";

const Form = ({ type, work, setWork, handleSubmit }) => {
  
  const handleUploadPhotos = (result) => {
    const newPhotos = result?.info?.secure_url;
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: [...prevWork.photos, newPhotos],
      };
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      };
    });
  };

  return (
    <div className="work-form-container">
      <h1 className="mb-7">{type} 妳的設計</h1>

      <form onSubmit={handleSubmit} className="work-form">
        <h3>哪個類型接近妳的設計?</h3>
        <div className="work-category-list">
          {categories?.slice(1).map((item, index) => (
            <p
              key={index}
              className={`${work.category === item ? "selected" : ""} work-category-single`}
              onClick={() => {
                setWork({ ...work, category: item });
              }}
            >
              {item}
            </p>
          ))}
        </div>

        <h3>加入圖片～吸引更多人吧</h3>
        <div className="photos">
          {work?.photos?.map((photo, index) => (
            <div key={index} className="photo">
              <img src={photo} alt="work" className="w-full h-full" />
              <button type="button" onClick={() => handleRemovePhoto(index)} className="upload-delete">
                <BiTrash />
              </button>
            </div>
          ))}
          
          <CldUploadButton
            options={{ maxFiles: 10 }}
            onUpload={handleUploadPhotos} 
            uploadPreset="pynmmnkw" 
            className="upload-label"
          >
            <div className="text-[60px]">
              <IoIosImages />
            </div>
            <p>Upload from your device</p>
          </CldUploadButton>
        </div>
        {/* {work.photos?.length < 1 && (
          <div className="photos">
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="upload-label">
              <div className="text-[60px]">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        {work.photos?.length > 0 && (
          <div className="photos">
            {work?.photos?.map((photo, index) => (
              <div key={index} className="photo">
                {photo instanceof Object ? ( 
                  type === "Create" ? (
                    <img src={URL.createObjectURL(photo)} alt="work" className="w-full h-full" />
                  ) : (
                    <img src={convertToBase64(photo)} alt="work" className="w-full h-full" />
                  )
                ) : (
                  <img src={convertToBase64(photo)} alt="work" className="w-full h-full" />
                )}
                <button type="button" onClick={() => handleRemovePhoto(index)} className="upload-delete">
                  <BiTrash />
                </button>
              </div>
            ))}
            
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="upload-label">
              <div className="text-[60px]">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )} */}

        <h3>詳細資訊</h3>
        <div className="description">
          <p className="mt-5 mb-3">標題</p>
          <input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={work.title}
            required
            className="border px-4 py-4 rounded-lg focus:outline-none w-full"
          />

          <p className="mt-5 mb-3">描敘</p>
          <textarea
            type="text"
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
            className="border px-4 py-4 rounded-lg focus:outline-none w-full"
          />

          <p className="mt-5 mb-3">價格</p>
          <span className="font-semibold mr-5">$</span>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            name="price"
            value={work.price}
            required
            className="price w-[200px] border px-4 py-4 rounded-lg focus:outline-none"
          />
        </div>

        <Button variant="contained" color="success" className="submit_btn mt-10 bg-pink-1" type="submit">建立作品</Button>
      </form>
    </div>
  );
};

export default Form;
