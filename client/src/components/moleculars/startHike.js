import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useState, Fragment, useEffect } from "react";
import { CardMessage } from "../atoms/card-message";
import API from "../../API";

dayjs.extend(utc);

export const StartHike = (props) => {
  const [startDateValue, setStartDateValue] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDateValue, setEndDateValue] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [startTimeValue, setStartTimeValue] = useState(
    dayjs().format("HH:mm")
  );
  const [endTimeValue, setEndTimeValue] = useState(
    dayjs().format("HH:mm")
  );

  const [hikeStartDateTime, setHikeStartDateTime] = useState(
    ""
  );

  const [hikeStarted, setHikeStarted] = useState(false);
  const [hikeEnded, setHikeEnded] = useState(false);
  const [showAlert, setShowAlert] = useState('');

  useEffect(() => {
    API.getLastRecordedHike(props.hikeId).then((hike) => {
      if (hike.startDateTime) {

        if (hike.endDateTime) {
          setHikeEnded(false);
          setHikeStarted(false);
        } else {
          setHikeStartDateTime(hike.startDateTime);
          setHikeStarted(true);
          setHikeEnded(false);
        }
      } else {
        setHikeStarted(false);
      }
    })
      .catch((err) => {
        setHikeStarted(false);
        setHikeEnded(false);
      });
  }, [props.hikeId, hikeStartDateTime]);

  function handleStartHike(event, now = false) {
    event.preventDefault();
    let dateTime;
    if (now)
      dateTime = dayjs().utc().format();
    else
      dateTime = dayjs(startDateValue.concat('T', startTimeValue)).utc().format();
    let formData =
    {
      'type': 'start',
      'dateTime': dateTime,
    }

    API.recordHike(props.hikeId, formData)
      .then(() => {
        setHikeStarted(true);
        setHikeStartDateTime(dateTime);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEndHike(event, now = false) {
    event.preventDefault();
    let dateTime;
    if (now)
      dateTime = dayjs().utc().format();
    else
      dateTime = dayjs(endDateValue.concat('T', endTimeValue)).utc().format();
    let formData =
    {
      'type': 'end',
      'dateTime': dateTime,
    }

    API.recordHike(props.hikeId, formData)
      .then(() => { setShowAlert("success"); setHikeEnded(true); })
      .catch((err) => {
        console.log(err);
      });
  }

  const component =
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
                      onClick={(event) => handleStartHike(event, true)}
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
                        max={new Date()}
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
                      type="submit"
                      onClick={() => { props.handleCancel() }}
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
                    Hike started in {dayjs(hikeStartDateTime).format("YYYY-MM-DD")} at {dayjs(hikeStartDateTime).format("HH:mm")}
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
                      onClick={(event) => handleEndHike(event, true)}
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
                          onClick={() => { setHikeStarted(false) }}
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
                </Row>
              </>
            )}
          </Row>
        </Form>
        {showAlert === "success" ?
          <>
            <CardMessage
              className="text-center w-100 justify-content-center my-1 mx-0"
              title="Congratulation, you terminated this hike!"
              //subtitle={"You spent" + { dayjs(dateTimeEnd).diff(dayjs(dateTimeStart), "minutes")} + "minutes"}
              bgVariant={"success"}
              textVariant={"white"}
            />
          </>
          :
          <></>
        }
      </Container>
    </Fragment>

  return component;
};
