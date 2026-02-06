import { useMemo, useState } from "react";
import useAuthContext from "@/context/auth";
import { IoStar } from "react-icons/io5";
import { Eye, RefreshCw } from "lucide-react";

const ViewProfile = ({ initEdit }) => {
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const identityBaseUrl = useMemo(() => apiBase.replace(/\/+$/, ""), [apiBase]);

  const buildIdentityUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const normalizedPath = path.replace(/^\/+/, "");
    return identityBaseUrl ? `${identityBaseUrl}/${normalizedPath}` : `/${normalizedPath}`;
  };

  const formatGender = (key, value) => {
    if (key !== "gender") return value;
    const map = {
      MALE: "Homme",
      FEMALE: "Femme",
      OTHER: "Autre",
    };
    return map[value] || value || "NA";
  };
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

  const cardPaths = {
    front:
      buildIdentityUrl(
        user?.profile?.identity_card_front || user?.identity_card_front
      ) || "",
    back:
      buildIdentityUrl(
        user?.profile?.identity_card_back || user?.identity_card_back
      ) || "",
  };

  const renderCard = (side) => {
    const path = cardPaths[side];
    if (!path) {
      return (
        <div className="border border-dashed rounded-lg h-40 flex items-center justify-center text-xs text-gray-500">
          {side === "front" ? "Recto non fourni" : "Verso non fourni"}
        </div>
      );
    }
    return (
      <div className="relative border rounded-xl overflow-hidden h-48 bg-gray-100 shadow-sm">
        <img src={path} alt={side} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => {
            setIsFront(side === "front");
            setShowModal(true);
          }}
          className="absolute top-2 right-2 bg-black/55 text-white p-2 rounded-full hover:bg-black/80 transition shadow"
          aria-label={`Voir ${side}`}
        >
          <Eye size={16} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row grow text-sm gap-6">
        <div className="w-full  space-y-5">
          <div className="bg-white p-5 ">
            <h2 className="font-montserrat-bold text-lg text-gray-800">
              Informations personnelles
            </h2>
            <div className="mt-5">
              <table className="w-full">
                <tbody>
                  {tablesColumns.map((item) => (
                    <tr
                      className="flex gap-x-4 mb-3 font-light"
                      key={item.label}
                    >
                      <th className="text-gray-600 text-start">
                        {" "}
                        {item.label}:{" "}
                      </th>
                      <td className="text-start text-gray-800 font-montserrat-medium">
                        {formatGender(item.key, user[item.key] ?? "NA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white  p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-montserrat-bold text-lg text-gray-800">
                  Pièce d'identité
                </h2>
                <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                  Recto / Verso
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>{renderCard("front")}</div>
                <div>{renderCard("back")}</div>
              </div>
            </div>
            <div className="mt-4">
              <strong className="block font-montserrat-bold mb-3 text-gray-800">
                Noté par Souaba
              </strong>
              <div className="flex gap-x-2 items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar
                    key={i}
                    className={`${i < 3 ? "text-primary" : "text-gray-300"}`}
                  />
                ))}
                <strong className="font-montserrat-bold text-gray-800">
                  5.0
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
            <div className="text-sm text-gray-500">
              Mettez vos infos à jour pour rester certifié.
            </div>
            <button
              onClick={initEdit}
              className="border-2 py-3 px-4 border-primary rounded-md hover:bg-primary/10 transition cursor-pointer font-montserrat-bold text-gray-800"
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-montserrat-bold">
                Pièce d'identité — {isFront ? "Recto" : "Verso"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFront((p) => !p)}
                  className="flex items-center gap-2 text-primary text-sm font-semibold hover:text-amber-500"
                >
                  <RefreshCw size={16} />
                  Retourner
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-black text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="relative h-[320px] bg-gray-50">
              {cardPaths[isFront ? "front" : "back"] ? (
                <img
                  src={cardPaths[isFront ? "front" : "back"]}
                  alt={isFront ? "Recto" : "Verso"}
                  className={`h-full w-full object-contain transition-transform duration-300 ${
                    isFront ? "" : "scale-x-[-1]"
                  }`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-500">
                  {isFront ? "Recto non fourni" : "Verso non fourni"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfile;
