import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import AutocompleteGeoInputStreet from "../atoms/autocomplete-geo-inputs-street";
import { ParkingMap } from "../atoms/parking-map";
import API from "../../API";

function HutForm() {
    // Form state
    const [success, setSuccess] = useState('0');
    const [coordSelector, setCoordSelector] = useState(false);
    const [name, setName] = useState('');
    const [numberBeds, setNumberBeds] = useState('');
    const [altitude, setAltitude] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [file, setFile] = useState('');
    const [update, setUpdate] = useState(true);

    const ref = useRef();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLon(pos.coords.longitude);
        })
    }, [])

    const [selectedPosition, setSelectedPosition] = useState(undefined);
    const [lat, setLat] = useState(45.0702899); //it is Turin!
    const [lon, setLon] = useState(7.6348208);
    const [zoom, setZoom] = useState(6);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        let flag = false;
        
        if (name === '') { setName(null); flag = true; }
        if (phone === '') { setPhone(null); flag = true; }
        if (email === '') { setEmail(null); flag = true; }
        if (numberBeds === '' || !(parseInt(numberBeds) >= 0)) { setNumberBeds(null); flag = true; }
        if (altitude === '' || !(parseInt(altitude) >= 0)) { setAltitude(null); flag = true; }
        //if (description === '') { setDescription(''); flag = true; }
        //if (file === '') {setFile(null); flag=true;}
        if (flag) return;
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('latitude', lat);
        formData.append('longitude', lon);
        formData.append('altitude', altitude);
        formData.append('phoneNumber', phone);
        formData.append('email', email);
        formData.append('website', website);
        formData.append('numOfBeds', numberBeds);
        formData.append('description', description);
        if(file!=="") formData.append('file', file);

        
        API.newHut(formData)
            .then(() => {
                setName('');
                setLat('');
                setLon('');
                setAltitude('');
                setPhone('');
                setEmail('');
                setWebsite('');
                setNumberBeds('');
                setDescription('');
                
                ref.current.value=null;

                setSuccess('yes');
            })
            .catch(() => {
                setSuccess('no');
            })
        
    };


    return (
        <Container fluid style={{ "padding": "0", "margin": "0px" }}>
            <Row className="text-center" style={{ "paddingLeft": "0.7rem" }}>
                <b style={{ "fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem" }}>Insert Hut</b>
            </Row>

            {
                success === "yes" ?
                    <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                        <Alert.Heading>Hut inserted correctly!</Alert.Heading>
                    </Alert>
                    :
                    <>{
                        success === "no" ?
                            <Alert variant="danger" onClose={() => setSuccess('')} dismissible>
                                <Alert.Heading>Error, Hut not inserted!</Alert.Heading>
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
                                            isInvalid={lat === null || parseFloat(lat) < 0 || parseFloat(lat) > 90}
                                            type='number' step={"any"}
                                            placeholder="latitude of hut position"
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
                                            isInvalid={lon === null || parseFloat(lon) < 0 || parseFloat(lon) > 90}
                                            type='number' step={"any"}
                                            placeholder="longitude of hut position"
                                            value={lon == null ? '' : lon}
                                            onChange={event => { setLon(event.target.value); }} />
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Longitude Format
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md className="align-items-center">
                                    <Form.Group>
                                        <Form.Label>Altitude *</Form.Label>
                                        <Form.Control
                                            isInvalid={altitude === null || parseFloat(altitude) < 0}
                                            type='number' step={"any"}
                                            placeholder="altitude of hut position"
                                            value={altitude == null ? '' : altitude}
                                            onChange={event => { setAltitude(event.target.value); }} />
                                        <Form.Control.Feedback type="invalid">
                                            Invalid altitude Format
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                    </>

                    <div className="d-flex justify-content-center align-items-right">
                        <Button style={{ "marginTop": "8px" }}
                            variant="primary"
                            onClick={() => {
                                handleInputMehtod();
                                handleSave(lat, lon, zoom);
                                console.log(lat, lon, zoom);
                            }}
                        > {coordSelector ? "Use coordinates" : "Use map"}
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
                                    <Form.Label>Number of Beds *</Form.Label>
                                    <Form.Control isInvalid={numberBeds === null || numberBeds < 0}
                                        type="number"
                                        placeholder="number of beds"
                                        value={numberBeds == null ? '' : numberBeds}
                                        onChange={event => { setNumberBeds(event.target.value); }} />
                                    <Form.Control.Feedback type="invalid">
                                        Number of bedst needs to be a number greater than 0
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md className="align-items-center">
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Phone *</Form.Label>
                            <Form.Control isInvalid={phone === null || phone < 0}
                                type="text"
                                placeholder="phone"
                                value={phone == null ? '' : phone}
                                onChange={event => { setPhone(event.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                Phone number can't be empty
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control isInvalid={email === null || email < 0}
                                type="text"
                                placeholder="email"
                                value={email == null ? '' : email}
                                onChange={event => { setEmail(event.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                Email can't be empty
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group style={{ "paddingTop": "12px" }}>
                            <Form.Label>website</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Insert website link"
                                value={website == null ? '' : website}
                                onChange={event => { setWebsite(event.target.value); }} />
                        </Form.Group>

                        <Form.Group style={{ "paddingTop": "12px" }}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Insert useful information for Hikers"
                                value={description == null ? '' : description}
                                onChange={event => { setDescription(event.target.value); }} />
                        </Form.Group>

                        <Form.Group style={{ "paddingTop": "12px" }}>
                            <Form.Label>Image of the Hut</Form.Label>
                            <Form.Control type="file"
                                ref={ref}
                                placeholder="img file"
                                onChange={event => {
                                    setFile(event.target.files[0]);
                                }} />
                        </Form.Group>

                        {file !== '' ? 
                            <div style={{"paddingTop": "20px"}}>
                                <div className="text-center" style={{"paddingBottom": "10px"}}>
                                    <img alt="Not found" width={"250px"} src={URL.createObjectURL(file)} />
                                    </div>
                                <div className="text-center">
                                    <Button className="btn-danger" style={{"width": "250px"}} onClick={()=>{setFile(''); ref.current.value=null;}}>Remove</Button>
                                    </div>
                            </div> : null
                        }

                    </Row>
                    <Button type="submit" style={{ "marginTop": "12px", "backgroundColor": 'blue', "borderColor": 'blue' }}>
                        Submit
                    </Button>
                </Form>
            </Container>
        </Container>
    );
}

export { HutForm };