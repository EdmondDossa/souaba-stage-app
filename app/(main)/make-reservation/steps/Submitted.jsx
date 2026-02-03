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
      link: "/",
    },
    {
      title: "Ajouter à mon calendrier",
      icon: <CalendarDays />,
      link: "/",
    },
    {
      title: "Télécharger ma réservation en pdf",
      icon: <FaFileDownload />,
      link: "/",
    },
    {
      title: "Faire une nouvelle réservation",
      icon: <FaPlusCircle />,
      link: "/",
    },
  ];

  const visibleOptions = extraOptions.slice(0, 2);

  return (
    <div className="mt-32 md:mt-0">
      <SuccessfulSubmit withLinkToHome={false} title="Félicitations!">
        Votre réservation a bien été effectuée. Retrouvez-la dans le menu «Profil».
      </SuccessfulSubmit>
      <div className="max-w-4xl w-[300px] md:w-full mx-auto md:bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-y-3 ">
          {visibleOptions.map((option) => (
            <Link
              href={option.link}
              className="flex  w-full md:w-1/2 items-center self-start gap-x-2"
              key={option.title}
            >
              <span className="text-primary text-2xl"> {option.icon}</span>{" "}
              {option.title}{" "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Submitted;
