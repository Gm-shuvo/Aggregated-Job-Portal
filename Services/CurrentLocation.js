import dotenv from 'dotenv';
dotenv.config();
import { useState } from 'react';


export const CurrentLocation = () => {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        // Use latitude and longitude to fetch the location details
        var requestOptions = {
          method: 'GET',
        };

        console.log(process.env.GEO_API_KEY)
        
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=4ab703f09e404891a6082fed9f10d415`, requestOptions)
          .then(response => response.json())
          .then(result => setLocation({city: result.features[0].properties.city, country: result.features[0].properties.country}))
          .catch(erroe => setError(error.message));
      },
    );
  } else {
    setError("Your browser does not support geolocation!");
  }

  return { location, error };
};

