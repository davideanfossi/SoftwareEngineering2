import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import AutocompleteGeoInputStreet from "../atoms/autocomplete-geo-inputs-street";
import { ParkingMap } from "../atoms/parking-map";
import API from "../../API";

function ParkingForm() {
    // Form state
    const [success, setSuccess] = useState('0');
    const [coordSelector, setCoordSelector] = useState(false);
    const [name, setName] = useState('');
    const [parkingSpot, setParkingSpot] = useState('');
    const [altitude, setAltitude] = useState('');
    const [freeSpot, setFreeSpot] = useState(false);
    const [file, setFile] = useState('');
    const [update, setUpdate] = useState(true);

    const [selectedPosition, setSelectedPosition] = useState(undefined);
    const [lat, setLat] = useState(45.0702899); //it is Turin!
    const [lon, setLon] = useState(7.6348208);

    const ref = useRef();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLon(pos.coords.longitude);
        })
    }, []);

    useEffect(() => {
        API.getAltitudeFromCoordinates(lat, lon)
        .then((res) => {
          setAltitude(res.elevation);
        })
        .catch((err) => setAltitude(''));
    }, [lat, lon]);

    const [zoom, setZoom] = useState(10);
    const handleSave = (lat, lon, zoom) => {
        setLat(lat);
        setLon(lon);
        setZoom(zoom);
    };

    const handleInputMehtod = () => {
        setCoordSelector(current => !current);
    }

    useEffect(() => {
        if (selectedPosition !== undefined) {
            setLat(selectedPosition.lat);
            setLon(selectedPosition.lon);
            setZoom(10);
            setUpdate(true);
        }
    }, [selectedPosition]);

    useEffect(() => {
        if (update) setUpdate(false);
    }, [update]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let flag = false;

        let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&zoom=16';
        let address = await fetch(url)
            .then(response => response.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => data.getElementsByTagName("reversegeocode")[0].getElementsByTagName("result")[0].innerHTML)
            .catch(err => console.log(err));

        if (name === '') { setName(null); flag = true; }
        if (parkingSpot === '' || !(parseInt(parkingSpot) >= 0)) { setParkingSpot(null); flag = true; }
        if (altitude === '' || !(parseInt(altitude) >= 0)) { setAltitude(null); flag = true; }
        if (flag) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('numSpots', parkingSpot);
        formData.append('hasFreeSpots', freeSpot);
        formData.append('longitude', lon);
        formData.append('latitude', lat);
        formData.append('altitude', altitude);
        formData.append('pointLabel', null);
        formData.append('address', address);
        if (file !== "")
            formData.append('image', file);
        API.newParking(formData)
            .then(() => {
                setName('');
                setParkingSpot('');
                setAltitude('');
                setFreeSpot(false);
                setFile('');
                ref.current.value = null;
                setSuccess('yes');
            })
            .catch(() => {
                setSuccess('no');
            })
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
                <Form onSubmit={handleSubmit}>
                    <>
                        {coordSelector ?
                            <>
                                <Row>
                                    <Col>
                                        <AutocompleteGeoInputStreet
                                            selectedPosition={selectedPosition}
                                            setSelectPosition={setSelectedPosition}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <ParkingMap
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
                            :
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Latitude *</Form.Label>
                                        <Form.Control
                                            isInvalid={lat === null || lat === '' || parseFloat(lat) < 0 || parseFloat(lat) > 90}
                                            type='number' step={"any"}
                                            placeholder="latitude of parking position"
                                            value={lat == null ? '' : lat}
                                            onChange={event => { setLat(event.target.value); }} />
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Latitude format
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md className="align-items-center">
                                    <Form.Group>
                                        <Form.Label>Longitude *</Form.Label>
                                        <Form.Control
                                            isInvalid={lon === null || lon === '' || parseFloat(lon) < 0 || parseFloat(lon) > 90}
                                            type='number' step={"any"}
                                            placeholder="longitude of parking position"
                                            value={lon == null ? '' : lon}
                                            onChange={event => { setLon(event.target.value); }} />
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Longitude Format
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                    </>

                    <div className="d-flex justify-content-center align-items-right">
                        <Button className="mt-2"
                            variant="primary"
                            onClick={() => {
                                handleInputMehtod();
                                handleSave(lat, lon, zoom);
                            }}
                        > {coordSelector ? "Set coordinates" : "Use map"}
                        </Button>
                    </div>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>Name *</Form.Label>
                            <Form.Control isInvalid={name === null}
                                type="text"
                                placeholder="Name"
                                value={name == null ? '' : name}
                                onChange={event => { setName(event.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                Name can't be empty
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="align-items-center pt-2">
                            <Col >
                                <Form.Group>
                                    <Form.Label>Number of Parking Spot *</Form.Label>
                                    <Form.Control isInvalid={parkingSpot === null || parkingSpot < 0}
                                        type="number"
                                        placeholder="Number of parking spot"
                                        value={parkingSpot == null ? '' : parkingSpot}
                                        onChange={event => { setParkingSpot(event.target.value); }} />
                                    <Form.Control.Feedback type="invalid">
                                        Number of parking Spot needs to be a number greater than 0
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md className="align-items-center">
                                <Form.Group>
                                    <Form.Label>Altitude *</Form.Label>
                                    <Form.Control
                                        isInvalid={altitude === null || altitude < 0}
                                        type="number"
                                        placeholder="Altitude"
                                        value={altitude == null ? '' : altitude}
                                        onChange={event => { setAltitude(event.target.value); }}
                                        />
                                    <Form.Control.Feedback type="invalid">
                                        Altitude number must be greater than 0
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Col className="align-items-center pt-2">
                            <Form.Group className="ms-3 mt-2">
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
                            <Form.Label>Image of the Parking</Form.Label>
                            <Form.Control type="file"
                                ref={ref}
                                placeholder="img file"
                                onChange={event => {
                                    setFile(event.target.files[0]);
                                }} />
                        </Form.Group>

                    </Row>
                    <Button type="submit" variant="warning">
                        Submit
                    </Button>
                </Form>
            </Container>
        </Container>
    );
}

export { ParkingForm };