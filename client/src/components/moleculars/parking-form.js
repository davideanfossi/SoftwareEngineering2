import { useState, useRef } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
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

    const ref = useRef();

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
                                        Number of parkingSpot needs to be a number greater than 0
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md className="align-items-center">
                            </Col>
                        </Row>
                        <Col  className="align-items-center pt-2">
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