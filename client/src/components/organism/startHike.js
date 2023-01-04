import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useState } from "react";

dayjs.extend(utc);

function StartHike(hike) {

    const startTime = dayjs.utc().local().format("YYYY-MM-DD HH:mm");
    const [terminate, setTerminate] = useState(false);

    let endTime;
    let spentTime;

    function handleSubmit() {
        endTime = dayjs.utc().local().format("YYYY-MM-DD HH:mm");
        setTerminate(true);
        spentTime = endTime.diff(startTime, 'minutes');
    }

    return(
    <>
    <Row>
      <Col>
        <Container className="border border-4 rounded" style={{ "marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white" }} fluid>
        <h1>Hike started at time {startTime}</h1>
        { terminate ? 
        <>
        <h1>Hike ended at time {endTime}</h1>
        </>
         : 
         <></> }
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
                  <Col>
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
                  <Col>
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
                  <Col>
                    {hike.description}
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className="mt-2">
            <Col className="d-flex justify-content-center">
                <Button variant='warning' type='submit' size='lg'>
                Terminate hike
                </Button>
            </Col>
            </Row>
        </Form>
        </Container>
        
      </Col>
    </Row>  
    </>
    );
}

export { StartHike }