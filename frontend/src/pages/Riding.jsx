import React from 'react';
import { Link, Route, useLocation } from 'react-router-dom';
import { useEffect,useContext } from 'react';
import { SocketContext } from '../context/SocketContex';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../Components/LiveTracking';

const Riding = () => {
  const location = useLocation();
  const {ride} = location.state || {}

  const {socket} = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on("ride-ended", () => {
    navigate('/home');
  })

  const vehicleImages = {
  car: "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png",
  motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};

const vehicleType = ride?.captain?.vehicle?.vehicleType;

  return (
    <div className='h-screen'>
      <Link to='/home' className='fixed right-2 top-2  h-10 w-10 bg-white  flex items-center justify-center rounded-full'>
        < i className='text-lg font-medium ri-home-5-line'></i>
      </Link>
    <div className='h-1/2'>
      <LiveTracking/>
    </div>
    <div className='h-1/2  p-4'>
     <div className="flex items-center justify-between ">
         <img
          className="h-20"
          src={vehicleImages[vehicleType]} 
          alt={vehicleType}
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">{ride?.captain?.fullname.firstname +" "+ride?.captain?.fullname.lastname}</h2>
          <h3 className="text-xl font-semibold -mt-1 -mb-1">{ride?.captain?.vehicle.plate}</h3>
          <p className="text-lg text-gray-600 " >  {ride?.captain?.vehicle?.vehicleType} - {ride?.captain?.vehicle?.color}</p>
        </div>
      </div>

      {/* Route & Fare Info */}
      <div className="flex gap-2 justify-between items-center flex-col">
        <div className="w-full mt-5">

          {/* Drop Address */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h4 className="text-lg font-medium">2/1</h4>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.destination}
              </p>
            </div>
          </div>

          {/* Fare Info */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h4 className="text-lg font-medium">₹{ride?.fare}</h4>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    <button   className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg" >Make a Payment</button>
    </div>
   </div>
  );
};

export default Riding;
