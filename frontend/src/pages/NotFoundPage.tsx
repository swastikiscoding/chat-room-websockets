import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700 text-center p-8">
        <div className="mb-6">
          <div className="text-indigo-500 text-7xl font-bold mb-4">404</div>
          <h1 className="text-white text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-400 mb-6">
            Please go back to the home page and enter your name to join or create a room.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/")}
          className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
