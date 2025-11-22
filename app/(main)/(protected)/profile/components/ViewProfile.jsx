import useAuthContext from "@/context/auth";
import { IoStar } from "react-icons/io5";
import PhotosUpload from "../../add-establishment/steps-components/PhotosUpload";

const ViewProfile = ({ initEdit }) => {
  const { user } = useAuthContext();
  const tablesColumns = [
    {
      label: "Nom",
      key: "firstName",
    },

    {
      label: "Prénom",
      key: "lastName",
    },
    {
      label: "Email",
      key: "email",
    },

    {
      label: "Téléphone",
      key: "phone",
    },
    {
      label: "Genre",
      key: "gender",
    },
  ];

  return (
    <div className="lg:flex flex-grow text-sm  hidden">
      <div className="w-1/2">
        <h2 className="font-montserrat-bold">Informations Personnelles</h2>
        <div className="my-7">
          <table>
            <tbody>
              {tablesColumns.map((item) => (
                <tr
                  className="flex gap-x-4 justify-between mb-5 font-light"
                  key={item.label}
                >
                  <th> {item.label}: </th>
                  <td className="w-36 text-gray-400">
                    {" "}
                    {user[item.key] ?? "NA"}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <strong className="block font-montserrat-bold mb-3">
            Noté par souaba
          </strong>
          <div className="flex gap-x-2 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar
                key={i}
                className={`${i < 3 ? "text-primary" : "text-gray-400"}`}
              />
            ))}
            <strong className="font-montserrat-bold">5.0</strong>
          </div>
        </div>
        <div className="mt-10">
          <button
            onClick={initEdit}
            className="border-2 py-3 px-4 border-primary rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            {" "}
            Modifier le profil
          </button>
        </div>
      </div>
      <div className="w-1/2 ms-4">
        <h2 className="font-montserrat-bold text-center">Pièce d'identité</h2>
        <div className="w-full">
          <PhotosUpload
            onPhotosChange={()=>{}}
            title="Uploader votre carte"
            noPhotoText="Aucune image uploader pour l'instant"
            className="md:w-full h-[150px]"
            iconSize={40}
            label=""
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
