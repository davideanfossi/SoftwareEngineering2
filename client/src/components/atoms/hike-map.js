import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { MarkerReferencePoint } from "./marker-reference-point";

export const HikeMap = ({ startPoint, endPoint, referencesPoints, track }) => {
  const [showReferencePoints, setShowReferencePoints] = useState(false);
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
    <Container>
      <Row>
        <Col>
          <div style={{ width: "100%", padding: "1rem" }}>
            <MapContainer
              center={center}
              zoom={10}
              scrollWheelZoom={false}
              ref={setMap}
              style={{ height: "50vh" }}
            >
              <MarkerReferencePoint point={startPoint} />
              <MarkerReferencePoint point={endPoint} />

              {
                //TODO:decide if keep or not

                showReferencePoints &&
                  referencesPoints.map((point, index) => (
                    <MarkerReferencePoint
                      point={point}
                      key={index}
                      isReference={true}
                    />
                  ))
              }
              <Polyline positions={track} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Form.Check
            type="checkbox"
            label="Show reference points"
            value={showReferencePoints}
            onChange={(event) => {
              setShowReferencePoints(event.target.checked);
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};
/*
        <Marker
          position={startPoint !== undefined && startPoint.coordinates}
        />;*/
