import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import useSocket from "../hooks/useSocket";

const HomePage = () => {
    const [showJoinForm, setShowJoinForm] = useState<boolean>(false);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [showRoomCodeModal, setShowRoomCodeModal] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [generatedRoomCode, setGeneratedRoomCode] = useState<string>("");
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        roomCode: ''
    });

    // Use the custom hook
    // const socket = useSocket("http://localhost:3000");
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.roomCode.trim()) {
            setError("Please fill in all fields");
            return;
        }
        
        console.log(`[HomePage] Joining room ${formData.roomCode} as ${formData.name}`);
        
        // Both joining and creating rooms are now allowed
        navigate(`/room/${formData.roomCode.trim()}`, { 
            state: { 
                userName: formData.name.trim(), 
                isCreator: false 
            } 
        });
    };

    const handleCreateRoomForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError("Please enter your name");
            return;
        }
        
        // Generate a random room code
        const randomRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log(`[HomePage] Generated room code: ${randomRoomCode} for user ${formData.name}`);
        setGeneratedRoomCode(randomRoomCode);
        setShowRoomCodeModal(true);
    };
    
    const handleEnterCreatedRoom = () => {
        console.log(`[HomePage] Entering created room ${generatedRoomCode} as ${formData.name}`);
        navigate(`/room/${generatedRoomCode}`, { 
            state: { 
                userName: formData.name.trim(),
                isCreator: true 
            } 
        });
    };
    
    const resetForms = () => {
        setShowJoinForm(false);
        setShowCreateForm(false);
        setError("");
    };

    return (
       <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white text-center">Chat Room</h1>
          </div>
          
          <div className="p-6 space-y-6">
            {!showJoinForm && !showCreateForm ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Join Room
                </button>
                
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Create Room
                </button>
              </div>
            ) : showJoinForm ? (
              <div className="space-y-4">
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-1">Room Code</label>
                    <input 
                      type="text"
                      id="roomCode"
                      name="roomCode"
                      value={formData.roomCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter room code"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForms}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      Join
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleCreateRoomForm} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForms}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      Create Room
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Room Code Modal */}
        {showRoomCodeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Your Room Code</h3>
              <div className="bg-gray-700 p-4 rounded-md text-center mb-4">
                <p className="font-mono text-2xl text-indigo-400 select-all">{generatedRoomCode}</p>
                <p className="text-gray-400 text-sm mt-2">Share this code with others to join your room</p>
              </div>
              <button
                onClick={handleEnterCreatedRoom}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200"
              >
                Enter Room
              </button>
            </div>
          </div>
        )}
      </div>
    )
}

export default HomePage