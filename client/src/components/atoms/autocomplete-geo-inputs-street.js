import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function AutocompleteGeoInputStreet({
  selectPosition,
  setSelectPosition,
}) {
  const [listPlace, setListPlace] = useState([]);

  const handleChange = (elem) => selectPosition(elem[0]);
  const handleLabelKey = (elem) => elem.display_name;
  const handleInputChange = (q) => {
    const params = {
      q,
      format: "json",
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setListPlace(JSON.parse(result));
      })
      .catch((err) => console.log("err: ", err));
  }

  return (
    <div className="z-index-2">
      <Typeahead
        id="Street Retrieve"
        placeholder="Choose a city or street near parking lot..."
        options={listPlace}
        value={selectPosition}
        onChange={handleChange}
        labelKey={handleLabelKey}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
