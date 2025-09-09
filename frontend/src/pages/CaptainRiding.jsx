import React, { useRef, useState } from 'react';
import { Link, useLocation, useSubmit } from 'react-router-dom';
import FinishRide from '../Components/FinishRide.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LiveTracking from '../Components/LiveTracking.jsx';

const CaptainRiding = () => {
const [finishRidePanel, setFinishRidePanel] = useState(false)
const finishRidePanelRef = useRef(null)
const location = useLocation()
const rideData = location.state?.ride


  useGSAP(function(){
 if(finishRidePanel) {
    gsap.to(finishRidePanelRef.current, {
    transform: 'translateY(0)' 
  })
}else {
  gsap.to(finishRidePanelRef.current, {
  transform:'translateY(100%)' 
  })
}
 }, [finishRidePanel]);
    return (
       <div className='h-screen relative'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen '>
        <img className='w-32'src="/image.png" alt="logo" />
      <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        < i className='text-lg   font-medium ri-logout-box-r-line'></i>
      </Link>
      </div>
    <div className='h-4/5'>
    <LiveTracking/>
    </div>
        <div className='h-1/5 p-6 flex items-center justify-between  relative bg-[#dcee8c] pt-10'
        onClick={()=>{
          setFinishRidePanel(true)
        }}>
     <h5  className="p-1 text-center absolute w-[90%] top-0 " onClick={() => { } } >
         <i className="text-3xl relative text-black ri-arrow-up-wide-line"></i> </h5>
      <h4 className='text-xl font-semibold '>4 KM away</h4>
      <button className="  bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">Complete Ride</button>
  </div>
  <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white'>
    <FinishRide 
    ride={rideData}
    setFinishRidePanel={setFinishRidePanel}/>
    </div>
  </div>
    );
};

export default CaptainRiding;