import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  console.log("Ride data:", props.ride);


  const submitHandler = async (e) => {
    e.preventDefault();

 const response = await axios.get(
  `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
  {
    params: {
      rideId: props.ride._id,
      otp: otp
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
);


if (response.status === 200 || response.status === 201) {
  props.setConfirmRidePopupPanel(false);
  props.setRidePopupPanel(false);

  navigate('/captain-riding', { state: { ride: response.data } });
}

  };

  return (
    <div>
      <div className="relative text-center">
        <button
          className="p-1 absolute w-[93%] top-0"
          onClick={() => props.setRidePopupPanel(false)}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </button>
        <h1 className="text-2xl font-semibold mb-5">Confirm this Ride to Start</h1>

        <div className='flex items-center justify-between p-3 bg-[#d0db9b] rounded-lg mt-4'>
          <div className='flex items-center gap-3'>
            <img
              className='h-12 w-10 rounded-full object-cover'
              src='https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7'
              alt='User'
            />
            <h3 className='text-lg font-medium'>{props.ride?.user?.fullname}</h3>
          </div>
          <h3 className='text-lg font-semibold'>2.2 KM</h3>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center flex-col">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">73/3</h3>
              <p className="text-sm -mt-1 text-gray-600">
               {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">2/1</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>


        <div className='mt-6 w-full'>
          <form onSubmit={submitHandler}>
            <input
              type='text'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className='bg-[#eee] flex justify-center p-3 font-mono text-lg rounded-lg w-full mt-2'
              placeholder='Enter OTP'
            />
            <button
              
              className='w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'
            >
              Confirm
            </button>
            <button
              type='button'
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full mt-2 bg-red-500 text-white font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
