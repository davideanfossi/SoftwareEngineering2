import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import AutocompleteGeoInput from "../atoms/autocomplete-geo-input";
import { FilterMap } from "../atoms/filter-map";

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
  const [selectedPosition, setSelectedPosition] = useState(undefined);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (selectedPosition !== undefined) {
      setLat(selectedPosition.lat);
      setLon(selectedPosition.lon);
      setRadius(10000);
      setZoom(10);
      setUpdate(true);
    }
  }, [selectedPosition]);

  useEffect(() => {
    if (update) setUpdate(false);
  }, [update]);

  useEffect(() => {
    setRadius(startingRadius !== 0 ? startingRadius : 1000);
  }, [startingRadius]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          {!update && (
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
                    onChange={(event) => { setRadius(event.target.value);}}
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
        <Button variant="primary" onClick={() => { setRadius(0) }}>
          Cancel
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
