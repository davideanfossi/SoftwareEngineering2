import { useState, useRef } from "react";
import { Button, Col, Container, Form, Row, Alert} from "react-bootstrap";
import API from "../../API";

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
    const [file, setFile] = useState('');
    
    const ref = useRef();

    const handleSubmit = event => {
      event.preventDefault();

      if (title === '') setTitle(null);
      if (length === '' || !(parseInt(length)>0)) setLength(null);
      if (expectedTime === '' || !(parseInt(expectedTime)>0)) setExpectedTime(null);
      if (ascent === '' || !(parseInt(ascent)>0)) setAscent(null);
      if (description === '') setDescription(null);
      if (startPoint === '' || !(parseInt(startPoint)>0)) setStartPoint(null);
      if (endPoint === '' || !(parseInt(endPoint)>0)) setEndPoint(null);

      const formData = new FormData();
      formData.append('trackingfile', file);
      formData.append('title', title);
      formData.append('length', length);
      formData.append('expectedTime', expectedTime);
      formData.append('ascent', ascent);
      formData.append('difficulty', difficult);
      formData.append('description', description);
      formData.append('startPointId', startPoint);
      formData.append('endPointId', endPoint);

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
      <Container fluid style={{"padding": "0"}}>
        <Row style={{"paddingLeft": "0.7rem"}}>
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
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>length</Form.Label>
                <Form.Control isInvalid={length===null}
                              type="text"
                              placeholder="length"
                              value={length}
                              onChange={event => {setLength(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  length needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>

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
  
              <Form.Group style={{"paddingTop": "12px"}}>
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
                <Form.Label>Start Point</Form.Label>
                <Form.Control isInvalid={startPoint===null}
                              type="text"
                              placeholder="Start Point"
                              value={startPoint}
                              onChange={event => {setStartPoint(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Start Point needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>End Point</Form.Label>
                <Form.Control isInvalid={endPoint===null}
                              type="text"
                              placeholder="End Point"
                              value={endPoint}
                              onChange={event => {setEndPoint(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                End Point needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Gpx File</Form.Label>
                <Form.Control type="file"
                              ref={ref}
                              placeholder="gpx file"
                              onChange={event => {setFile(event.target.files[0]);}}/>
              </Form.Group>

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