import React from 'react';
import { Link, useSubmit } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinishRide = (props) => {

  const navigate=useNavigate();

  async function endRide(){
      const response= await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`,{
   
      rideId: props.ride._id,
  },{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (response.status === 200) {
  navigate('/captain-home');
}
  }
    return (
         <div >
            <div className="relative text-center">
        <button
          className="p-1 absolute w-[93%] top-0"
          onClick={() => props.setFinishRidePanel(false)}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </button>
        <h1 className="text-2xl font-semibold mb-5 ">Finish this Ride </h1>
        <div className='flex items-center justify-between p-3 border-2  border-[#d0db9b] w-50 rounded-lg mt-4'>
            <div className='flex items-center gap-3 '>
                <img className='h-12 w-10 rounded-full object-cover' src='https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7' alt=''/>
                <h3 className='text-lg font-medium'>{props.ride?.user?.fullname.firstname} {props.ride?.user?.fullname.lastname}</h3>
            </div>
            <h3 className='text-lg font-semibold'> 2.2 KM</h3>
        </div>
      </div>

      {/* Ride Info Section */}
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
        {/* Confirm Button */}
        <div className='mt-10 w-full'>
        <button 
        onClick={endRide}
        className='w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>
        Finish Ride</button>
        </div>
      </div>
        </div>
    );
};

export default FinishRide;