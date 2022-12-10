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
  getLimits,
}) => {
  const [radius, setRadius] = useState(0);
  const [lat, setLat] = useState(45.0702899); //it is Turin!
  const [lon, setLon] = useState(7.6348208);
  const [zoom, setZoom] = useState(6);
  const [minNumOfBeds, setMinNumOfBeds] = useState(0);
  const [maxNumOfBeds, setMaxNumOfBeds] = useState(100);
  const [hasWebSite, setHasWebSite] = useState(false);

  const [absoluteMaxNumOfBeds, setAbsoluteMaxNumOfBeds] = useState(100);

  const [show, setShow] = useState(false);

  useEffect(() => {
    getLimits()
      .then((limits) => {
        setMaxNumOfBeds(limits.maxNumOfBeds);
        setAbsoluteMaxNumOfBeds(limits.maxNumOfBeds);
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
      minNumOfBeds,
      maxNumOfBeds,
      hasWebSite,
      radius,
      lat,
      lon,
      pageSize,
      pageNumber
    )
      .then((huts) => handleServerResponse(huts))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    maxNumOfBeds,
    minNumOfBeds,
    hasWebSite,
    radius,
    lat,
    lon,
  ]);

  //this handle the page change
  useEffect(() => {
    apiCall(
      minNumOfBeds,
      maxNumOfBeds,
      hasWebSite,
      radius,
      lat,
      lon,
      pageSize,
      pageNumber
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
            <Col xs={12} md={4}>
              <div>Number of beds</div>
              <MultiRangeSlider
                min={0}
                max={absoluteMaxNumOfBeds}
                minVal={minNumOfBeds}
                maxVal={maxNumOfBeds}
                setMinVal={setMinNumOfBeds}
                setMaxVal={setMaxNumOfBeds}
              />
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-flex justify-content-center align-items-center mt-3 flex-column"
            >
              <div className="d-flex justify-content-center flex-column">
                <Form.Check
                  type="checkbox"
                  label="Must have website"
                  value={hasWebSite}
                  onChange={(event) => setHasWebSite(event.target.checked)}
                />
              </div>
            </Col>
            <Col
              xs={12}
              md={4}
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
