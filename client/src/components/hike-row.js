import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ChevronCompactDown, ChevronCompactUp } from "react-bootstrap-icons";
export const HikeRow = ({ hike, even }) => {
  const [dropped, setDropped] = useState(false);

  const toggleDrop = () => {
    setDropped((prev) => !prev);
  };
  return (
    <Row className={even ? "hike-row-even" : "hike-row"}>
      <Col>
        <Container>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={4}
              md={2}
            >
              {hike.title}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={2}
              md={1}
            >
              {hike.lenght}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={2}
              md={1}
            >
              {hike.expectedTime}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={2}
              md={1}
            >
              {hike.ascent}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={4}
              md={2}
            >
              {hike.difficult}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={6}
              md={4}
            >
              {hike.description}
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3"
              xs={2}
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
            <Row style={{ height: 100 }}>
              <Col
                className="d-flex justify-content-center align-items-center my-3"
                xs={12}
              >
                Log in to see more info
              </Col>
            </Row>
          )}
        </Container>
      </Col>
    </Row>
  );
};
