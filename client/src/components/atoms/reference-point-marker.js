import { Col, Container, Row } from "react-bootstrap"
import { Marker, Popup } from "react-leaflet"
import Leaflet from "leaflet";
import HutIconUrl from "./../atoms/marker-point/marker-hut-icon.svg";

const hutIcon = Leaflet.icon({
    iconUrl: HutIconUrl,
    iconAnchor: [25, 50],
    iconSize: [50, 50],
  });

export const ReferencePointMarker = ({refPoint, idx}) => {
    return(
        refPoint.pos && (
            <Marker
            position={[refPoint.pos.lat, refPoint.pos.lng]}
            icon={hutIcon}
            >
            <Popup
                key={"refPointPopUp" + refPoint.id}
                style={{ borderRadius: 0 }}
              >
              <Container>
                  <Row>
                    <Col className="text-center fw-bold">Reference point</Col>
                  </Row>
                  <Row>
                    <Col className="text-center"># {idx}</Col>
                  </Row>
                  <Row>
                  <Col className="text-center fw-bold">Name:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{refPoint.name}</Col>
                </Row>
                <Row>
                  <Col className="text-center fw-bold">description:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{refPoint.description}</Col>
                </Row>
                </Container>
              </Popup>
              </Marker>
        )
              )
}