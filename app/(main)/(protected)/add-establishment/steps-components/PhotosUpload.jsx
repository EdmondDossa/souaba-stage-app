"use client";

import { ImagePlus, X } from "lucide-react";
import { handlePhotoUpload } from "@/utils";
import { Label } from "../ui";
import { useState } from "react";
import Image from "next/image";

const PhotosUpload = ({ displayPhotos,onPhotosChange }) => {
  //upload states
  const [previewPhotos, setPreviewPhotos] = useState(displayPhotos || []);
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const [uploadError, setUploadError] = useState("");

  return (
      <div className="w-full md:w-1/2">
        <Label id={"photos"} displayName="Photos" />
        <p className="empty:hidden text-danger text-sm"> {uploadError} </p>
        <div className="p-4 flex flex-col  border border-gray-200 rounded-lg">
          <label htmlFor="photos" className="block hover:bg-gray-100 p-5">
            <span className="cursor-pointer font-montserrat-bold flex flex-col items-center justify-center">
              <ImagePlus className="w-14 h-14 mb-4" />
              Ajouter des photos
            </span>
            <input
              onChange={handleFileChange}
              type="file"
              className="hidden"
              id="photos"
              accept="image/*"
              multiple
            />
          </label>
          {/* for choosen images */}
          {previewPhotos.length > 0 ? (
            <ul className="h-1/2 flex flex-wrap gap-2 overflow-y-auto  mt-5 p-1">
              {previewPhotos.map((preview, index) => {
                return (
                  <li
                    key={`${preview.file.filename}-${index}`}
                    className="w-[100px] h-[60px] border border-gray-200 relative group"
                  >
                    <Image
                      className="w-full h-full object-cover"
                      width={120}
                      height={120}
                      src={preview.url}
                      alt=""
                    />
                    <span
                      onClick={() =>
                        removeUploadedPhoto(`${preview.file.filename}-${index}`)
                      }
                      className="z-10 absolute top-0 right-0 w-4 h-4 text-white bg-red-500 rounded-sm group-hover:flex hidden  flex-col justify-center items-center m-1 transition cursor-pointer"
                    >
                      {" "}
                      <X className="w-3 h-3" />{" "}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center text-[10px] m-4 font-sans">
              Aucune photo ajoutée pour le moment
            </p>
          )}
        </div>
      </div>
  );

  function removeUploadedPhoto(key) {
    const filteredResults = previewPhotos.filter(
      (preview, index) => `${preview.file.filename}-${index}` !== key
    );
    setPreviewPhotos(filteredResults);
    onPhotosChange(filteredResults);
  }

  function handleFileChange(e) {
    const { fileError, media, message } = handlePhotoUpload(
      e.target.files,
      allowedExtensions
    );
    if (fileError) {
      setUploadError(message);
    } else setUploadError("");
    setPreviewPhotos([...previewPhotos, ...media]);
    onPhotosChange([...previewPhotos, ...media]);
  }
};

export default PhotosUpload;
