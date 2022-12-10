import { useState } from "react";
import MapWeather from "./components/MapWeather";
import MainNavigation from "./components/ui/MainNavigation";
import { useLoadScript } from "@react-google-maps/api";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Footer from "./components/ui/Footer";

type LatLngLiteral = google.maps.LatLngLiteral;

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
    language: "en",
  });

  const [newSearchResultCoordinate, setNewSearchResultCoordinate] =
    useState<LatLngLiteral>();
  const fetchCoordinate = (coordinate: LatLngLiteral) => {
    setNewSearchResultCoordinate(coordinate);
  };

  return (
    <>
      {!isLoaded ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="min-h-[95vh]">
            <MainNavigation onFetchCoordinate={fetchCoordinate} />
            <MapWeather searchCoordinate={newSearchResultCoordinate} />
          </div>
          <div className="min-h-[5vh] rounded-lg">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
