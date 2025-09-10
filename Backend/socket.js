const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async ({ userId, userType }) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(`Invalid userId: ${userId}`);
        return;
      }

      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`User ${userId} registered with socket ${socket.id}`);
        } else if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`Captain ${userId} registered with socket ${socket.id}`);
        }
      } catch (err) {
        console.error("Error updating socketId:", err.message);
      }
    });

    // Handle chat
    socket.on("chatMessage", (msg) => {
      console.log(` Message from ${socket.id}: ${msg}`);
      io.emit("chatMessage", msg); 
    });

    //  Handle captain location update
    socket.on("update-location-captain", async ({ userId, location }) => {
      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location format" });
      }

      try {
        // Save GeoJSON format [lng, lat]
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          },
        });

        console.log(`Captain ${userId} location updated:`, location);

        // Acknowledge captain
        socket.emit("location-updated", { success: true, location });

        // Broadcast to all users
        io.emit("captain-location-update", { captainId: userId, location });
      } catch (err) {
        console.error(" Error updating location:", err.message);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

// Send message to specific socket
function sendMessageToSocketId(socketId, event, payload) {
  console.log(` Sending "${event}" to ${socketId}`, payload);

  if (io) {
    io.to(socketId).emit(event, payload);
  } else {
    console.log(" Socket.io not initialized.");
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
