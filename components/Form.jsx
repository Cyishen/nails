import { categories } from "@data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import Button from '@mui/material/Button';

import "@styles/WorkForm.css"

const Form = ({ type, work, setWork, handleSubmit }) => {
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: [...prevWork.photos, ...newPhotos],
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
      <h1 className="mb-7">{type} Your Work</h1>

      <form onSubmit={handleSubmit} className="work-form">
        <h3>Which of these categories best describes your work?</h3>
        <div className="work-category-list">
          {categories?.map((item, index) => (
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

        <h3>Add some photos of your work</h3>
        {work.photos.length < 1 && (
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

        {work.photos.length > 0 && (
          <div className="photos">
            {work?.photos?.map((photo, index) => (
              <div key={index} className="photo">
                {photo instanceof Object ? (
                  <img src={URL.createObjectURL(photo)} alt="work" className="w-full h-full" />
                ) : (
                  <img src={photo} alt="work" />
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
        )}

        <h3>What make your Work attractive?</h3>
        <div className="description">
          <p className="mt-5 mb-3">Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={work.title}
            required
            className="border px-4 py-4 rounded-lg focus:outline-none w-full"
          />

          <p className="mt-5 mb-3">Description</p>
          <textarea
            type="text"
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
            className="border px-4 py-4 rounded-lg focus:outline-none w-full"
          />

          <p className="mt-5 mb-3">Now, Set your price</p>
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

        <Button variant="contained" color="success" className="submit_btn mt-10 bg-pink-1" type="submit">PUBLISH YOUR WORK</Button>
      </form>
    </div>
  );
};

export default Form;
