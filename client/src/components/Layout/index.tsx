import { ReactNode } from "react";
import Wrapper from "../Wrapper";
import NavBar from "./NavBar";

interface ILayoutProps {
  children?: ReactNode;
}

const Layout: React.FC = ({ children }: ILayoutProps) => {
  return (
    <>
      <NavBar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default Layout;
