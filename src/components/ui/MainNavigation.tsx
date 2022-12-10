import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import cx from "classnames";

import classes from "./MainNavigation.module.css";

import { TbSearch } from "react-icons/tb";
import { useState, FC } from "react";

type LatLngLiteral = google.maps.LatLngLiteral;

const MainNavigation: FC<{
  onFetchCoordinate: (coordinate: LatLngLiteral) => void;
}> = (props) => {
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [comboboxStlye, setComboboxStlye] = useState("w-0 p-0");

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    console.log({ lat, lng });

    props.onFetchCoordinate({ lat, lng });
  };

  const toggleSearchBox = () => {
    setComboboxStlye((prev) => (prev === "w-0 p-0" ? "w-48 p-2" : "w-0 p-0"));
  };

  return (
    <div className="flex md:justify-between justify-center gap-4 py-1 md:py-0 px-1 shadow-lg rounded-lg flex-wrap">
      <div className="">
        <h1 className={cx(classes.headerNav, "")}>RIGHT CLICK or SEARCH</h1>
      </div>
      <div className="rounded-lg flex justify-between">
        {true && (
          <div className={"self-center"}>
            <Combobox onSelect={handleSelect}>
              <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={cx(classes.comboboxInput, `${comboboxStlye}`)}
                placeholder="Search an address"
              />
              <ComboboxPopover>
                <ComboboxList className={classes.comboboxList}>
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <ComboboxOption key={place_id} value={description} />
                    ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>
          </div>
        )}
        <div
          onClick={toggleSearchBox}
          className={cx(classes.searcher, "self-center cursor-pointer")}
        >
          <TbSearch />
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
