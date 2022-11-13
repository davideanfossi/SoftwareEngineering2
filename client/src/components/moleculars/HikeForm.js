import { useState } from "react";
import { Button, Col, Container, Form, FormControl, Row, Alert} from "react-bootstrap";
import API from "../../API";
import Hike from "../../models/hike";

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
    const [file, setFile] = useState(null);

    const handleSubmit = event => {
      event.preventDefault();

      //const hike = new Hike(0, title, length, expectedTime, ascent, difficult, description, startPoint, endPoint, 0);

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
        setFile(null);

        setSuccess('yes');
      })
      .catch((e) => {
        setSuccess('no');
      })

      // reset form
      

      /*
      //for errors display  
      if (domanda==null) setDomanda("");
      if (soluzione==null) setSoluzione("");
      if (sugg1==null) setSugg1("");
      if (sugg2==null) setSugg2("");
      if (tempo==null || !(parseInt(tempo)<=600 && parseInt(tempo)>=30)) setTempo("");
      
      // check data correct
      if (domanda!="" && soluzione!="" && sugg1!="" && sugg2!="" && tempo!="" 
      && domanda!=null && soluzione!=null && sugg1!=null && sugg2!=null && tempo!=null
      && (parseInt(tempo)<=600 && parseInt(tempo)>=30)) {
        const submittedIndovinello = new Indovinello(props.user.id, domanda, soluzione, sugg1, sugg2, difficolta, tempo, "aperto");
  
        props.addIndovinello(submittedIndovinello);
      }
      */
    };
  
    return (
      <Container fluid style={{"padding": "0"}}>
        <Row style={{"paddingLeft": "0.7rem"}}>
            <b style={{"fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem"}}>Insert Hike</b>
        </Row>

        {
          success == "yes" ? 
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            <Alert.Heading>Hike inserted correctly!</Alert.Heading>
          </Alert> 
          : 
          <>{
            success == "no" ?
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
                <Form.Control isInvalid={title==null}
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
                <Form.Control isInvalid={length==null}
                              type="text"
                              placeholder="length"
                              value={length}
                              onChange={event => {setLength(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  length cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Expected Time</Form.Label>
                <Form.Control isInvalid={expectedTime==null}
                              type="text"
                              placeholder="Expected Time"
                              value={expectedTime}
                              onChange={event => {setExpectedTime(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Expected Time cant be empty
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Ascent</Form.Label>
                <Form.Control isInvalid={ascent==null}
                              type="text"
                              placeholder="Ascent"
                              value={ascent}
                              onChange={event => {setAscent(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Ascent cant be empty
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Description</Form.Label>
                <Form.Control isInvalid={description==null}
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
                <Form.Control isInvalid={startPoint==null}
                              type="text"
                              placeholder="Start Point"
                              value={startPoint}
                              onChange={event => {setStartPoint(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Start Point cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>End Point</Form.Label>
                <Form.Control isInvalid={endPoint==null}
                              type="text"
                              placeholder="End Point"
                              value={endPoint}
                              onChange={event => {setEndPoint(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                End Point cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Gpx File</Form.Label>
                <Form.Control isInvalid={endPoint==null}
                              type="file"
                              placeholder="gpx file"
                              onChange={event => {setFile(event.target.files[0]);}}/>
                <Form.Control.Feedback type="invalid">
                End Point cant be empty
                </Form.Control.Feedback>
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