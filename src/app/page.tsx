import { redirect } from "next/navigation";

const Layout = () => {
  redirect("/dashboard");
  return null;
};

export default Layout;