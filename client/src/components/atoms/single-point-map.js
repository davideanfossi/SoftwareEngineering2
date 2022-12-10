import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import { MarkerReferencePoint } from "./marker-reference-point";

export const SinglePointMap = ({ point }) => {
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  const [map, setMap] = useState(undefined);

  useEffect(() => {
      setCenter([
        point.latitude,
        point.longitude
      ]);
    }, [point.latitude, point.longitude]);

  useEffect(() => {
    if (map !== undefined && map !== null) {
      map.setView(center);
    }
  }, [center, map]);

  return (
    <Container onClick={(event) => { event.stopPropagation(); }}>
      <Row>
        <Col>
          <div style={{ width: "100%", padding: "1rem" }}>
            <MapContainer
              center={center}
              zoom={13}
              scrollWheelZoom={false}
              ref={setMap}
              style={{ height: "50vh" }}
            >
              <MarkerReferencePoint point={point} />

             
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

