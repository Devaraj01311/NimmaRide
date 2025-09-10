const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password,
    color, plate, capacity, vehicleType,
    lng, lat
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captainData = {
        fullname: { firstname, lastname },
        email,
        password: hashedPassword,
        vehicle: { color, plate, capacity, vehicleType }
    };

    // Add location if provided
    if (lng !== undefined && lat !== undefined) {
        captainData.location = {
            type: 'Point',
            coordinates: [lng, lat]
        };
    }

    const captain = await captainModel.create(captainData);
    return captain;
};
