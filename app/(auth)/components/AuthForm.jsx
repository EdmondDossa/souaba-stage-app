import Image from "next/image";
import { Button } from "@/components/ui/common/index";
import Link from "next/link";
import AuthWrapper from "./AuthWrapper";
import SocialLoginButton from "@/components/ui/common/SocialLoginButton";

const AuthForm = ({
  formTitle,
  btnTitle,
  alternativeOptionMessage,
  alternativeOptionLink = "",
  alternativeOptionBtn,
  onSubmit,
  children,
  showTopImage = true,
  className,
  isLoading,
  withSocialLoginSection = false,
  formError = "",
}) => {
  const customClasse = `mx-auto w-full md:w-[385px] py-8 px-5 ${className}`;

  return (
    <AuthWrapper>
      {showTopImage && (
        <div className="flex mt-10 py-4 lg:hidden items-center justify-center">
          <Image
            src="/images/logo-primary.png"
            width="120"
            height="209"
            alt=""
          />
        </div>
      )}
      <form className={customClasse} onSubmit={onSubmit}>
        <h1 className="font-montserrat-bold text-center mb-5 text-xl md:text-2xl">
          {formTitle}
        </h1>
        {formTitle === "Se Connecter" && (
          <div className="font-montserrat-medium text-center mb-4">
            Bienvenue sur{" "}
            <span className="font-montserrat-bold text-primary">Souaba</span>
          </div>
        )}
        <p className="empty:hidden text-center px-3 py-1 text-[14px] text-danger">
          {formError}
        </p>
        {children}
        <div>
          <Button
            isLoading={isLoading}
            className="w-full py-3 md:py-4 font-montserrat-bold rounded-4xl bg-primary hover:hover:bg-primary/70 transition duration-200 cursor-pointer"
          >
            {btnTitle}
          </Button>
        </div>
        <div className="text-gray-900 font-montserrat-medium text-center text-sm my-6 ">
          Ou connectez-vous avec
        </div>
        {withSocialLoginSection && (
          <div className="px-8">
            <SocialLoginButton />
          </div>
        )}
        {alternativeOptionMessage && (
          <div className="text-sm text-center mt-4">
            <p className="font-bold">
              {alternativeOptionMessage}
              <Link
                href={alternativeOptionLink}
                className="ms-2 text-primary decoration-1 underline  hover:decoration-2 hover:decoration-dotted transition"
              >
                {alternativeOptionBtn}
              </Link>{" "}
            </p>
            <p className="font-bold mt-5">
              Revenir à
              <Link
                href="/"
                className="ms-2 text-primary decoration-1 underline  hover:decoration-2 hover:decoration-dotted transition"
              >
                l'accueil
              </Link>{" "}
            </p>
          </div>
        )}
      </form>
    </AuthWrapper>
  );
};

export default AuthForm;
