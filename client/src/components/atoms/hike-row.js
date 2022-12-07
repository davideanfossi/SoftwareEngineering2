import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ChevronCompactDown, ChevronCompactUp } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import API from "../../API";
import { UserContext } from "../../context/user-context";
import { HikeMap } from "./hike-map";

export const HikeRow = ({ hike, even, isUserHike = false }) => {
  const userContext = useContext(UserContext);
  const isLogged = ["Hiker", "Local Guide"].includes(userContext.user.role);
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
  const navigate=useNavigate();

  const toggleDrop = () => {
    setDropped((prev) => !prev);
  };

  useEffect(() => {
    if (isLogged && dropped) {
      API.getHikeDetails(hike).then((elem) => {
        console.log(elem);
        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
        setReferencePoints(elem.referencePoints);
        setTrack(elem.track);
      });
    }
  }, [dropped, hike, isLogged]);

  return (
    <Row className={even ? "hike-row-even" : "hike-row"}>
      <Col>
        <Container fluid onClick={toggleDrop}>
          <Row style={{ cursor: "pointer" }}>
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
          </Row>
          {dropped && (
            <>
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
                    <>
                      <Link to="/login">Log in</Link>&nbsp; to see more info
                    </>
                  )}
                </Col>
              </Row>
              {isUserHike && (
                <Row>
                  <Col
                    className="d-flex justify-content-center align-items-center my-3"
                    xs={12}
                  >
                    <Button
                      onClick={() => navigate("/link-start-end/" + hike.id)}
                    >
                      Link start/end point
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Container>
      </Col>
    </Row>
  );
};
