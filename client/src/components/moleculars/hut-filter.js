import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { MapModal } from "./map-modal";
import { MultiRangeSlider } from "../atoms/multi-range-slider/multi-range-slider";

export const HutFilter = ({
  handleServerResponse,
  handleServerResponseChangePage,
  pageSize,
  pageNumber,
  apiCall,
  getLimits
}) => {
  const [radius, setRadius] = useState(0);
  const [lat, setLat] = useState(45.0702899); //it is Turin!
  const [lon, setLon] = useState(7.6348208);
  const [zoom, setZoom] = useState(6);
  const [minNumOfBeds, setMinNumOfBeds] = useState(0);
  const [maxNumOfBeds, setMaxNumOfBeds] = useState(1000);
  const [minAltitude, setMinAltitude] = useState(0);
  const [maxAltitude, setMaxAltitude] = useState(10000);
  const [name, setName] = useState("");

  const [absoluteMaxBed, setAbsoluteMaxBed] = useState(100);
  const [absoluteMaxAltitude, setAbsoluteMaxAltitude] = useState(100);

  const [show, setShow] = useState(false);

  useEffect(() => {
    getLimits()
      .then((limits) => {
        const maxBeds = Number.parseInt(limits.maxNumOfBeds);
        const maxAlt = Number.parseInt(limits.maxAltitude);
        setMaxNumOfBeds(maxBeds !== 0 ? maxBeds : 100);
        setMaxAltitude(maxAlt !== 0 ? maxAlt : 100);
        setAbsoluteMaxBed(maxBeds !== 0 ? maxBeds : 100);
        setAbsoluteMaxAltitude(maxAlt !== 0 ? maxAlt : 100);
      })
      .catch((err) => console.log(err));
  }, [getLimits]);

  //this handle the change of a filter so it will set the pageNuber to 1
  useEffect(() => {
    apiCall(
      minNumOfBeds,
      maxNumOfBeds,
      lat,
      lon,
      radius,
      pageNumber,
      pageSize,
      minAltitude,
      maxAltitude,
      name
    )
      .then((huts) => handleServerResponse(huts))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAltitude, minAltitude, maxNumOfBeds, minNumOfBeds, radius, lat, lon, name]);

  //this handle the page change
  useEffect(() => {
    apiCall(
      minNumOfBeds,
      maxNumOfBeds,
      lat,
      lon,
      radius,
      pageNumber,
      pageSize,
      minAltitude,
      maxAltitude,
      name
    )
      .then((huts) => handleServerResponseChangePage(huts))
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
      <div className="hut-filter-container">
        <Container fluid>
          <Row>
            <Col xs={12} md={6}>
              <div>Number of beds</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxBed}
                minVal={minNumOfBeds}
                maxVal={maxNumOfBeds}
                setMinVal={setMinNumOfBeds}
                setMaxVal={setMaxNumOfBeds}
              />
            </Col>
            <Col xs={12} md={6}>
              <div>Altitude (m) </div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxAltitude}
                minVal={minAltitude}
                maxVal={maxAltitude}
                setMinVal={setMinAltitude}
                setMaxVal={setMaxAltitude}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Label aria-label="Default select example">Name </Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of the hut"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Col>
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
