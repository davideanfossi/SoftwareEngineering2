import { Marker, Popup } from "react-leaflet";
import { Container, Row, Col } from "react-bootstrap";
export const MarkerReferencePoint = ({ point, isReference }) => {
  return (
    <Marker position={point.coordinates} opacity={isReference ? 0.7 : 1}>
      <Popup style={{ borderRadius: 0 }} >
        <Container>
          <Row>
            <Col className="text-center fw-bold">Name:</Col>
          </Row>
          <Row>
            <Col className="text-center">{point.name}</Col>
          </Row>
          <Row>
            <Col className="text-center fw-bold">Address:</Col>
          </Row>
          <Row>
            <Col className="text-center">{point.address}</Col>
          </Row>
        </Container>
      </Popup>
    </Marker>
  );
};
