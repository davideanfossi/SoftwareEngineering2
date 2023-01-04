import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { MarkerReferencePoint } from "./marker-reference-point";
import { CardMessage } from './card-message';

export const HikeMap = ({ startPoint, endPoint, referencesPoints, track }) => {
  const [showReferencePoints, setShowReferencePoints] = useState(false);
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  const [map, setMap] = useState(undefined);
  const [showAlert, setShowAlert] = useState("");

  function handleClick(event) { event.stopPropagation() }
  function handleChange(event) { setShowReferencePoints(event.target.checked) }
  function handleSubmit(event) { 
    event.preventDefault();
    console.log("hike started");
    setShowAlert("success");
  }

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
    <Container onClick={handleClick}>
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
            onClick={handleClick}
            onChange={handleChange}
          />
        </Col>
      </Row>
      {
          showAlert === "success" ?
            <Row className='justify-content-center align-items-center mt-4 mb-4'>
              <CardMessage className="text-center" style={{ width: '60vw' }} title="Hike started" subtitle="To see more details:" bgVariant="success" textVariant="light" link="start-hike"/>
            </Row>
            :
            <>{
              showAlert === "error" ?
              <Row className='justify-content-center align-items-center mt-4 mb-4'>
                <CardMessage className="text-center" style={{ width: '60vw' }} title="You can't start this hike" bgVariant="danger" textVariant="light"/>
              </Row>
              : <></>
              }</>
        }
      <Form onSubmit={handleSubmit}>
        <Row className="mt-2">
          <Col className="d-flex justify-content-center">
            <Button variant='warning' type='submit' size='lg'>
              Start Hike
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
