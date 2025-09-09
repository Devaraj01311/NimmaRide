const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // 1️⃣ Create ride in DB
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        // 2️⃣ Respond immediately to user
        res.json(ride);

        // 3️⃣ Fire-and-forget async tasks for captain dispatch
        (async () => {
            try {
                // a) Get pickup coordinates
                const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
                console.log("Pickup coords:", pickupCoordinates);

                // b) Get nearby captains (within 2 km)
                const captainsInRadius = await mapService.getCaptainInTheRadius(
                    pickupCoordinates.lat, 
                    pickupCoordinates.lng,
                    2 // radius in km
                );

                // c) Load ride with populated user
                const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

                // d) Prepare ride data with fullname as string
                const rideData = {
                    ...rideWithUser.toObject(),
                    user: {
                        _id: rideWithUser.user._id,
                        fullname: rideWithUser.user.fullnameString, // ✅ virtual string
                        email: rideWithUser.user.email,
                        socketId: rideWithUser.user.socketId
                    },
                    otp: "" // hide OTP when sending to captains
                };

                // e) Emit ride to each nearby captain
               captainsInRadius.forEach(captain => {
  console.log(`Sending ride to captain: ${captain.fullnameString || captain.fullname}`);
  sendMessageToSocketId(captain.socketId, 'new-ride', rideData);
});


            } catch (err) {
                console.error("Error fetching map/captains data:", err.message);
            }
        })();

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(201).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async(req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {rideId} = req.body;
    try{
          const ride = await rideService.confirmRide({rideId, captain:req.captain});
      sendMessageToSocketId(ride.user.socketId, "ride-confirmed", ride);


        return res.status(201).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    
}


module.exports.startRide = async(req,res) => {
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {rideId,otp} = req.query;
    try{
          const ride = await rideService.startRide({rideId, otp,captain:req.captain});

          console.log(ride)
      sendMessageToSocketId(ride.user.socketId, "ride-started", ride);

        return res.status(201).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({
      rideId,
      captain: req.captain
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.user && ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, "ride-ended", ride);
    } else {
      console.warn("⚠️ ride.user or socketId missing:", ride.user);
    }

    return res.status(200).json(ride);
  } catch (err) {
    console.error("❌ endRide error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

