import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { MapModal } from "./map-modal";
import { MultiRangeSlider } from "../atoms/multi-range-slider/multi-range-slider";

export const HikeFilter = ({
  handleServerResponse,
  handleServerResponseChangePage,
  pageSize,
  pageNumber,
  apiCall,
  getLimits,
}) => {
  const [radius, setRadius] = useState(0);
  const [lat, setLat] = useState(45.0702899); //it is Turin!
  const [lon, setLon] = useState(7.6348208);
  const [zoom, setZoom] = useState(6);
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(100);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(100);
  const [minExpectedTime, setMinExpectedTime] = useState(0);
  const [maxExpectedTime, setMaxExpectedTime] = useState(100);
  const [difficulty, setDifficulty] = useState(-1);

  const [absoluteMaxLength, setAbsoluteMaxLength] = useState(100);
  const [absoluteMaxHeight, setAbsoluteMaxHeight] = useState(100);
  const [absoluteMaxExpectedTime, setAbsoluteExpectedTime] = useState(100);
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    getLimits()
      .then((limits) => {
        setMaxLength(limits.maxLength);
        setMaxHeight(limits.maxAscent);
        setMaxExpectedTime(limits.maxExpectedTime);
        setAbsoluteMaxLength(limits.maxLength);
        setAbsoluteMaxHeight(limits.maxAscent);
        setAbsoluteExpectedTime(limits.maxExpectedTime);
        setDifficulties(limits.difficultyType);
        navigator.geolocation.getCurrentPosition(function (position) {
          //evaluate if do it in a dedicated useEffect
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        });
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //this handle the change of a filter so it will set the pageNuber to 1
  useEffect(() => {
    apiCall(
      minLength,
      maxLength,
      minExpectedTime,
      maxExpectedTime,
      minHeight,
      maxHeight,
      difficulty >= 0 ? difficulties[difficulty] : "",
      radius,
      lat,
      lon,
      pageSize,
      pageNumber
    )
      .then((hikes) => handleServerResponse(hikes))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    difficulty,
    maxExpectedTime,
    maxHeight,
    maxLength,
    minExpectedTime,
    minHeight,
    minLength,
    radius,
    lat,
    lon,
  ]);

  //this handle the page change
  useEffect(() => {
    apiCall(
      minLength,
      maxLength,
      minExpectedTime,
      maxExpectedTime,
      minHeight,
      maxHeight,
      difficulty >= 0 ? difficulties[difficulty] : "",
      radius,
      lat,
      lon,
      pageSize,
      pageNumber
    )
      .then((hikes) => handleServerResponseChangePage(hikes))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber]);

  //those handler are for map modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = (lat, lon, radius, zoom) => {
    setLat(lat);
    setLon(lon);
    setRadius(radius);
    setZoom(zoom);
  };

  return (
    <>
      {show && (
        <MapModal
          show={show}
          handleClose={handleClose}
          handleSave={handleSave}
          startingLat={lat}
          startingLon={lon}
          startingRadius={radius}
          startingZoom={zoom}
        />
      )}
      <div className="hike-filter-container">
        <Container fluid>
          <Row>
            <Col xs={12} md={4}>
              <div>Length</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxLength}
                minVal={minLength}
                maxVal={maxLength}
                setMinVal={setMinLength}
                setMaxVal={setMaxLength}
              />
            </Col>
            <Col xs={12} md={4}>
              <div>Expected Time</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxExpectedTime}
                minVal={minExpectedTime}
                maxVal={maxExpectedTime}
                setMinVal={setMinExpectedTime}
                setMaxVal={setMaxExpectedTime}
              />
            </Col>
            <Col xs={12} md={4}>
              <div>Ascend</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxHeight}
                minVal={minHeight}
                maxVal={maxHeight}
                setMinVal={setMinHeight}
                setMaxVal={setMaxHeight}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Container>
                <Row>
                  <Col>
                    <div>Difficulty</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Select
                      aria-label="Default select example"
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value)}
                    >
                      <option value={-1}>Select difficulty</option>
                      {difficulties.map((difficulty, count) => (
                        <option key={count} value={count}>
                          {difficulty}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col
              xs={12}
              md={3}
              className="d-flex justify-content-center align-items-center mt-3"
            >
              <Button className="w-100" variant="primary" onClick={handleShow}>
                Select location
              </Button>
            </Col>
            <Col
            xs={12}
            md={3}
            className="d-flex justify-content-center align-items-center mt-3"
            >
            <Button className="w-100" variant="primary" onClick={ () => {
              setMinLength(0);
              setMaxLength(absoluteMaxLength);
              setMinExpectedTime(0);
              setMaxExpectedTime(absoluteMaxExpectedTime);
              setMinHeight(0);
              setMaxHeight(absoluteMaxHeight);
              setDifficulty(-1);
              }}>
                Reset filters
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
