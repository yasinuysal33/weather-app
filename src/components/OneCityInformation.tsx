import { WiDayCloudy } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { WiSunrise } from "react-icons/wi";
import { WiStrongWind } from "react-icons/wi";
import { WiThermometer } from "react-icons/wi";
import { WiRaindrop } from "react-icons/wi";

import classes from "./OneCityInformation.module.css";
import cx from "classnames";
import { FC, useEffect, useState } from "react";

type DayWeatherData = {
  cityName: string | undefined;
  weathercode: number;
  latitude: number;
  longitude: number;
  temperature: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  time: string;
  sunrise: string;
  sunset: string;
  precipitation_sum: number;
  windspeed_10m_max: number;
};

const OneCityInformation: FC<{ oneCityData: DayWeatherData | undefined }> = (
  props
) => {
  const [weatherStatus, setWeatherStatus] = useState<string>();

  useEffect(() => {
    console.log(props.oneCityData?.weathercode);
    switch (props.oneCityData?.weathercode) {
      case 0:
        setWeatherStatus("Clear sky");
        break;
      case 1:
      case 2:
      case 3:
        setWeatherStatus("Mainly clear, partly cloudy, and overcast");
        break;
      case 45:
      case 48:
        setWeatherStatus("Fog and depositing rime fog");
        break;
      case 51:
      case 53:
      case 55:
        setWeatherStatus("Drizzle: Light, moderate, and dense intensity");
        break;
      case 56:
      case 57:
        setWeatherStatus("Freezing Drizzle: Light and dense intensity");
        break;
      case 61:
      case 63:
      case 65:
        setWeatherStatus("Rain: Slight, moderate and heavy intensity");
        break;
      case 66:
      case 67:
        setWeatherStatus("Freezing Rain: Light and heavy intensity");
        break;
      case 71:
      case 73:
      case 75:
        setWeatherStatus("Snow fall: Slight, moderate, and heavy intensity");
        break;
      case 77:
        setWeatherStatus("Snow grains");
        break;
      case 80:
      case 81:
      case 82:
        setWeatherStatus("Rain showers: Slight, moderate, and violent");
        break;
      case 85:
      case 86:
        setWeatherStatus("Snow showers slight and heavy");
        break;
      case 95:
        setWeatherStatus("Thunderstorm: Slight or moderate");
        break;
      case 96:
      case 99:
        setWeatherStatus("Thunderstorm with slight and heavy hail");
        break;
      default:
        setWeatherStatus("Not foreseen");
    }
  }, [props.oneCityData?.weathercode]);

  return (
    <>
      {props.oneCityData ? (
        <>
          <div
            className={cx(
              classes.cityName,
              " leading-10 h-10 flex items-center justify-center text-2xl text-white"
            )}
          >
            <p className="inline-block align-middle">
              {props.oneCityData.cityName}
            </p>
          </div>
          <div className="px-5 flex flex-col">
            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiDayCloudy />
              </h1>
              <p className="flex-grow">{weatherStatus}</p>
            </div>
            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiThermometer />
              </h1>
              <p className="flex-grow">{props.oneCityData.temperature} ºC</p>
            </div>
            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiRaindrop />
              </h1>
              <p className="flex-grow">
                {props.oneCityData.precipitation_sum} mm
              </p>
            </div>
            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiStrongWind />
              </h1>
              <p className="flex-grow">
                {props.oneCityData.windspeed_10m_max} km/h
              </p>
            </div>

            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiSunrise />
              </h1>
              <p className="flex-grow ">{props.oneCityData.sunrise}</p>
            </div>
            <div className="flex h-12 py-3">
              <h1 className="flex-none w-14 text-3xl  text-cyan-500">
                <WiSunset />
              </h1>
              <p className="flex-grow">{props.oneCityData.sunset}</p>
            </div>
          </div>
        </>
      ) : (
        <div
          className={cx(
            classes.cityName,
            " leading-10 h-10 flex items-center justify-center text-2xl text-white"
          )}
        >
          <p className="inline-block align-middle">City Weather</p>
        </div>
      )}
    </>
  );
};

export default OneCityInformation;
