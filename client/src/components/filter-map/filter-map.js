import { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";
const zoom = 13;
export const FilterMap = ({ radius, lat, lon, setLat, setLon }) => {
  const [map, setMap] = useState(null);
  const center = useMemo(() => [lat, lon], [lat, lon]);
  const setCenter = useCallback(
    (lat, lon) => {
      setLat(lat);
      setLon(lon);
    },

    [setLat, setLon]
  );

  const onMove = useCallback(() => {
    if (map != null) setCenter(map.getCenter().lat, map.getCenter().lng);
  }, [map, setCenter]);

  useEffect(() => {
    if (map != null) {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCenter(position.coords.latitude, position.coords.longitude);
      if (map != null)
        map.setView(
          [position.coords.latitude, position.coords.longitude],
          zoom
        );
    });
  }, [map, setCenter]);
  /*
  useEffect(() => {
    if (map != null) map.setView(center, zoom);
    onMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);*/

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}
        style={{ height: "50vh" }}
      >
        <Circle center={center} radius={radius} />
        <Circle center={center} radius={0} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};
