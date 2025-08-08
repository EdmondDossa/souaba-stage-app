"use client";
import useAuthContext from "@/context/auth";

const ConditionalComponentRender = ({ forLoggedUser = true, children }) => {
  const { isLogged } = useAuthContext();
  if (forLoggedUser && isLogged) return children;
  if (!forLoggedUser && !isLogged) return children;
  return <></>;
};

export default ConditionalComponentRender;
