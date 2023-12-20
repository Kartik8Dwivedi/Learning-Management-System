import React from "react";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

const Footer: React.FC = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();

  return (
    <>
      <footer className="relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between sm:px-20 text-white bg-primary-content">
        <section className="text-lg">
          Copyright {year} | All rights reserved
        </section>

        <section className="flex items-center justify-center gap-5 text-2xl text-white">
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsFacebook />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsInstagram />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsTwitter />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsLinkedin />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsGithub />
          </a>
        </section>
      </footer>
    </>
  );
};

export default Footer;
