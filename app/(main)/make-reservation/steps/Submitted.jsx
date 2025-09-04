import SuccessfulSubmit from "@/components/ui/common/SuccessfulSubmit";
import { MapPinned, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";

const Submitted = () => {
  const extraOptions = [
    {
      title: "Voir l'itinéraire",
      icon: <MapPinned />,
      link: "#",
    },
    {
      title: "Ajouter à mon calendrier",
      icon: <CalendarDays />,
      link: "#",
    },
    {
      title: "Télécharger ma réservation en pdf",
      icon: <FaFileDownload />,
      link: "#",
    },
    {
      title: "Faire une nouvelle réservation",
      icon: <FaPlusCircle />,
      link: "#",
    },
  ];

  return (
    <div>
      <SuccessfulSubmit withLinkToHome={false} title="Félicitations!">
        Votre réservation d'hôtel a bien été effectuée. Vous pouvez la consulter
        dans le menu «Profil».
      </SuccessfulSubmit>
      <div className="grid sm:grid-cols-2 grid-cols-1 w-1/2 mx-auto mt-10 gap-y-5 bg-gray-50 rounded-lg p-2 ">
        {extraOptions.map((option) => (
          <Link href={option.link} className="flex items-center self-end gap-x-2 text-right" key={option.title}>
            <span className="text-primary text-2xl"> {option.icon}</span>{" "}
            {option.title}{" "}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Submitted;
