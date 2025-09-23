"use client";
import useAuthContext from "@/context/auth";

const ConditionalComponentRender = ({ forLoggedUser = true, children, ...props }) => {
  const { isLogged } = useAuthContext();
  if (forLoggedUser === isLogged) return <div { ...props} > {children} </div>;
  return <></>;
};

export default ConditionalComponentRender;
