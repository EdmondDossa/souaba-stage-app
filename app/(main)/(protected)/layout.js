import ProtectedRoutes from "@/components/auth/ProtectedRoutes";

const layout = ({ children }) => {
  return <ProtectedRoutes>{children}</ProtectedRoutes>;
};

export default layout;
