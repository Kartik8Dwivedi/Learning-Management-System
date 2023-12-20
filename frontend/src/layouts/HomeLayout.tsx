import React, { ReactNode } from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Footer from "../components/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state?.auth?.isLoggedIn
  );
  const role: string | undefined = useSelector(
    (state: RootState) => state?.auth?.role
  );

  const onLogout = () => {
    // e.preventDefault();
    // TODO: dispatch logout action
    navigate("/");
  };

  const changeWidth = () => {
    const drawer = document.querySelector(".drawer-side") as HTMLElement;
    drawer?.classList.toggle("w-0", false);
  };

  const hideDrawer = () => {
    const drawer = document.querySelector(".drawer-side") as HTMLElement;
    drawer?.classList.toggle("w-0", true);

    const element = document.getElementsByClassName(
      "drawer-toggle"
    ) as HTMLCollectionOf<HTMLInputElement>;
    (element[0] as HTMLInputElement).checked = false;
  };

  return (
    <>
      <div className="min-h-[90vh]">
        <div className="drawer absolute left-0 z-50 w-full">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer">
              <FiMenu
                onClick={changeWidth}
                size={"32px"}
                className="font-bold text-white m-4 transition-all duration-1000 ease-in-out hover:text-primary cursor-pointer"
              />
            </label>
          </div>
          <div className="drawer-side w-0 ">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-48 sm:w-80 bg-base-200 text-base-content relative h-screen text-xl">
              <li className="w-fit absolute right-2 z-50">
                <button onClick={hideDrawer}>
                  <AiFillCloseCircle
                    size={24}
                    className="transition-all duration-300 ease-in-out hover:text-primary"
                  />
                </button>
              </li>
              <li className="mt-10 transition-all duration-300 ease-in-out hover:text-primary">
                <Link
                  to={"/"}
                  className="transition-all duration-300 ease-in-out hover:text-primary"
                >
                  {" "}
                  Home{" "}
                </Link>
              </li>
              {isLoggedIn && role === "ADMIN" && (
                <li>
                  <Link to={"/admin/dashboard"}> Admin Dashboard</Link>
                </li>
              )}
              <li>
                <Link
                  to={"/courses"}
                  className="transition-all duration-300 ease-in-out hover:text-primary"
                >
                  {" "}
                  Courses{" "}
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  className="transition-all duration-300 ease-in-out hover:text-primary"
                >
                  {" "}
                  About Us{" "}
                </Link>
              </li>
              <li>
                <Link
                  to={"/contact"}
                  className="transition-all duration-300 ease-in-out hover:text-primary"
                >
                  {" "}
                  Contact Us{" "}
                </Link>
              </li>
              {!isLoggedIn ? (
                <li className="absolute bottom-4 w-[90%]">
                  <div className="w-full flex items-center justify-between">
                    <button className="btn btn-sm btn-primary w-[50%]">
                      <Link to={"/login"}>Log In</Link>
                    </button>
                    <button className="btn btn-sm btn-secondary w-[50%]">
                      <Link to={"/login"}>Sign Up</Link>
                    </button>
                  </div>
                </li>
              ) : (
                <li className="absolute bottom-4 w-[90%]">
                  <div className="w-full flex items-center justify-between">
                    <button className="btn btn-sm btn-primary w-[50%]">
                      <Link to={"/user/profile"}>Profile</Link>
                    </button>
                    <button
                      className="btn btn-sm btn-secondary w-[50%]"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
        {children}
        <Footer />
      </div>
    </>
  );
};

export default HomeLayout;
