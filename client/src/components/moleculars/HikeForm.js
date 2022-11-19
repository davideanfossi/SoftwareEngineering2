import { useState, useRef } from "react";
import { Button, Col, Container, Form, Row, Alert} from "react-bootstrap";
import API from "../../API";
import parseGpx from "../atoms/gpxParser";

function HikeForm (props) {
    // Form state
    const [success, setSuccess] = useState('');

    const [title, setTitle] = useState('');
    const [length, setLength] = useState('');
    const [expectedTime, setExpectedTime] = useState('');
    const [ascent, setAscent] = useState('');
    const [difficult, setDifficult] = useState('tourist');
    const [description, setDescription] = useState('');

    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [startPointLabel, setStartPointLabel] = useState('');
    const [endPointLabel, setEndPointLabel] = useState('');
    const [startAltitude, setStartAltitude] = useState('');
    const [endAltitude, setEndAltitude] = useState('');

    const [file, setFile] = useState('');
    
    const ref = useRef();
    
    const handleSubmit = (event) => {
      event.preventDefault();

      if (title === '') setTitle(null);
      if (length === '' || !(parseInt(length)>0)) setLength(null);
      if (expectedTime === '' || !(parseInt(expectedTime)>0)) setExpectedTime(null);
      if (ascent === '' || !(parseInt(ascent)>0)) setAscent(null);
      if (description === '') setDescription(null);
      if (startPointLabel === '') setStartPointLabel(null);
      if (endPointLabel === '') setEndPointLabel(null);

      const formData = new FormData();
      formData.append('trackingfile', file);
      formData.append('title', title);
      formData.append('length', length);
      formData.append('expectedTime', expectedTime);
      formData.append('ascent', ascent);
      formData.append('difficulty', difficult);
      formData.append('description', description);

      formData.append('startPointId', startPoint); //longitude, latiture
      formData.append('endPointId', endPoint); //longitude, latiture
      formData.append('startAltitude', startAltitude);
      formData.append('endAltitude', endAltitude);
      formData.append('startPointLabel', startPointLabel);
      formData.append('endPointLabel',endPointLabel);

      API.newHike(formData)
      .then(() => {
        setTitle('');
        setLength('');
        setExpectedTime('');
        setAscent('');
        setDescription('');
        setStartPoint(''); 
        setEndPoint('');
        ref.current.value=null;

        setSuccess('yes');
      })
      .catch(() => {
        setSuccess('no');
      })
    };
  
    return (
      <Container fluid style={{"padding": "0", "margin": "0px"}}>
        <Row className="text-center" style={{"paddingLeft": "0.7rem"}}>
            <b style={{"fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem"}}>Insert Hike</b>
        </Row>

        {
          success === "yes" ? 
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            <Alert.Heading>Hike inserted correctly!</Alert.Heading>
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
                <Form.Label>Title</Form.Label>
                <Form.Control isInvalid={title===null}
                              type="text"
                              placeholder="Title"
                              value={title}
                              onChange={event => {setTitle(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Title cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="align-items-center pt-2">
                <Col md>
                  <Form.Group>
                    <Form.Label>Length</Form.Label>
                    <Form.Control isInvalid={length===null}
                                  type="text"
                                  placeholder="length"
                                  value={length}
                                  onChange={event => {setLength(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      length needs to be a number greater than 0
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md>
                  <Form.Group>
                    <Form.Label>Expected Time</Form.Label>
                    <Form.Control isInvalid={expectedTime===null}
                                  type="text"
                                  placeholder="Expected Time"
                                  value={expectedTime}
                                  onChange={event => {setExpectedTime(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      Expected Time  needs to be a number greater than 0
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md>
                  <Form.Group>
                    <Form.Label>Ascent</Form.Label>
                    <Form.Control isInvalid={ascent===null}
                                  type="text"
                                  placeholder="Ascent"
                                  value={ascent}
                                  onChange={event => {setAscent(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      Ascent  needs to be a number greater than 0
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
                <Form.Label>Gpx File</Form.Label>
                <Form.Control type="file"
                              ref={ref}
                              placeholder="gpx file"
                              onChange={event => {
                                setFile(event.target.files[0]);

                                const handleFileLoad = async (event) => {
                                  let [start, end] = parseGpx(event.target.result);

                                  setStartPoint(start[0] + ', ' + start[1]);
                                  setEndPoint(end[0] + ', ' + end[1]);

                                  setStartAltitude(start[2]);
                                  setEndAltitude(end[2]);
                                }
                            
                                const reader = new FileReader()
                                reader.onload = handleFileLoad;
                                reader.readAsText(event.target.files[0]);
                              }}/>
              </Form.Group>

              <Row>
                <Col md>
                  <Form.Group style={{"paddingTop": "12px"}}>
                    <Form.Label>Start Point</Form.Label>
                    <Form.Control type="text"
                                  placeholder={startPoint}
                                  disabled="disabled"/>
                  </Form.Group>
                </Col>

                <Col md>
                  <Form.Group style={{"paddingTop": "12px"}}>
                    <Form.Label>End Point</Form.Label>
                    <Form.Control type="text"
                                  placeholder={endPoint}
                                  disabled="disabled"/>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md>
                  <Form.Group style={{"paddingTop": "12px"}}>
                    <Form.Label>Start Point Label</Form.Label>
                    <Form.Control isInvalid={startPointLabel===null}
                                  type="text"
                                  placeholder="Start Point Label"
                                  onChange={event => {setStartPointLabel(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      Start Point Label cant be empty
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md>
                  <Form.Group style={{"paddingTop": "12px"}}>
                    <Form.Label>End Point Label</Form.Label>
                    <Form.Control isInvalid={endPointLabel===null}
                                  type="text"
                                  placeholder="End Point Label"
                                  onChange={event => {setEndPointLabel(event.target.value);}}/>
                    <Form.Control.Feedback type="invalid">
                      End Point Label cant be empty
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group as={Col} md="8" style={{"paddingTop": "12px"}}>
                <Form.Label>Difficulty</Form.Label><br></br>
                <div style={{"paddingTop": "8px"}}>
                  <Form.Check inline defaultChecked  type="radio" name="difficulty" label="Tourist" onChange={() => setDifficult("tourist")}/>
                  <Form.Check inline type="radio" name="difficulty" label="Hiker" onChange={() => setDifficult("hiker")}/>
                  <Form.Check inline type="radio" name="difficulty" label="Professional hiker" onChange={() => setDifficult("professional hiker")}/>
                </div>      
              </Form.Group>
  
            </Row>
            <Button type="submit"  style={{"marginTop": "12px", "backgroundColor": 'blue', "borderColor": 'blue'}}>Submit</Button>
          </Form>
        </Container>
      </Container>
    );
}

export { HikeForm };