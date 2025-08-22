import Link from "next/link";

const ConnexionHero = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex justify-center items-center w-1/2 min-h-screen bg-[#EEFCFC] bg-center bg-no-repeat object-contain bg-[length:500px_500px] bg-[url(/images/auth-bg.png)]">
      <p className="text-center text-sm font-montserrat-bold font-bold self-end">
        © {currentYear}{" "}
        <Link className="text-primary" href="/">
          souaba.com
        </Link>{" "}
        | Tous droits réservés
      </p>
    </div>
  );
};

export default ConnexionHero;
