import { useState, useEffect } from "react";
import axios from "axios";

const useAutosuggest = (location, setLocation) => {
  const [suggestions, setSuggestions] = useState([]);
  const [locationsArr, setLocationsArr] = useState([]);

  console.log(location);


  console.log(locationsArr);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${location}&limit=4&apiKey=${process.env.NEXT_PUBLIC_AUTOCOMPLETE_API_URL}` 
        );
        // Assuming you have the fetch result stored in the 'result' variable
        
        const locations =[];
        // Iterate over each feature in the fetch result
        response.data.features.forEach((feature) => {
          const city = feature.properties.city;
          const country = feature.properties.country;
          const loc = `${city},${country}`;
          console.log(loc);
          locations.push(loc);
          // Add the formatted unique location string to the array
          
        });
        setLocationsArr(Array.from(new Set(locations)));
        
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [location]);

  const onSuggestionsFetchRequested = ({ value }) => {
    const location = value.trim().toLowerCase();
    // Implement your own logic for filtering suggestions based on the input value
    const filteredSuggestions = locationsArr.filter((suggestion) =>
      suggestion.toLowerCase().includes(location)
    );
    setSuggestions(filteredSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;
  const renderSuggestion = (suggestion) => <div className="">{suggestion}</div>;

  const onChange = (event, { newValue }) => {
    setLocation(newValue);
  };

  const inputProps = {
    placeholder: "City or Country...",
    value: location,
    onChange,
    style: {
      width: "100%",
    },
  };

  return {
    suggestions,
    inputProps,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };
};

export default useAutosuggest;
