import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useState } from "react";

dayjs.extend(utc);

export const StartHike = (alert) => {

    const startDateValue = dayjs.utc().local().format("YYYY-MM-DD");
    const endDateValue = dayjs.utc().local().format("YYYY-MM-DD");
    const startTimeValue = dayjs.utc().local().format("HH:mm");
    const endTimeValue = dayjs.utc().local().format("HH:mm");
    const [hikeStarted, setHikeStarted] = useState(false);
    const [hikeEnded, setHikeEnded] = useState(false);
    let alert2 = "success";

  function handleStartHike(event) {
    event.preventDefault();
    setHikeStarted(true);
    console.log("Hike started");
  }
  function handleEndHike(event) {
    event.preventDefault();
    setHikeEnded(true);
  }

  return(
    <>
      <Container className='mt-3'>
        {
          alert2 === "success" ?
          <>
            <Form>
              <Row className="hike-row-even">
              {
                !hikeStarted ?
                <>
                  <Row  className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Button className="w-100 px-0" variant='warning' type="submit" size="lg" onClick={handleStartHike}>
                        Start now
                      </Button>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    Or insert date and time of the beginning hike:
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Form.Group className='mb-2' controlId='date'>
                        <Form.Label>Date:</Form.Label>
                          <Form.Control
                            type="date"
                            value={startDateValue}
                            />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className='mb-2' controlId='time'>
                        <Form.Label>Time:</Form.Label>
                          <Form.Control
                            type="time"
                            value={startTimeValue}
                          />
                        </Form.Group>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Button className="w-100 px-0" variant='warning' type='submit' onClick={handleStartHike}>
                        Confirm
                      </Button>
                    </Col>
                    <Col>
                      <Button className="w-100 px-0" variant='secondary' type='reset'>
                        Cancel
                      </Button>
                    </Col>
                  </Row> 
                </>       
                :
                <>
                  <Row  className="w-100 justify-content-center my-1 mx-0">
                    Hike started in { startDateValue } at { startTimeValue }
                  </Row>
                  { !hikeEnded ?
                    <>
                    <Button className="w-100 px-0" variant='warning' type="submit" size="lg" onClick={handleEndHike}>
                        Terminate Hike
                    </Button>
                    <Row className="w-100 justify-content-center my-1 mx-0">
                    Or insert date and time of the end hike:
                    </Row>
                    <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Form.Group className='mb-2' controlId='date'>
                        <Form.Label>Date:</Form.Label>
                          <Form.Control
                            type="date"
                            value={endDateValue}
                            />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className='mb-2' controlId='time'>
                        <Form.Label>Time:</Form.Label>
                          <Form.Control
                            type="time"
                            value={endTimeValue}
                          />
                        </Form.Group>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Button className="w-100 px-0" variant='warning' type='submit' onClick={handleEndHike}>
                        Confirm
                      </Button>
                    </Col>
                    <Col>
                      <Button className="w-100 px-0" variant='secondary' type='reset'>
                        Cancel
                      </Button>
                    </Col>
                  </Row> 
                    </>
                    :
                    <>
                    <Row  className="w-100 justify-content-center my-1 mx-0">
                      Hike ended in { endDateValue } at { endTimeValue }
                    </Row>
                    </>
                  }
                </> 
              } 
              </Row>
            </Form>
          </>
          : 
          <></>
        }
        </Container>
        </>
    );
};