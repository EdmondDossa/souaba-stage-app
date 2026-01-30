"use client";
import useAuthContext from "@/context/auth";
import defaultProfilImage from "@/public/images/profile/default-avatar-icon.jpg";
import { IoCamera } from "react-icons/io5";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaPenAlt } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";
import { handlePhotoUpload } from "@/utils";
import toast from "react-hot-toast";
import getAxiosInstance from "@/lib/request";
import { PencilLine } from "lucide-react";
import { IoStar as Star } from "react-icons/io5";

const Profiles = () => {
  const http = getAxiosInstance();

  const { user, fetchUser } = useAuthContext();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const profilePhotoSrc = (() => {
    const photo = user?.profile?.photo || user?.photo;
    if (typeof photo === "string") {
      return photo.startsWith("http") ? photo : `${apiBase}/${photo}`;
    }
    if (photo?.url) {
      return photo.url.startsWith("http")
        ? photo.url
        : `${apiBase}/${photo.url}`;
    }
    return defaultProfilImage?.src || defaultProfilImage;
  })();

  const [isEditing, setEditing] = useState(false);

  const initEdit = () => setEditing(true);
  const onEditCancel = () => {
    setEditing(false);
    window.scrollTo({ top: 0 });
  };

  async function updateProfilePicture(e) {
    try {
      const { fileError, media, message } = handlePhotoUpload(e.target.files);
      if (fileError) return toast.error(message);
      if (!media?.length) return;
      //upload the media first
      const file = new FormData();
      file.append("photo", media[0].file);
      file.append("mediaType", "IMAGE");
      // const { data } = await http.post("/uploads/multiple/", file);
      await http.patch("/users/profile", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUser(false);
      e.target.value = "";
      toast.success("Votre photo de profil a été mise à jour");
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue!");
    }
  }

  return (
    <div className="lg:max-w-5xl lg:min-h-[520px] lg:min-w-4xl lg:border border-gray-100 mx-auto mt-10 pb-10">
      <section className="flex flex-col items-stretch lg:flex-row gap-x-15 h-full">
        {/* Barre de profile */}
        <aside className="lg:bg-[#EFF0F2] h-full w-full lg:w-4/12 py-10 flex flex-col items-center justify-between lg:rounded-l-2xl">
          {/* Photo user */}
          <h1 className="font-montserrat-bold text-[20px] my-4 text-gray-800">
            Mon Profil
          </h1>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-36 h-36 shadow-xl rounded-full bg-gray-100">
              <Image
                src={profilePhotoSrc}
                alt=""
                fill
                sizes="144px"
                className="rounded-full object-cover"
              />
              <button
                onClick={initEdit}
                className="absolute flex flex-col items-center justify-center text-white bg-primary right-0 bottom-0  w-8 h-8 rounded-full border-2 border-white"
              >
                <PencilLine size={20} strokeWidth={3} />
              </button>
            </div>
            <h1 className="block lg:hidden font-montserrat-bold text-gray-800 text-md whitespace-nowrap">
              {" "}
              {user.firstName + " " + user.lastName}{" "}
            </h1>
            <div className="hidden lg:block">
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
            <div className="hidden lg:block">
              <h1 className="font-bold font-montserrat-bold text-lg">
                {" "}
                {user.firstName}{" "}
              </h1>
            </div>
            <div className="hidden lg:flex items-center ">
              <button
                onClick={initEdit}
                className="bg-primary w-8 h-8 rounded-full place-content-center"
              >
                {" "}
                <FaPenAlt className="w-4 h-5 text-white mx-auto" />{" "}
              </button>
            </div>
          </div>
          <div className="hidden lg:flex  mb-12 items-center font-montserrat-bold">
            <BsPatchCheckFill className="w-6 h-6 me-4 text-emerald-700" />{" "}
            Certifié
          </div>
          {!isEditing && (
            <>
              <section className="block text-sm w-[80%] mx-auto max-w-md lg:hidden bg-gray-100 px-4 py-6 rounded-xl">
                <div>
                  <div className="mb-5 flex">
                    <span className="font-montserrat-bold italic block me-3">
                      Email:{" "}
                    </span>
                    <span className="ms-2"> {user.email} </span>
                  </div>
                  <div className="mb-5 flex me-3">
                    <span className="font-montserrat-bold italic block">
                      Téléphone:{" "}
                    </span>
                    <span className="ms-2"> {user.profile.phone} </span>
                  </div>
                  <div className="mb-5 flex me-3">
                    <span className="font-montserrat-bold italic block">
                      Genre:{" "}
                    </span>
                    <span className="ms-2">
                      {" "}
                      {user.profile.gender || "Masculin"}{" "}
                    </span>
                  </div>
                </div>

                <span className="inline-block px-3 py-2 bg-amber-200/80 font-montserrat-bold rounded-sm mt-2">
                  Noté par Souaba
                </span>
                <div className="mt-5 flex items-center gap-x-3">
                  <span className="flex items-center">
                    {" "}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="text-primary w-6 h-6" />
                    ))}{" "}
                  </span>
                  <span>5.0</span>
                </div>
              </section>
              <section className="lg:hidden mt-5 text-center">
                <h1 className="font-montserrat-bold text-gray-700 text-[24px]">
                  Pièce d&apos;identité
                </h1>
                <div className="flex flex-col">
                  <div className="w-64 h-32 mt-5 bg-gray-200 text-center font-montserrat-bold text-md place-content-center">
                    Recto
                  </div>
                  <div className="w-64 h-32 mt-5 bg-red-200 text-center font-montserrat-bold text-md place-content-center">
                    Verso
                  </div>
                </div>
              </section>
            </>
          )}
        </aside>
        <section className="flex-1 h-full lg:min-h-full lg:px-5">
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
