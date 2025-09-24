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
  formError = "",
}) => {
  const customClasse = `mx-auto w-[365px] mb-10 ${className}`;

  return (
    <AuthWrapper>
      {showTopImage && (
        <div className="my-10 flex items-center justify-center">
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
        <div className="flex items-center my-6 px-8">
                  <hr className="flex-1 border-gray-300" />
                  <span className="px-4 text-gray-500 text-sm">Ou inscrivez-vous avec</span>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <div className="px-8">
                  <SocialLoginButton />
                </div>
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
          </div>
        )}
      </form>
    </AuthWrapper>
  );
};

export default AuthForm;
