import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";

const SuccessfulSubmit = ({ title, children, withLinkToHome = true }) => {
  return (
    <section className="flex flex-col items-center justify-center mt-10 text-md">
      <div className="w-20 h-20 mb-2 bg-primary rounded-full place-content-center">
        <Check className="w-12 h-12 mx-auto text-white" />
      </div>
      <h1 className="text-xl mb-5 font-bold font-montserrat-medium">{title}</h1>
      <p className="text-center w-md mb-10 text-gray-500">{children}</p>
      {withLinkToHome && (
        <div>
          <Link
            href="/"
            className="flex items-center justify-center mt-10 border border-gray-200 px-4 py-3 rounded-md font-montserrat-medium font-bold text-sm hover:bg-gray-100"
          >
            {" "}
            <ChevronLeft /> Revenir à l'accueil{" "}
          </Link>
        </div>
      )}
    </section>
  );
};

export default SuccessfulSubmit;
