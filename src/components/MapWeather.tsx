//IMPPORTS
import {
  // useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  InfoBox,
} from "@react-google-maps/api";
import { getGeocode } from "use-places-autocomplete";
import classes from "./MapWeather.module.css";
import "../style.css";
import "../output.css";
import cloudyDay1Icon from "../svgs/cloudy-day-1.svg";
import cloudyNight1Icon from "../svgs/cloudy-night-1.svg";
import cloudyAlotIcon from "../svgs/cloudy.svg";
import rainyDay1Icon from "../svgs/rainy-2.svg";
import rainyDay3Icon from "../svgs/rainy-3.svg";
import rainyNight2Icon from "../svgs/rainy-5.svg";
import rainyNight3Icon from "../svgs/rainy-6.svg";
import rainyAlotIcon from "../svgs/rainy-7.svg";
import snowyDay2Icon from "../svgs/snowy-1.svg";
import snowyNight2Icon from "../svgs/snowy-5.svg";
import snowyAlotIcon from "../svgs/snowy-6.svg";
import dayIcon from "../svgs/day.svg";
import nightIcon from "../svgs/night.svg";
import thunderIcon from "../svgs/thunder.svg";
import { TbPlayerTrackNext } from "react-icons/tb";
import { TbPlayerTrackPrev } from "react-icons/tb";

import { useCallback, useEffect, useState, FC, useRef } from "react";

import OneCityInformation from "./OneCityInformation";
import LoadingSpinner from "./ui/LoadingSpinner";

import cx from "classnames";

//TYPES
type LatLngLiteral = google.maps.LatLngLiteral;

type MapOptions = google.maps.MapOptions;

type Coordinate = {
  lat: number | undefined;
  lon: number | undefined;
  cityName: string | undefined;
};

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

type WeatherData = {
  cityName: string;
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  daily: {
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
};

//MAP CENTER
const marker = { lat: 39, lng: 35 };

//COMPONENT FUNCTION
const MapWeather: FC<{ searchCoordinate: LatLngLiteral | undefined }> = (
  props
) => {
  const [dayWeatherData, setDayWeatherData] = useState<DayWeatherData[]>();
  const [cityInfo, setCityInfo] = useState<DayWeatherData>();
  const [infoBoxCoordinates, setInfoBoxCoordinates] = useState<Coordinate>();
  const [cityCoordinates, setCityCoordinates] = useState<Coordinate[]>([
    { lat: 41, lon: 29, cityName: "İstanbul" }, //İstanbul
    { lat: 40.25, lon: 29.125, cityName: "Bursa" }, //Bursa
    { lat: 38.25, lon: 27.125, cityName: "İzmir" }, //İzmir
    { lat: 36.875, lon: 30.6875, cityName: "Antalya" }, //Antalya
    { lat: 39.8125, lon: 30.4375, cityName: "Eskişehir" }, //Eskişehir
    { lat: 38, lon: 32.5, cityName: "Konya" }, //Konya
    { lat: 41.4375, lon: 31.8125, cityName: "Zonguldak" }, //Zonguldak
    { lat: 36.8125, lon: 34.625, cityName: "Mersin" }, //Mersin
    { lat: 39.9375, lon: 32.875, cityName: "Ankara" }, //Ankara
    { lat: 38.75, lon: 35.5, cityName: "Kayseri" }, //Kayseri
    { lat: 40.5625, lon: 34.9375, cityName: "Çorum" }, //Çorum
    { lat: 41.3125, lon: 36.3125, cityName: "Samsun" }, //Samsun
    { lat: 37.0625, lon: 37.375, cityName: "Gaziantep" }, //Antep
    { lat: 37.9375, lon: 40.1875, cityName: "Diyarbakır" }, //Diyarbakır
    { lat: 39.75, lon: 37.0, cityName: "Sivas" }, //Sivas
    { lat: 39.9375, lon: 41.3125, cityName: "Erzurum" }, //Erzurum
    { lat: 41, lon: 39.75, cityName: "Trabzon" }, //Trabzon
    { lat: 41.1875, lon: 41.8125, cityName: "Artvin" }, //Artvin
    { lat: 39.75, lon: 43, cityName: "Ağrı" }, //Ağrı
    { lat: 38.5, lon: 43.375, cityName: "Van" }, //Van
  ]);
  const [weatherData, setWeateherData] = useState<WeatherData[]>();

  const mapRef = useRef<GoogleMap>();
  const [isDay, setIsDay] = useState<null | boolean>(null);
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [openRightClickWindow, setOpenRightClickWindow] = useState(false);
  const [newCorrdinates, setNewCoordinates] = useState<Coordinate>();
  const [isFetchCompleted, setIsFetchCompleted] = useState(false);
  const [options, setOptions] = useState<MapOptions>();

  //CONVERTING TIME FORMAT FOR open-meteo
  const today = new Date();
  const lastDay = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 - 20000); //To eliminate the risk of 7 full days in open-meteo I used reduced interval 20 secs
  const [year, month, day] = [
    today.getFullYear(),
    today.getMonth() + 1,
    `${today.getDate()}`.padStart(2, "0"),
  ];

  const todayString = year + "-" + month + "-" + day;

  const [lastDayYear, lastDayMonth, lastDayDay] = [
    lastDay.getFullYear(),
    lastDay.getMonth() + 1,
    `${lastDay.getDate()}`.padStart(2, "0"),
  ];

  const lastDayString = lastDayYear + "-" + lastDayMonth + "-" + lastDayDay;

  // FETCHING DATA
  const oneDataProvider = useCallback(
    async (coordinate: Coordinate) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinate.lat}&longitude=${coordinate.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,windgusts_10m_max,sunrise,sunset&current_weather=true&timezone=auto&start_date=${todayString}&end_date=${lastDayString}`
        );
        const data = await res.json();

        // console.log(data);
        data.cityName = coordinate.cityName;

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
      } catch (err) {
        throw err; //IMP this way we will be able send the error to model js.
      }
    },
    [todayString, lastDayString]
  );

  const allDataProvider = useCallback(
    async function (arr: Coordinate[]) {
      const allReturnedData = await Promise.all(
        arr.map((el) => oneDataProvider(el))
      );

      // const tempArr = allReturnedData.map((d) => d);
      setWeateherData(allReturnedData);
    },
    [oneDataProvider]
  );

  //DEFINING MAP OPTIONS
  useEffect(() => {
    if (isDay !== null) {
      const mapIDD = isDay ? "fe8cf89b201e6159" : "6acfa5a011b30b21";

      //MAP OPTIONS
      setOptions({
        mapId: mapIDD,
        // disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        // panControl: false,
        // mapTypeControl: true,
        streetViewControl: false,
        scrollwheel: true,
        // styles: [
        //   {
        //     featureType: "poi",
        //     elementType: "labels.icon",
        //     stylers: [
        //       {
        //         visibility: "OFF",
        //       },
        //     ],
        //   },
        // ],
        // mapTypeId: google.maps.MapTypeId.TERRAIN,
        // mapTypeControlOptions: {
        //   mapTypeIds: [""],
        //   style: google.maps.MapTypeControlStyle.DEFAULT,
        //   position: google.maps.ControlPosition.TOP_CENTER,
        // },
      });

      console.log(mapIDD);
    }
  }, [isDay]);

  // console.log(weatherData);

  useEffect(() => {
    setIsFetchCompleted(false);
    allDataProvider(cityCoordinates);
    setIsFetchCompleted(true);
  }, [allDataProvider, cityCoordinates]);

  //NOW IS DAY OR NIGHT?
  const hour = today.getHours();
  const min = today.getMinutes();
  const time = hour + ":" + min;

  useEffect(() => {
    if (dayWeatherData) {
      if (
        dayWeatherData?.filter((el) => el.cityName === "Ankara")[0].sunrise <
          time &&
        dayWeatherData?.filter((el) => el.cityName === "Ankara")[0].sunset >
          time
      ) {
        setIsDay(true);
      } else {
        setIsDay(false);
      }
    }
  }, [dayWeatherData, time]);

  console.log(isDay);

  //FILTER THE DATA FOR A SPECIFIC DATE
  const filterSelectedDateData = useCallback(
    (date: string) => {
      let dayData: DayWeatherData[];
      if (weatherData) {
        if (date === todayString) {
          dayData = weatherData.map((el) => ({
            cityName: el.cityName,
            weathercode: el.current_weather.weathercode,
            latitude: el.latitude,
            longitude: el.longitude,
            temperature: Math.round(el.current_weather.temperature),
            temperature_2m_max: Math.round(el.daily.temperature_2m_max[0]),
            temperature_2m_min: Math.round(el.daily.temperature_2m_min[0]),
            time: el.daily.time[0],
            sunrise: el.daily.sunrise[0].slice(11),
            sunset: el.daily.sunset[0].slice(11),
            precipitation_sum: el.daily.precipitation_sum[0],
            windspeed_10m_max: el.daily.windspeed_10m_max[0],
          }));
          setDayWeatherData(dayData);
        } else {
          let index: any;

          index = weatherData[0].daily.time.indexOf(date);

          dayData = weatherData?.map((el) => ({
            cityName: el.cityName,
            weathercode: el.daily.weathercode[index],
            latitude: el.latitude,
            longitude: el.longitude,
            temperature: Math.round(
              (el.daily.temperature_2m_max[index] +
                el.daily.temperature_2m_min[index]) /
                2
            ),
            temperature_2m_max: Math.round(el.daily.temperature_2m_max[index]),
            temperature_2m_min: Math.round(el.daily.temperature_2m_min[index]),
            time: el.daily.time[index],
            sunrise: el.daily.sunrise[index]?.slice(11),
            sunset: el.daily.sunset[index]?.slice(11),
            precipitation_sum: el.daily.precipitation_sum[index],
            windspeed_10m_max: el.daily.windspeed_10m_max[index],
          }));
          setDayWeatherData(dayData);
        }
      }
    },
    [weatherData, todayString]
  );

  useEffect(() => {
    filterSelectedDateData(todayString);
  }, [filterSelectedDateData, todayString]);

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  // PICKING THE APPROPRIATE WEATHERICON
  const findWeatherIcon = (weatherCode: number): string | undefined => {
    let weatherIcon;
    if (weatherCode === 0) {
      weatherIcon = isDay ? dayIcon : nightIcon;
    } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
      weatherIcon = isDay ? cloudyDay1Icon : cloudyNight1Icon;
    } else if (weatherCode === 45 || weatherCode === 48) {
      weatherIcon = cloudyAlotIcon;
    } else if (
      weatherCode === 51 ||
      weatherCode === 53 ||
      weatherCode === 55 ||
      weatherCode === 56 ||
      weatherCode === 57
    ) {
      weatherIcon = isDay ? rainyDay1Icon : rainyNight2Icon;
    } else if (
      weatherCode === 61 ||
      weatherCode === 63 ||
      weatherCode === 65 ||
      weatherCode === 66 ||
      weatherCode === 67
    ) {
      weatherIcon = isDay ? rainyDay3Icon : rainyNight3Icon;
    } else if (
      weatherCode === 71 ||
      weatherCode === 73 ||
      weatherCode === 75 ||
      weatherCode === 77
    ) {
      weatherIcon = isDay ? snowyDay2Icon : snowyNight2Icon;
    } else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
      weatherIcon = rainyAlotIcon;
    } else if (weatherCode === 85 || weatherCode === 86) {
      weatherIcon = snowyAlotIcon;
    } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
      weatherIcon = thunderIcon;
    } else {
      weatherIcon = isDay ? dayIcon : nightIcon;
    }
    return weatherIcon;
  };

  //FIND THE CITY WHEN CLICKED TO MARKER
  const showCityDeatail = (city: string | undefined) => {
    const tempCityInfo = dayWeatherData?.filter(
      (el) => el.cityName === city
    )[0];
    setCityInfo(tempCityInfo);
    console.log(tempCityInfo);
  };

  //CHANGE SINGLE CITY DETAILS WHEN THE DATE CHANGES
  useEffect(() => {
    const tempCityData = dayWeatherData?.filter(
      (el) => el.cityName === cityInfo?.cityName
    )[0];
    setCityInfo(tempCityData);
  }, [dayWeatherData, cityInfo]);

  // console.log(cityInfo);

  //SHOW INFOBOX ON HOVER
  const showInfoBox = (e: google.maps.MapMouseEvent) => {
    setInfoBoxCoordinates({
      lat: e.latLng?.lat(),
      lon: e.latLng?.lng(),
      cityName: "",
    });
  };

  //HIDE INFOBOX OFF HOVER
  const hideInfoBox = () => {
    setInfoBoxCoordinates(undefined);
  };

  //NEXT DAY
  const nextDay = () => {
    setDayIndex((prev) => {
      return prev < 6 ? prev + 1 : 7;
    });
  };

  //PREV DAY
  const prevDay = () => {
    setDayIndex((prev) => {
      return prev > 1 ? prev - 1 : 0;
    });
  };

  useEffect(() => {
    weatherData && filterSelectedDateData(weatherData[0].daily.time[dayIndex]);
  }, [filterSelectedDateData, dayIndex, weatherData]);

  // console.log(props.searchCoordinate);

  //ADDING NEW MARKER WITH RIGHT CLICK
  const rightClickHandler = async (e: google.maps.MapMouseEvent) => {
    console.log(e.latLng?.lat(), e.latLng?.lng());
    const newCorrdinate: Coordinate = {
      lat: e.latLng ? e.latLng.lat() : 40,
      lon: e.latLng ? e.latLng?.lng() : 44,
      cityName: "Not Found",
    };

    const results = await getGeocode({
      location: {
        lat: newCorrdinate.lat ? newCorrdinate.lat : 40,
        lng: newCorrdinate.lon ? newCorrdinate.lon : 44,
      },
    });

    console.log(results);

    const tempArr: any = [];
    results?.forEach((el) => {
      const tempEl = el.address_components?.filter(
        (el) => el.types[0] === "administrative_area_level_2"
      );
      tempArr.push(...tempEl);
    });

    newCorrdinate.cityName = tempArr[0].long_name;

    if (!newCorrdinate.cityName) {
      const tempArr: any = [];
      results?.forEach((el) => {
        const tempEl = el.address_components?.filter(
          (el) => el.types[0] === "administrative_area_level_1"
        );
        tempArr.push(...tempEl);
      });

      newCorrdinate.cityName = tempArr[0].long_name;
    }

    if (!newCorrdinate.cityName) {
      newCorrdinate.cityName = "City Name Not Found";
    }

    setNewCoordinates(newCorrdinate);

    setOpenRightClickWindow(true);
  };

  //ADDING NEW MARKER WITH SEARCH BOX
  const clickOnSearchResult = useCallback(
    async (coordinate: LatLngLiteral | undefined) => {
      if (coordinate) {
        const newCorrdinate: Coordinate = {
          lat: coordinate.lat,
          lon: coordinate.lng,
          cityName: "Not Found",
        };

        console.log(newCorrdinate);

        const results = await getGeocode({
          location: coordinate,
        });
        console.log(results);
        console.log(results[0].address_components);

        const tempArr: any = [];
        results?.forEach((el) => {
          const tempEl = el.address_components?.filter(
            (el) => el.types[0] === "administrative_area_level_2"
          );
          tempArr.push(...tempEl);
        });

        newCorrdinate.cityName = tempArr[0].long_name;

        // newCorrdinate.cityName = results?.filter(el=>el.address_components?.filter(
        //   (el) => el.types[0] === "administrative_area_level_2"
        // ))[0]?.long_name;

        if (!newCorrdinate.cityName) {
          results?.forEach((el) => {
            const tempEl = el.address_components?.filter(
              (el) => el.types[0] === "administrative_area_level_1"
            );
            tempArr.push(...tempEl);
          });

          newCorrdinate.cityName = tempArr[0].long_name;
        }

        if (!newCorrdinate.cityName) {
          newCorrdinate.cityName = "City Name Not Found";
        }

        createNewMarker(newCorrdinate);
        mapRef.current?.panTo(coordinate);
      }
    },
    []
  );

  useEffect(() => {
    clickOnSearchResult(props.searchCoordinate);
  }, [props.searchCoordinate, clickOnSearchResult]);

  const createNewMarker = (coord: Coordinate) => {
    setCityCoordinates((prev) => [...prev, coord]);
  };

  // console.log(isLoaded, isFetchCompleted, isDay);

  return (
    <>
      {!isFetchCompleted ? (
        <LoadingSpinner />
      ) : (
        <div className="my-6 grid md:h-96 grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-4 ">
          <div className="md:col-span-3 ">
            {options && (
              <GoogleMap
                mapTypeId="roadmap"
                zoom={5.8}
                center={marker}
                mapContainerClassName="w-full h-96 rounded-xl  overflow-hidden  bg-white border border-sky-200 shadow-lg"
                options={options}
                onRightClick={rightClickHandler}
                onLoad={onLoad}
              >
                <div className={classes.marker}>
                  {openRightClickWindow &&
                    newCorrdinates?.lat &&
                    newCorrdinates?.lon && (
                      <InfoWindow
                        key={newCorrdinates.lat + newCorrdinates.lon - 1}
                        position={{
                          lat: newCorrdinates.lat,
                          lng: newCorrdinates.lon,
                        }}
                      >
                        <div>
                          <div
                            className={classes.contextMenu}
                            onClick={() => {
                              newCorrdinates && createNewMarker(newCorrdinates);
                              setOpenRightClickWindow(false);
                            }}
                          >
                            How is the weather here?
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  {dayWeatherData?.map((el) => (
                    <Marker
                      key={el.latitude + el.longitude}
                      position={{ lat: el.latitude, lng: el.longitude }}
                      icon={findWeatherIcon(el.weathercode)}
                      options={{ optimized: false }}
                      onMouseOver={(e) => showInfoBox(e)}
                      onMouseOut={() => hideInfoBox()}
                      onClick={() => {
                        showCityDeatail(el.cityName);
                      }}
                      label={{
                        className: `${classes.marker}`,
                        text: el.temperature + "º",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: "100",
                      }}
                    />
                  ))}
                  {dayWeatherData
                    ?.filter(
                      (el) =>
                        el.latitude === infoBoxCoordinates?.lat &&
                        el.longitude === infoBoxCoordinates.lon
                    )
                    .map((el) => (
                      <>
                        <InfoBox
                          key={el.latitude + el.longitude + 1}
                          options={{
                            isHidden: true,
                            visible: true,
                            boxClass: classes.infoBox,
                            closeBoxURL: "",
                          }}
                          position={{ lat: el.latitude, lng: el.longitude }}
                        >
                          <div>
                            {el.temperature_2m_min + "º"}/
                            {el.temperature_2m_max + "º"}
                          </div>
                        </InfoBox>
                      </>
                    ))}
                </div>
              </GoogleMap>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-y-2 rounded-xl w-full h-full bg-white border border-sky-200 shadow-lg overflow-hidden">
            <OneCityInformation oneCityData={cityInfo} />
          </div>
          <div className="md:col-span-3 flex flex-row justify-center text-white h-6 text-sm leading-6 ">
            <button
              disabled={dayIndex === 0 ? true : false}
              onClick={prevDay}
              className={cx(
                classes.shadowBox,
                "z-0 -mr-5 px-10 rounded-l-full bg-cyan-600  "
              )}
            >
              <TbPlayerTrackPrev />
            </button>
            <div
              className={cx(
                classes.shadowBox,
                classes.today,
                "z-10 px-10 rounded-full bg-cyan-500"
              )}
            >
              {weatherData && weatherData[0].daily.time[dayIndex]}
            </div>
            <button
              disabled={dayIndex === 7 ? true : false}
              onClick={nextDay}
              className={cx(
                classes.shadowBox,
                "z-0  -ml-5 px-10 rounded-r-full bg-cyan-600 "
              )}
            >
              <TbPlayerTrackNext />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapWeather;
