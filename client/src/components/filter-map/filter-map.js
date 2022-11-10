import { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

export const FilterMap = ({ radius, lat, lon,zoom, setLat, setLon, setZoom }) => {
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
    if (map != null) {
      setCenter(map.getCenter().lat, map.getCenter().lng);
      setZoom(map.getZoom());
    }
  }, [map, setCenter, setZoom]);

  useEffect(() => {
    if (map != null) {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

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
