import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const userName = location.state?.userName;
    
    if (!userName) {
      return <NotFoundPage />;
    }
    
    return <>{children}</>;
  };
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/room/:roomCode" 
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App