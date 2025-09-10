
import React from 'react';

function LocationSearchPanel({
  activeField,
  pickupSuggestions,
  destinationSuggestions,
  setPickup,
  setDestination,
  setVehiclePanel,
  setPanelOpen
}) {
  // Choose the right suggestions based on active field
  const suggestions =
    activeField === 'pickup' ? pickupSuggestions : destinationSuggestions;

  const handleSelect = (location) => {
    if (activeField === 'pickup') {
      setPickup(location.description);
    } else {
      setDestination(location.description);
    }

    // Close panel and open vehicle panel
    // setPanelOpen(false);
    // setVehiclePanel(true);
  };

  return (
    <div>
      {suggestions.length === 0 && (
        <p className="text-center mt-5 py-4 text-gray-500">No suggestions found.</p>
      )}

      {suggestions.map((location, idx) => (
        <div
          key={idx}
          onClick={() => handleSelect(location)}
          className="flex gap-1 border-2 p-2 mt-8 border-gray-100 active:border-black hover:border-black cursor-pointer rounded-xl items-center my-2 justify-start mx-4"
        >
          <div className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full ml-3">
            <i className="ri-map-pin-fill text-lg"></i>
          </div>
          <h4 className="font-medium text-sm">{location.description}</h4>
        </div>
      ))}
    </div>
  );
}

export default LocationSearchPanel;
