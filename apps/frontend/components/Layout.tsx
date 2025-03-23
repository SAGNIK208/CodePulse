import React from "react";
import Navbar from "../components/Navbar";

type NavLink = {
  href: string;
  label: string;
}

type LayoutProps = {
  children: React.ReactNode;
  links: NavLink[];
};

const Layout: React.FC<LayoutProps> = ({ children,links }) => {
  return (
    <div>
      <Navbar links={links}/>
      <main className="pt-15">{children}</main>
    </div>
  );
};

export default Layout;