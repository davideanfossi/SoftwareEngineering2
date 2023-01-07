import { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { SimpleBarChart } from "./bar-chart";

export const CompletedHikeRow = ({ recordeHike, even }) => {
  const [dropped, setDropped] = useState(false);
  const data = useMemo(
    () => [
      {
        type: "actualTime",
        value: recordeHike.endTime - recordeHike.startTime,
      },
      { type: "expectedTime", value: recordeHike.hike.expectedTime },
    ],
    [recordeHike.endTime, recordeHike.startTime, recordeHike.hike.expectedTime]
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
                    {recordeHike.title}
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
                  <Col>{recordeHike.lenght}m</Col>
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
                  <Col>{recordeHike.expectedTime}min</Col>
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
                  <Col>{recordeHike.ascent}m</Col>
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
                    {recordeHike.difficult}
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
                  <Col>{recordeHike.startTime}</Col>
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
                  <Col>{recordeHike.endTime}</Col>
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
