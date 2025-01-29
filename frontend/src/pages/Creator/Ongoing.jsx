import React, { useContext, useRef, useEffect, useState } from "react";
import { SocketContext } from "../../util/SocketProvider";
import { useNavigate } from "react-router-dom";
import OngoingNew from "./OngoingNew";
import { toast } from "react-toastify";

const Ongoing = () => {
  const nav = useNavigate();
  const givenRoomCode = useRef(null);
  const { socket, connected } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("error-message", ({ message }) => {
      toast.error("Oops! Looks like you are not authorized");
      console.log("Error here");
      nav("/creator/dashboard/ongoing");
    });
    if (!connected) {
      console.log("Socket not connected");
    }
  }, [connected]);

  const handleJoinRoom = () => {
    if (!connected || !socket) {
      console.error("Cannot join room: Socket not connected");
      return;
    }

    const room = givenRoomCode.current.value;
    if (room) {
      socket.emit("join-room", { room });
      localStorage.setItem("room", room);
      console.log(`Joining room: ${room}`);
      nav("/creator/dashboard/ongoing/workspace");
    } else {
      console.error("Room code is required");
      nav("/creator/dashboard/ongoing");
    }
  };

  return (
    <div className="mt-30 max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-100">
      <form className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Join a Room</h2>
          <p className="text-gray-600">
            Enter the room code generated by the job you are accepted for.
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your room code"
            ref={givenRoomCode}
            disabled={!connected}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              connected
                ? "border-gray-300 focus:ring-blue-500"
                : "border-gray-200 bg-gray-100 cursor-not-allowed"
            }`}
          />
          <button
            type="button"
            onClick={handleJoinRoom}
            disabled={!connected}
            className={`w-full px-4 py-3 font-semibold text-white rounded-lg transition-colors duration-300 ${
              connected
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}>
            Join Room
          </button>
        </div>
        {!connected && (
          <p className="mt-4 text-sm text-red-600 text-center">
            Not connected to server. Please check your authentication.
          </p>
        )}
      </form>
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Don't have a room code? Contact the job provider.</p>
      </div>
    </div>
  );
};

export default Ongoing;
