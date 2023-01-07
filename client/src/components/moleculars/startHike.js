import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useState, Fragment, useEffect } from "react";
import { CardMessage } from "../atoms/card-message";
import API from "../../API";

dayjs.extend(utc);

export const StartHike = (props) => {
  const [startDateValue, setStartDateValue] = useState(
    dayjs().utc().local().format("YYYY-MM-DD")
  );
  const [endDateValue, setEndDateValue] = useState(
    dayjs().utc().local().format("YYYY-MM-DD")
  );
  const [startTimeValue, setStartTimeValue] = useState(
    dayjs().utc().local().format("HH:mm")
  );
  const [endTimeValue, setEndTimeValue] = useState(
    dayjs().utc().local().format("HH:mm")
  );

  useEffect(() => {
    if (true)
      API.getLastRecordedHike().then((elem) => {
       /*if(startDateTime) {
        if(endDateTime) {

        } else {}
       } else {}
       */
      });
  }, []);

  let form = props.form;

  const [hikeStarted, setHikeStarted] = useState(false);
  const [hikeEnded, setHikeEnded] = useState(false);
  const [showAlert, setShowAlert] = useState('');
  const [dateTimeStart, setdateTimeStart] = useState('');
  const [dateTimeEnd, setdateTimeEnd] = useState('');

  function handleStartHike(event) {
    event.preventDefault();
    setdateTimeStart(startDateValue.concat('T', startTimeValue));
    //debug
    console.log(startDateValue);
    console.log(startTimeValue);
    console.log(dateTimeStart);

    let formData =
        {
          'recordType': 'start',
          'dateTime': dateTimeStart,
        }

        API.recordHike(formData)
            .then(() => { setHikeStarted(true); })
            .catch((err) => {
            });
  }

  function handleEndHike(event) {
    event.preventDefault();
    setHikeEnded(true);
    setdateTimeEnd(endDateValue.concat('T', endTimeValue));
    //debug
    console.log(endDateValue);
    console.log(endTimeValue);
    console.log(dateTimeEnd);

    let formData =
        {
          'recordType': 'end',
          'dateTime': dateTimeEnd,
        }

        API.recordHike(formData)
            .then(() => { setShowAlert("success") })
            .catch((err) => {
            });
  }

  const component =
    form === "success" ? (
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
                        type="submit"
                        onClick={() => { form = "" }}
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
                    { /*<Col className="justify-content-center">
                      <Button
                        className="w-100 px-0"
                        variant="primary"
                        type="submit"
                        onClick={() => setHikeStarted(false)}
                      >
                        Modify
                      </Button>
                    </Col> */
                    }
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
                            onClick={ () => { setHikeStarted(false) }}
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
                    { /*<Col className="justify-content-center">
                      <Button
                        className="w-100 px-0"
                        variant="primary"
                        type="submit"
                        onClick={() => setHikeEnded(false)}
                      >
                        Modify
                      </Button>
                    </Col>*/ }
                  </Row>
                </>
              )}
            </Row>
          </Form>
          { showAlert === "success" ?
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
    ) : (
      ""
    );

  return component;
};
