import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

export const HikeMap = ({ startPoint, endPoint, referencesPoints, track }) => {
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  const [map, setMap] = useState(undefined);
  useEffect(() => {
    if (startPoint !== undefined && endPoint !== undefined) {
      setCenter([
        (startPoint.coordinates[0] + endPoint.coordinates[0]) / 2,
        (startPoint.coordinates[1] + endPoint.coordinates[1]) / 2,
      ]);
    }
  }, [endPoint, startPoint]);

  useEffect(() => {
    if (map !== undefined && map !== null) {
      map.setView(center);
    }
  }, [center, map]);
  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        ref={setMap}
        style={{ height: "50vh" }}
      >
        <Marker position={startPoint.coordinates} />
        <Marker position={endPoint.coordinates} />

        {
          //TODO:decide if keep or not
          false &&
            referencesPoints.map((point, index) => (
              <Marker key={index} position={point.coordinates} opacity={0.5} />
            ))
        }
        <Polyline positions={track} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};
/*
        <Marker
          position={startPoint !== undefined && startPoint.coordinates}
        />;*/
