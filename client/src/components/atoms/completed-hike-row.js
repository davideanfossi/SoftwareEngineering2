import { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { SimpleBarChart } from "./bar-chart";

export const CompletedHikeRow = ({ recordedHike, even }) => {
  const [dropped, setDropped] = useState(false);
  const data = useMemo(
    () => [
      {
        type: "actualTime",
        value: recordedHike.duration,
      },
      { type: "expectedTime", value: recordedHike.hike.expectedTime },
    ],
    [recordedHike.duration, recordedHike.hike.expectedTime]
  );

  const toggleDrop = () => {
    setDropped((prev) => !prev);
  };
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
                    {recordedHike.hike.title}
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
                  <Col>{recordedHike.hike.length}m</Col>
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
                  <Col>{recordedHike.hike.expectedTime}min</Col>
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
                  <Col>{recordedHike.hike.ascent}m</Col>
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
                    {recordedHike.hike.difficulty}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={6}
              sm={3}
              md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Start time:</Col>
                </Row>
                <Row>
                  <Col>
                    {recordedHike.startDateTime.format("D MMMM YYYY HH:mm")}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              xs={6}
              sm={3}
              md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">End time:</Col>
                </Row>
                <Row>
                  <Col>
                    {recordedHike.endDateTime.format("D MMMM YYYY HH:mm")}
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
                  <SimpleBarChart data={data} xKey="type" yKey="value" />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </Col>
    </Row>
  );
};
