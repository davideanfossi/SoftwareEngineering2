import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { MarkerReferencePoint } from "./marker-reference-point";

export const HikeMap = ({ startPoint, endPoint, referencesPoints, track }) => {
  const [showReferencePoints, setShowReferencePoints] = useState(false);
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  const [map, setMap] = useState(undefined);

  function handleClick(event) { event.stopPropagation() }
  function handleChange(event) { setShowReferencePoints(event.target.checked) }

  useEffect(() => {
    if (startPoint !== undefined && endPoint !== undefined) {
      setCenter([
        (startPoint.latitude + endPoint.latitude) / 2,
        (startPoint.longitude + endPoint.longitude) / 2,
      ]);
    }
  }, [endPoint, startPoint]);

  useEffect(() => {
    if (map !== undefined && map !== null) {
      map.setView(center);
    }
  }, [center, map]);
  return (
    <Container onClick={this.handleClick}>
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
              <MarkerReferencePoint point={startPoint} />
              <MarkerReferencePoint point={endPoint} />

              {
                //TODO:decide if keep or not

                showReferencePoints &&
                referencesPoints.map((point, index) => (
                  <MarkerReferencePoint
                    point={point}
                    key={point.key}
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
            onClick={handleClick}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  );
};
