"use client";
import useAuthContext from "@/context/auth";
import defaultProfilImage from "@/public/images/profile/default-avatar-icon.jpg";
import Image from "next/image";
import { IoCamera } from "react-icons/io5";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaPenAlt } from "react-icons/fa";
import { useState } from "react";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";
import { handlePhotoUpload } from "@/utils";
import toast from "react-hot-toast";
import getAxiosInstance from "@/lib/request";

const Profiles = () => {
  const http = getAxiosInstance();

  const { user, fetchUser } = useAuthContext();
  console.log(user);
  
  const [isEditing, setEditing] = useState(false);

  const initEdit = () => setEditing(true);
  const onEditCancel = () => setEditing(false);

  async function updateProfilePicture(e) {
    try {
      const { fileError, media, message } = handlePhotoUpload(e.target.files);
      if (fileError) return toast.error(message);
      //upload the media first
      const file = new FormData();
      file.append("file", media[0].file);
      file.append("mediaType","IMAGE");
      const { data } = await http.post("/uploads/single/", file);
      console.log(data);
      await http.patch("/users/profile", { photo: data.filename });
      await fetchUser(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-5xl h-[520px]  min-w-4xl mx-auto mt-10 border border-gray-100">
      <section className="flex justify-between gap-x-15 h-full">
        {/* Barre de profile */}
        <aside className="bg-[#EFF0F2] w-4/12 py-10 flex flex-col items-center justify-between">
          {/* Photo user */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-36 h-36 shadow-xl rounded-full">
              <Image
                className=" h-full w-full rounded-full"
                src={user.picture || defaultProfilImage}
                alt=""
              />
            </div>
            <div>
              <label
                htmlFor="photo"
                className="flex items-center shadow-lg bg-white rounded-3xl px-3 py-2 font-montserrat-medium text-sm space-x-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <IoCamera className="w-6 h-6 me-2" /> Changer la photo
              </label>
              <input
                onChange={updateProfilePicture}
                type="file"
                className="hidden"
                id="photo"
                accept="image/*"
                name="photo"
              />
            </div>
            <div>
              <h1 className="font-bold font-montserrat-bold text-lg">
                {" "}
                {user.firstName}{" "}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={initEdit}
                className="bg-primary w-8 h-8 rounded-full place-content-center"
              >
                {" "}
                <FaPenAlt className="w-4 h-5 text-white mx-auto" />{" "}
              </button>
            </div>
          </div>
          <div className="flex mb-12 items-center font-montserrat-bold">
            <BsPatchCheckFill className="w-6 h-6 me-4 text-emerald-700" />{" "}
            Certifié
          </div>
        </aside>
        <section className="py-10 px-5 flex-grow">
          {isEditing ? (
            <EditProfile onEditCancel={onEditCancel} />
          ) : (
            <ViewProfile initEdit={initEdit} />
          )}
        </section>
      </section>
    </div>
  );
};

export default Profiles;
