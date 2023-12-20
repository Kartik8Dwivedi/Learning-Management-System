import { useNavigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="h-[90vh] w-full flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-9xl font-extrabold text-white text-center">
          <span className="text-primary">404</span> - Page Not Found
        </h1>
        <button
          onClick={() => navigate("/")}
          className="btn-lg mt-20 btn btn-primary"
        >
          Go Home
        </button>
      </div>
    </HomeLayout>
  );
};

export default NotFound;
