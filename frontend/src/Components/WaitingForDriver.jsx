
import React from 'react';

const WaitingForDriver = (props) => {

  const vehicleImages = {
  car: "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png",
  motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};

const vehicleType = props.ride?.captain?.vehicle?.vehicleType;
  return (
    <div className="relative text-center p-4">
      {/* Close Button */}
      <button
        className="p-1 absolute w-[93%] top-0"
        onClick={() => props.waitingForDriver(false)}
      >
        <i className="text-3xl text-gray-300  ri-arrow-down-wide-line"></i>
      </button>

      {/* Driver Info */}
      <div className="flex items-center  mt-4 justify-between ">
        <img
          className="h-20"
          src={vehicleImages[vehicleType]} 
          alt={props.vehicleType}
        />
        <div className="text-right ">
          <h2 className="text-lg font-medium capitalize">{props.ride?.captain?.fullname.firstname +" "+props.ride?.captain?.fullname.lastname}</h2>
          <h3 className="text-xl font-semibold -mt-1 -mb-1">{props.ride?.captain?.vehicle.plate}</h3>
          <p className="text-lg text-gray-600">{props.ride?.captain?.vehicle?.vehicleType} - {props.ride?.captain?.vehicle?.color}</p>
           <h2 className='text-lg font-semibold'> otp:{props.ride?.otp}</h2>
        </div>
      </div>

      {/* Route & Fare Info */}
      <div className="flex gap-2 justify-between items-center flex-col">
        <div className="w-full mt-5">
          {/* Pickup Address */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h4 className="text-lg font-medium">73/3</h4>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          {/* Drop Address */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h4 className="text-lg font-medium">2/1</h4>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          {/* Fare Info */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h4 className="text-lg font-medium">₹{props.ride?.fare}</h4>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
