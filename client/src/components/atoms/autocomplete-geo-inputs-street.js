import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function AutocompleteGeoInputStreet({
  selectPosition,
  setSelectPosition,
}) {
  const [listPlace, setListPlace] = useState([]);

  return (
    <div className="z-index-2">
      <Typeahead
        id="Street Retrieve"
        placeholder="Choose a city or street near parking lot..."
        options={listPlace}
        value={selectPosition}
        onChange={(elem) => setSelectPosition(elem[0])}
        labelKey={(elem) => elem.display_name}
        onInputChange={(q) => {
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
        }}
      />
    </div>
  );
}
