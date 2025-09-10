import React, { useEffect, useRef } from "react";
import './RidePopup.css';
const RidePopUp = (props) => {
  const audioRef = useRef(null);

  // Force audio unlock on first click
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) =>
          console.log("Still blocked:", err)
        );
      }
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);


  useEffect(() => {
    let timer;
    if (props.ridePopupPanel && audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay blocked:", err));

    
      timer = setTimeout(() => {
        stopSound();
        props.setRidePopupPanel(false);
      }, 5000);
    } else {
      stopSound();
    }

    return () => clearTimeout(timer);
  }, [props.ridePopupPanel]);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAccept = () => {
    stopSound();
    props.setConfirmRidePopupPanel(true);
    props.confirmRide();
  };

  const handleIgnore = () => {
    stopSound();
    props.setRidePopupPanel(false);
  };

  return (
    <div>
      <audio ref={audioRef} src="/DriverAudio.mp3" preload="auto" />

      <div className="relative text-center">
        <button className="p-1 absolute w-[93%] top-0" onClick={handleIgnore}>
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </button>
        <h1 className="text-2xl font-semibold mb-2">New Ride Available</h1>

        <div className="flex items-center justify-between p-3 bg-[#d0db9b] rounded-lg mt-4">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-10 rounded-full object-cover"
              src="https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7"
              alt=""
            />
            <h3 className="text-lg font-medium">{props.ride?.user?.fullname}</h3>
          </div>
          <h3 className="text-lg font-semibold">2.2 KM</h3>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center flex-col">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">73/3</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">2/1</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.ride?.destination}</p>
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

        <div className="flex flex-col mt-5 w-full items-center">
          <button
            onClick={handleAccept}
            className="w-full text-white font-semibold p-3 px-10 rounded-lg bg-green-600 animated-accept"
          >
            Accept
          </button>
          <button
            onClick={handleIgnore}
            className="w-full mt-1 bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
