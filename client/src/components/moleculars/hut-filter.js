import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import API from "../../API";
import { MapModal } from "./map-modal";
import { MultiRangeSlider } from "../atoms/multi-range-slider/multi-range-slider";

export const HutFilter = ({
  handleServerResponse,
  handleServerResponseChangePage,
  pageSize,
  pageNumber,
}) => {
  const [radius, setRadius] = useState(0);
  const [lat, setLat] = useState(45.0702899); //it is Turin!
  const [lon, setLon] = useState(7.6348208);
  const [zoom, setZoom] = useState(6);
  const [minNumOfBeds, setMinNumOfBeds] = useState(0);
  const [maxNumOfBeds, setMaxNumOfBeds] = useState(100);
  const [minAltitude, setMinAltitude] = useState(0);
  const [maxAltitude, setMaxAltitude] = useState(100);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [webSite, setWebSite] = useState("");
  //const [minExpectedTime, setMinExpectedTime] = useState(0);
  //const [maxExpectedTime, setMaxExpectedTime] = useState(100);
  //const [difficulty, setDifficulty] = useState(-1);

  const [absoluteMaxLength, setAbsoluteMaxLength] = useState(100);
  const [absoluteMaxHeight, setAbsoluteMaxHeight] = useState(100);
  const [absoluteMaxExpectedTime, setAbsoluteExpectedTime] = useState(100);
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);

  const [show, setShow] = useState(false);

  //   useEffect(() => {
  //     API.getHikesLimits()
  //       .then((limits) => {
  //         setMaxNumOfBeds(limits.maxNumOfBeds);
  //         setMaxAltitude(limits.maxAscent);
  //         setMaxExpectedTime(limits.maxExpectedTime);
  //         setAbsoluteMaxLength(limits.maxNumOfBeds);
  //         setAbsoluteMaxHeight(limits.maxAscent);
  //         setAbsoluteExpectedTime(limits.maxExpectedTime);
  //         setDifficulties(limits.difficultyType);
  //         navigator.geolocation.getCurrentPosition(function (position) {
  //           //evaluate if do it in a dedicated useEffect
  //           setLat(position.coords.latitude);
  //           setLon(position.coords.longitude);
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);

  //this handle the change of a filter so it will set the pageNuber to 1
  useEffect(() => {
    API.getFilteredHut(
      minNumOfBeds,
      maxNumOfBeds,
      lat,
      lon,
      radius,
      pageNumber,
      pageSize,
      minAltitude,
      maxAltitude
    )
      .then((huts) => handleServerResponse(huts))
      .catch((err) => console.log(err));
  }, [
    maxAltitude,
    maxNumOfBeds,
    minAltitude,
    minNumOfBeds,
    radius,
    lat,
    lon,
    name,
    description,
    phone,
    email,
    webSite
  ]);

  //this handle the page change
  useEffect(() => {
    API.getFilteredHut(
      minNumOfBeds,
      maxNumOfBeds,
      lat,
      lon,
      radius,
      pageNumber,
      pageSize,
      minAltitude,
      maxAltitude
    )
      .then((hikes) => handleServerResponseChangePage(hikes))
      .catch((err) => console.log(err));
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
            <Col>
              <Form.Label
                aria-label="Default select example">Name </Form.Label>
              <Form.Control type="text" placeholder="Name of the hut"
                value={name}
                onChange={(event) => setName(event.target.value)} />

            </Col>
            <Col xs={12} md={4}>
              <div>Number of beds</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxLength}
                minVal={minNumOfBeds}
                maxVal={maxNumOfBeds}
                setMinVal={setMinNumOfBeds}
                setMaxVal={setMaxNumOfBeds}
              />
            </Col>
            <Col xs={12} md={4}>
              <div>Altitude</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxHeight}
                minVal={minAltitude}
                maxVal={maxAltitude}
                setMinVal={setMinAltitude}
                setMaxVal={setMaxAltitude}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-center align-items-center mt-3"
            >
              <Button className="w-100" variant="primary" onClick={handleShow}>
                Select location
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
