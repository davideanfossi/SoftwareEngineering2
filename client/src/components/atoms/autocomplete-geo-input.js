import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function AutocompleteGeoInput({
  selectPosition,
  setSelectPosition,
}) {
  const [listPlace, setListPlace] = useState([]);

  const handleChange = (elem) => selectPosition(elem[0]);
  const handleInputChange = (city) => {
    const params = {
      city,
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
  const handleLabelKey = (elem) => elem.display_name;


  return (
    <div className="z-index-2">
      <Typeahead
        id="basic-example"
        placeholder="Choose a city..."
        options={listPlace}
        value={selectPosition}
        onChange={handleChange}
        labelKey={handleLabelKey}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
