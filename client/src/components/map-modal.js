import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import AutocompleteGeoInput from "./autocomplete-geo-input/autocomplete-geo-input";
import { FilterMap } from "./filter-map/filter-map";

export const MapModal = ({
  show,
  handleClose,
  handleSave,
  startingLat,
  startingLon,
  startingRadius,
  startingZoom,
}) => {
  const [radius, setRadius] = useState(startingRadius);
  const [lat, setLat] = useState(startingLat);
  const [lon, setLon] = useState(startingLon);
  const [zoom, setZoom] = useState(startingZoom);
  const [useMap, setUseMap] = useState(startingRadius !== 0);
  const [selectedPosition, setSelectedPosition] = useState(undefined);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (selectedPosition !== undefined) {
      setLat(selectedPosition.lat);
      setLon(selectedPosition.lon);
      setUpdate(true);
    }
  }, [selectedPosition]);

  useEffect(() => {
    if (update) setUpdate(false);
  }, [update]);

  useEffect(() => {
    setRadius(useMap ? (startingRadius !== 0 ? startingRadius : 1000) : 0);
  }, [startingRadius, useMap]);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col xs={1}>
              <Form.Check
                type="switch"
                checked={useMap}
                onChange={() => setUseMap((old) => !old)}
              />
            </Col>
            <Col xs={11}>Use Map</Col>
          </Row>

          {useMap && !update && (
            <>
              <Row>
                <Col>
                  <AutocompleteGeoInput
                    selectedPosition={selectedPosition}
                    setSelectPosition={setSelectedPosition}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>Radius</div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Control value={`${radius / 1000}km`} disabled />
                </Col>
                <Col>
                  <Form.Range
                    value={radius}
                    onChange={(event) => setRadius(event.target.value)}
                    min={1000}
                    max={100000}
                    step={1000}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="d-flex justify-content-center align-items-center">
                    <FilterMap
                      radius={radius}
                      lat={lat}
                      lon={lon}
                      zoom={zoom}
                      setLat={setLat}
                      setLon={setLon}
                      setZoom={setZoom}
                    />
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSave(lat, lon, radius, zoom);
            handleClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
