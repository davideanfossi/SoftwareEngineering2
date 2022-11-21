import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ChevronCompactDown, ChevronCompactUp } from "react-bootstrap-icons";
import API from "../../API";
import { HikeMap } from "./hike-map";

export const HikeRow = ({ hike, even, isLogged = true }) => {
  const [dropped, setDropped] = useState(false);
  const [startPoint, setStartPoint] = useState({
    coordinates: [45.0702899, 7.6348208],
  });
  const [endPoint, setEndPoint] = useState({
    coordinates: [45.0702899, 7.6348208],
  });
  const [referencesPoints, setReferencePoints] = useState([]);
  const [track, setTrack] = useState([]);

  const toggleDrop = () => {
    setDropped((prev) => !prev);
  };

  useEffect(() => {
    if (isLogged && dropped) {
      API.getHikeDetails(hike.id).then((elem) => {
        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
        setReferencePoints(elem.referencePoints);
        setTrack(elem.track);
      });
    }
  }, [dropped, hike.id, isLogged]);

  return (
    <Row className={even ? "hike-row-even" : "hike-row"}>
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
                  <Col className="fw-bold">Title:</Col>
                </Row>
                <Row>
                  <Col className={dropped ? "" : "text-truncate"}>
                    {hike.title}
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
                  <Col className="fw-bold">Length:</Col>
                </Row>
                <Row>
                  <Col>{hike.lenght}m</Col>
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
                  <Col className="fw-bold">Time:</Col>
                </Row>
                <Row>
                  <Col>{hike.expectedTime}min</Col>
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
                  <Col className="fw-bold">Ascent:</Col>
                </Row>
                <Row>
                  <Col>{hike.ascent}m</Col>
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
                  <Col className="fw-bold">Difficulty:</Col>
                </Row>
                <Row>
                  <Col className={dropped ? "" : "text-truncate"}>
                    {hike.difficult}
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
                    {hike.description}
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
          {dropped && (
            <Row>
              <Col
                className="d-flex justify-content-center align-items-center my-3"
                xs={12}
              >
                {isLogged ? (
                  <HikeMap
                    startPoint={startPoint}
                    endPoint={endPoint}
                    referencesPoints={referencesPoints}
                    track={track}
                  />
                ) : (
                  "Log in to see more info"
                )}
              </Col>
            </Row>
          )}
        </Container>
      </Col>
    </Row>
  );
};
