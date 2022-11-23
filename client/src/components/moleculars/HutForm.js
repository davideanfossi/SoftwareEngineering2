import { useState, useRef } from "react";
import { Button, Col, Container, Form, Row, Alert} from "react-bootstrap";
import API from "../../API";

function HutForm () {
    // Form state
    const [success, setSuccess] = useState('');

    const [name, setName] = useState('');
    const [beds, setBeds] = useState('');
    const [altitude, setAltitude] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');

    const ref = useRef();
    
    const handleSubmit = (event) => {
      event.preventDefault();
      let flag = false;

      if (name === '') {setName(null); flag=true;}
      if (beds === '' || !(parseInt(beds)>=0)) {setBeds(null); flag=true;}
      if (altitude === '' || !(parseInt(altitude)>=0)) {setAltitude(null); flag=true;}
      if (description === '') {setDescription(null); flag=true;}
      //if (file === '') {setFile(null); flag=true;}

      if (flag) return;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('beds', beds);
      formData.append('altitude', altitude);
      formData.append('description', description);

    /*
      API.newHut(formData)
      .then(() => {
        setName('');
        setBeds('');
        setAltitude('');
        
        ref.current.value=null;

        setSuccess('yes');
      })
      .catch(() => {
        setSuccess('no');
      })
    */
    };
  
    return (
      <Container fluid style={{"padding": "0", "margin": "0px"}}>
        <Row className="text-center" style={{"paddingLeft": "0.7rem"}}>
            <b style={{"fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem"}}>Insert Hut</b>
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
              <Alert.Heading>Error not inserted!</Alert.Heading>
            </Alert> : null
          }</>
        }
        

        <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem"}}>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control isInvalid={name===null}
                              type="text"
                              placeholder="Name"
                              value={name}
                              onChange={event => {setName(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Name cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="align-items-center pt-2">
                <Col md>
                  <Form.Group>
                    <Form.Label>Number of Beds</Form.Label>
                    <Form.Control isInvalid={beds===null}
                                  type="text"
                                  placeholder="number of beds"
                                  value={beds}
                                  onChange={event => {setBeds(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                        Number of beds needs to be a number greater than 0
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md>
                  <Form.Group>
                    <Form.Label>Altitude</Form.Label>
                    <Form.Control isInvalid={altitude===null}
                                  type="text"
                                  placeholder="Altitude"
                                  value={altitude}
                                  onChange={event => {setAltitude(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      Altitude needs to be a number greater than 0
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Description</Form.Label>
                <Form.Control isInvalid={description===null}
                              type="text"
                              placeholder="Description"
                              value={description}
                              onChange={event => {setDescription(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Description cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Image of the Hut</Form.Label>
                <Form.Control type="file"
                              ref={ref}
                              placeholder="gpx file"
                              onChange={event => {
                                setFile(event.target.files[0]);
                              }}/>
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
            <Button type="submit"  style={{"marginTop": "12px", "backgroundColor": 'blue', "borderColor": 'blue'}}>Submit</Button>
          </Form>
        </Container>
      </Container>
    );
}

export { HutForm };