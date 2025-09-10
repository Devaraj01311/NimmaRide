const rideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
const mapService = require('./maps.service');
const crypto = require('crypto');

// Safe fare calculation
async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('pickup and destination are required');
    }

    let distanceTime = await mapService.getDistanceTime(pickup, destination);
   

    const parseDistanceKm = (d) => parseFloat(d.replace('km', '').trim());
    const parseDurationMin = (d) => parseFloat(d.replace('mins', '').replace('min', '').trim());

    const distanceKm = parseDistanceKm(distanceTime.distance);
    const durationMin = parseDurationMin(distanceTime.duration);

    if (!distanceKm || !durationMin || isNaN(distanceKm) || isNaN(durationMin)) {
        throw new Error(`Invalid distance/duration: ${JSON.stringify(distanceTime)}`);
    }

    const baseFare = { auto: 30, car: 50, motorcycle: 20 };
    const perKmRate = { auto: 10, car: 15, motorcycle: 8 };
    const perMinuteRate = { auto: 2, car: 3, motorcycle: 1.5 };

    return {
        auto: Math.round(baseFare.auto + (distanceKm * perKmRate.auto) + (durationMin * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceKm * perKmRate.car) + (durationMin * perMinuteRate.car)),
        motorcycle: Math.round(baseFare.motorcycle + (distanceKm * perKmRate.motorcycle) + (durationMin * perMinuteRate.motorcycle)),
    };
}

module.exports.getFare= getFare;

function getOtp(num){
    function generateOtp(num){
    const otp = crypto.randomInt(Math.pow(10,num - 1),Math.pow(10,num)).toString();
    return otp;
    }
    return generateOtp(num);
}

// Create a ride
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('all fields are required');
    }

    const validTypes = ['auto', 'car', 'motorcycle'];
    if (!validTypes.includes(vehicleType)) {
        throw new Error(`Invalid vehicle type. Allowed: ${validTypes.join(', ')}`);
    }

    const fare = await getFare(pickup, destination);

    if (isNaN(fare[vehicleType])) {
        throw new Error(`Failed to calculate fare for ${vehicleType}`);
    }

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp:getOtp(4),
        fare: Number(fare[vehicleType]),
        status: 'pending',
    });
    console.log('ride',ride);

    return ride;
    
};

module.exports.confirmRide = async ({
    rideId,captain
}) => {
    if(!rideId){
        throw new Error("Ride id is required");
    }
  
await rideModel.findOneAndUpdate({
    _id:rideId
},{
    status:'accepted',
    captain: captain._id
})

    const ride = await rideModel.findOne({
        _id:rideId
    }).populate('user').populate('captain').select('+otp')
   
    if(!ride){
        throw new Error("Ride not found");
    }

  return ride;

}

module.exports.startRide = async({rideId,otp,captain}) => {

if(!rideId || !otp) {
    throw new Error('Ride id and otp are required');
}

const ride = await  rideModel.findOne({
    _id:rideId
}).populate('user').populate('captain').select('+otp');

if(!ride){
    throw new Error("Ride not found")
}

if(ride.status !== 'accepted'){
    throw new Error('ride not accepted')
}

if(ride.otp !== otp){
    throw new Error('Invalid OTP');
}

await rideModel.findOneAndUpdate({
    _id:rideId
},{
    status:'ongoing'
})

sendMessageToSocketId(ride.user.socketId, "ride-started", ride);

return ride;

}


const Ride = require('../models/ride.model');

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("rideId is required");
  }

  // update ride
  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, captain: captain._id }, 
    {
      status: "completed",
      endTime: new Date()
    },
    { new: true }
  ).populate("user"); 

  return ride;
};


