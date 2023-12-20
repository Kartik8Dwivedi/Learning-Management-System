import HomeLayout from "../layouts/HomeLayout";
import aboutUs from "../assets/AboutUs.png";
import apj from "../assets/DrAPJ_AbdulKalam.png";
import steveJobs from "../assets/SteveJobs.png";
import billGates from "../assets/BillGates.png";
import nelsonMandela from "../assets/NelsonMandela.png";
import einstein from "../assets/Einstein.png";

const AboutUs = () => {
  return (
    <HomeLayout>
      <div className="flex flex-col text-white pl-20 pt-20 select-none">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-primary font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-xl text-neutral-content">
              Our goal is to provide a affordable and quality education to
              everyone. We believe that education is a right and not a
              privilege. We want to make sure that everyone has access to
              quality education. We are providing the platfrom for the aspiring
              teachers and sutdents to share their skills, creativity and
              knowledge to each other to empower and contribute in the growth of
              the society.
            </p>
          </section>
          <div className="w-1/2 overflow-hidden max-h-[75vh]">
            <img
              src={aboutUs}
              className="drop-shadow-2xl shadow-neutral-content h-[50%] pointer-events-none"
              alt="About Us"
              id="test1"
              style={{
                filter: "",
              }}
            />
          </div>
        </div>
        <div className="carousel w-1/2 mx-auto mt-10">
          <div id="slide1" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img
                src={apj}
                className="w-40 rounded-full border-2 border-gray-400 pointer-events-none"
              />
              <p className="text-xl text-neutral-content text-center">
                Teaching is a very noble profession that shapes the character,
                caliber, and future of an individual.
              </p>
              <h3 className="text-2xl font-semibold">APJ Abdul Kalam</h3>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide2" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img
                src={steveJobs}
                className="w-40 rounded-full border-2 border-gray-400 pointer-events-none"
              />
              <p className="text-xl text-neutral-content text-center">
                We dont get a chance to do that many things, and every one
                should be really excellent.
              </p>
              <h3 className="text-2xl font-semibold">Steve Jobs</h3>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img
                src={billGates}
                className="w-40 rounded-full border-2 border-gray-400 pointer-events-none"
              />
              <p className="text-xl text-neutral-content text-center">
                Success is a lousy teacher. It seduces smart people into
                thinking they can’t lose.
              </p>
              <h3 className="text-2xl font-semibold">Bill Gates</h3>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img
                src={nelsonMandela}
                className="w-40 rounded-full border-2 border-gray-400 pointer-events-none"
              />
              <p className="text-xl text-neutral-content text-center">
                Education is the most powerful tool you can use to change the
                world.
              </p>
              <h3 className="text-2xl font-semibold">Nelson Mandela</h3>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide5" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
          <div id="slide5" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img
                src={einstein}
                className="w-40 rounded-full border-2 border-gray-400 pointer-events-none"
              />
              <p className="text-xl text-neutral-content text-center">
                Imagination is more important than knowledge. Knowledge is
                limited. Imagination encircles the world.
              </p>
              <h3 className="text-2xl font-semibold">Sir Albert Einstein</h3>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AboutUs;
