import React from "react";
import { Link } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../assets/HomePage.png";

const Home: React.FC = () => {
  return (
    <>
      <HomeLayout>
        <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh] select-none">
          <div className="w-1/2 space-y-6">
            <h1 className="text-5xl font-semibold">
              Find out best{" "}
              <span className="text-primary font-bold">Online Courses</span>{" "}
            </h1>
            <p className="text-xl text-base-content">
              We have a large library of courses taught by highly skilled and
              qualified faculties at a very affordable cost.
            </p>
            <div>
              <Link to={"/courses"}>
                <button className="btn btn-primary btn-lg">
                  Explore Courses
                </button>
              </Link>
              <Link to={"/contact"}>
                <button className="btn btn-lg btn-outline btn-primary ml-5">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center pointer-events-none">
            <img src={HomePage} alt="" />
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
