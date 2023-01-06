import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useState, Fragment } from "react";
import { CardMessage } from "../atoms/card-message";
import API from "../../API";

dayjs.extend(utc);

export const StartHike = (props) => {
  const [startDateValue, setStartDateValue] = useState(
    dayjs.utc().local().format("YYYY-MM-DD")
  );
  const [endDateValue, setEndDateValue] = useState(
    dayjs.utc().local().format("YYYY-MM-DD")
  );
  const [startTimeValue, setStartTimeValue] = useState(
    dayjs.utc().local().format("HH:mm")
  );
  const [endTimeValue, setEndTimeValue] = useState(
    dayjs.utc().local().format("HH:mm")
  );

  const [hikeStarted, setHikeStarted] = useState(false);
  const [hikeEnded, setHikeEnded] = useState(false);

  function handleStartHike(event) {
    event.preventDefault();
    setHikeStarted(true);
    let formData =
        {
          'hikeId': 1,
          'userId': 1,
          'recordType': 'start',
          'dateTime': '',
        }

        API.recordHike(formData)
            .then(() => {})
            .catch((err) => {
            });
  }

  function handleEndHike(event) {
    event.preventDefault();
    setHikeEnded(true);
    let formData =
        {
          'hikeId': 1,
          'userId': 1,
          'recordType': 'end',
          'dateTime': '',
        }

        API.recordHike(formData)
            .then(() => {})
            .catch((err) => {
            });
  }

  const component =
    props.alert === "success" ? (
      <Fragment>
        <Container className="mt-3">
          <Form>
            <Row className="hike-row-even">
              {!hikeStarted ? (
                <>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Button
                        className="w-100 px-0"
                        variant="warning"
                        type="submit"
                        size="lg"
                        onClick={handleStartHike}
                      >
                        Start now
                      </Button>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    Or insert date and time of the beginning hike:
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Form.Group className="mb-2" controlId="startDate">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control
                          type="date"
                          value={startDateValue}
                          onChange={(ev) => setStartDateValue(ev.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2" controlId="startTime">
                        <Form.Label>Time:</Form.Label>
                        <Form.Control
                          type="time"
                          value={startTimeValue}
                          onChange={(ev) => setStartTimeValue(ev.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col>
                      <Button
                        className="w-100 px-0"
                        variant="warning"
                        type="submit"
                        onClick={handleStartHike}
                      >
                        Start hike
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        className="w-100 px-0"
                        variant="secondary"
                        type="reset"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col className="justify-content-center">
                      Hike started in {startDateValue} at {startTimeValue}
                    </Col>
                    <Col className="justify-content-center">
                      <Button
                        className="w-100 px-0"
                        variant="primary"
                        type="submit"
                        onClick={() => setHikeStarted(false)}
                      >
                        Modify
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              {!hikeEnded ? (
                <>
                  {hikeStarted ? (
                    <>
                      <Button
                        className="w-100 px-0"
                        variant="warning"
                        type="submit"
                        size="lg"
                        onClick={handleEndHike}
                      >
                        End now
                      </Button>
                      <Row className="w-100 justify-content-center my-1 mx-0">
                        Or insert date and time of the end hike:
                      </Row>
                      <Row className="w-100 justify-content-center my-1 mx-0">
                        <Col>
                          <Form.Group className="mb-2" controlId="endDate">
                            <Form.Label>Date:</Form.Label>
                            <Form.Control
                              type="date"
                              value={endDateValue}
                              onChange={(ev) =>
                                setEndDateValue(ev.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-2" controlId="endTime">
                            <Form.Label>Time:</Form.Label>
                            <Form.Control
                              type="time"
                              value={endTimeValue}
                              onChange={(ev) =>
                                setEndTimeValue(ev.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="w-100 justify-content-center my-1 mx-0">
                        <Col>
                          <Button
                            className="w-100 px-0"
                            variant="warning"
                            type="submit"
                            onClick={handleEndHike}
                          >
                            End hike
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            className="w-100 px-0"
                            variant="secondary"
                            type="reset"
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <Row className="w-100 justify-content-center my-1 mx-0">
                    <Col className="justify-content-center">
                      Hike ended in {endDateValue} at {endTimeValue}
                    </Col>
                    <Col className="justify-content-center">
                      <Button
                        className="w-100 px-0"
                        variant="primary"
                        type="submit"
                        onClick={() => setHikeEnded(false)}
                      >
                        Modify
                      </Button>
                    </Col>
                  </Row>

                  <CardMessage
                    className="text-center w-100 justify-content-center my-1 mx-0"
                    title="Congratulation, you terminated this hike!"
                    bgVariant={"success"}
                    textVariant={"white"}
                  />
                </>
              )}
            </Row>
          </Form>
        </Container>
      </Fragment>
    ) : (
      ""
    );

  return component;
};
