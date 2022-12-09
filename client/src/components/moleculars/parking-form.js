import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import AutocompleteGeoInput from "../atoms/autocomplete-geo-input";
import { FilterMap } from "../atoms/filter-map";
import { MapModal } from "./map-modal";
import API from "../../API";

function ParkingForm() {
    // Form state
    const [success, setSuccess] = useState('');

    const [name, setName] = useState('');
    const [parkingSpot, setParkingSpot] = useState('');
    const [evCharge, setEvCharge] = useState(false);
    const [freeSpot, setFreeSpot] = useState(false);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');
    const [update, setUpdate] = useState(true);

    const ref = useRef();


    const [selectedPosition, setSelectedPosition] = useState(undefined);
    const [radius, setRadius] = useState(1);
    const [lat, setLat] = useState(45.0702899); //it is Turin!
    const [lon, setLon] = useState(7.6348208);
    const [zoom, setZoom] = useState(6);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = (lat, lon, radius, zoom) => {
        setLat(lat);
        setLon(lon);
        setRadius(radius);
        setZoom(zoom);
    };


    useEffect(() => {
        if (selectedPosition !== undefined) {
          setLat(selectedPosition.lat);
          setLon(selectedPosition.lon);
          setRadius(1);
          setZoom(10);
          setUpdate(true);
        }
      }, [selectedPosition]);

      useEffect(() => {
        if (update) setUpdate(false);
      }, [update]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let flag = false;

        if (name === '') { setName(null); flag = true; }
        if (parkingSpot === '' || !(parseInt(parkingSpot) >= 0)) { setParkingSpot(null); flag = true; }
        //if (evCharge === '') { setEvCharge(false); flag = true; }
        //if (freeSpot === '') { setFreeSpot(false); flag = true; }
        if (description === '') { setDescription(null); flag = true; }
        //if (file === '') {setFile(null); flag=true;}

        if (flag) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('parkingSpot', parkingSpot);
        formData.append('evCharge', evCharge);
        formData.append('freeSpot', freeSpot);
        formData.append('description', description);

        /*
          API.newParking(formData)
          .then(() => {
            setName('');
            setParkingSpot('');
            setEvCharge('');
            
            ref.current.value=null;
    
            setSuccess('yes');
          })
          .catch(() => {
            setSuccess('no');
          })
        */
    };


    return (
        <Container fluid style={{ "padding": "0", "margin": "0px" }}>
            <Row className="text-center" style={{ "paddingLeft": "0.7rem" }}>
                <b style={{ "fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem" }}>Insert Parking</b>
            </Row>

            {
                success === "yes" ?
                    <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                        <Alert.Heading>Parking inserted correctly!</Alert.Heading>
                    </Alert>
                    :
                    <>{
                        success === "no" ?
                            <Alert variant="danger" onClose={() => setSuccess('')} dismissible>
                                <Alert.Heading>Error, parking not inserted!</Alert.Heading>
                            </Alert> : null
                    }</>
            }


            <Container className="border border-4 rounded" style={{ "marginTop": "0.5rem", "padding": "1rem" }}>
                <Form noValidate onSubmit={handleSubmit}>
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

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control isInvalid={name === null}
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={event => { setName(event.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                Name cant be empty
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* <Form.Group>
                            <MapModal
                                show={show}
                                handleClose={handleClose}
                                handleSave={handleSave}
                                startingLat={lat}
                                startingLon={lon}
                                startingRadius={radius}
                                startingZoom={zoom}
                            />
                        </Form.Group> */}

                        <Row className="align-items-center pt-2">
                            <Col >
                                <Form.Group>
                                    <Form.Label>Number of Parking Spot</Form.Label>
                                    <Form.Control isInvalid={parkingSpot === null}
                                        type="text"
                                        placeholder="number of parking spot"
                                        value={parkingSpot}
                                        onChange={event => { setParkingSpot(event.target.value); }} />
                                    <Form.Control.Feedback type="invalid">
                                        Number of parking Spot needs to be a number greater than 0
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md className="align-items-center">
                            </Col>
                        </Row>
                        <Col className="align-items-center pt-2">
                            <Form.Group className="ms-3 mt-2">
                                <Row >
                                    <Form.Check
                                        type="switch"
                                        id="ev-switch"
                                        label="electric veichle charging"
                                        onChange={event => { setEvCharge(event.target.checked.valueOf()); }}
                                    />
                                </Row>

                                <Row className="mt-1">
                                    <Form.Check
                                        type="switch"
                                        id="free-switch"
                                        label="free parking spots"
                                        onChange={event => { setFreeSpot(event.target.checked.valueOf()); }}
                                    />
                                </Row>
                            </Form.Group>
                        </Col>
                        <Form.Group style={{ "paddingTop": "12px" }}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control isInvalid={description === null}
                                type="text"
                                placeholder="Insert useful information for Hikers"
                                value={description}
                                onChange={event => { setDescription(event.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                Description cant be empty
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group style={{ "paddingTop": "12px" }}>
                            <Form.Label>Image of the Parking</Form.Label>
                            <Form.Control type="file"
                                ref={ref}
                                placeholder="img file"
                                onChange={event => {
                                    setFile(event.target.files[0]);
                                }} />
                        </Form.Group>

                    </Row>
                    <Button type="submit" style={{ "marginTop": "12px", "backgroundColor": 'blue', "borderColor": 'blue' }}>Submit</Button>
                </Form>
            </Container>
        </Container>
    );
}

export { ParkingForm };