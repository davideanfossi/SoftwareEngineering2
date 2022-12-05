import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ChevronCompactDown, ChevronCompactUp } from "react-bootstrap-icons";
import API from "../../API";
import { HikeMap } from "./hike-map";

export const HutRow = ({ hut, even }) => {
  const [dropped, setDropped] = useState(false);
  const [startPoint, setStartPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  const [endPoint, setEndPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  const [referencesPoints, setReferencePoints] = useState([]);
  const [track, setTrack] = useState([]);

  const toggleDrop = () => {
    setDropped((prev) => !prev);
  };

  useEffect(() => {
    if (dropped) {
    //   API.getHikeDetails(hike).then((elem) => {
    //     console.log(elem);
    //     setStartPoint(elem.startPoint);
    //     setEndPoint(elem.endPoint);
    //     setReferencePoints(elem.referencePoints);
    //     setTrack(elem.track);
    //   });
    }
  }, [dropped, hut]);

  return (
    <Row className={even ? "hut-row-even" : "hut-row"}>
      <Col>
        <Container fluid>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={12}
              sm={4}
              md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Name:</Col>
                </Row>
                <Row>
                  <Col className={dropped ? "" : "text-truncate"}>
                    {hut.name}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={4}
              sm={2}
              md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Number of beds:</Col>
                </Row>
                <Row>
                  <Col>{hut.numberOfBeds}</Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={4}
              sm={2}
              md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Phone:</Col>
                </Row>
                <Row>
                  <Col>{hut.phone}</Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={4}
              sm={2}
              md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Email:</Col>
                </Row>
                <Row>
                  <Col>{hut.email}m</Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={12}
              sm={4}
              md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Altitude:</Col>
                </Row>
                <Row>
                  <Col className={dropped ? "" : "text-truncate"}>
                    {hut.altitude}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={12}
              sm={6}
              md={4}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Description:</Col>
                </Row>
                <Row>
                  <Col className={dropped ? "" : "text-truncate"}>
                    {hut.description}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={12}
              sm={2}
              md={1}
            >
              {dropped ? (
                <ChevronCompactUp onClick={toggleDrop} />
              ) : (
                <ChevronCompactDown onClick={toggleDrop} />
              )}
            </Col>
          </Row>
          {/* {dropped && (
            <Row>
              <Col
                className="d-flex justify-content-center align-items-center my-3"
                xs={12}
              >
                  <HikeMap
                    startPoint={startPoint}
                    endPoint={endPoint}
                    referencesPoints={referencesPoints}
                    track={track}
                  />
                
              </Col>
            </Row>
          )} */}
        </Container>
      </Col>
    </Row>
  );
};
