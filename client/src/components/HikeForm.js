import { useState } from "react";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import API from "../API";
import Hike from "../models/hike";

function HikeForm (props) {
    // Form state
    const [title, setTitle] = useState(null);
    const [lenght, setLenght] = useState(null);
    const [expectedTime, setExpectedTime] = useState(null);
    const [ascent, setAscent] = useState(null);
    const [difficult, setDifficult] = useState('tourist');
    const [description, setDescription] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    const handleSubmit = event => {
      event.preventDefault();

      const hike = new Hike(0, title, lenght, expectedTime, ascent, difficult, description, startPoint, endPoint, 0);
      API.newHike(hike);

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
        <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem"}}>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control isInvalid={title==""}
                              type="text"
                              placeholder="Title"
                              onChange={event => {setTitle(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Title cant be empty
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Lenght</Form.Label>
                <Form.Control isInvalid={lenght==""}
                              type="text"
                              placeholder="Lenght"
                              onChange={event => {setLenght(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Lenght cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Expected Time</Form.Label>
                <Form.Control isInvalid={expectedTime==""}
                              type="text"
                              placeholder="Expected Time"
                              onChange={event => {setExpectedTime(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Expected Time cant be empty
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Ascent</Form.Label>
                <Form.Control isInvalid={ascent==""}
                              type="text"
                              placeholder="Ascent"
                              onChange={event => {setAscent(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Ascent cant be empty
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Description</Form.Label>
                <Form.Control isInvalid={description==""}
                              type="text"
                              placeholder="Description"
                              onChange={event => {setDescription(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Description cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Start Point</Form.Label>
                <Form.Control isInvalid={startPoint==""}
                              type="text"
                              placeholder="Start Point"
                              onChange={event => {setStartPoint(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Start Point cant be empty
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>End Point</Form.Label>
                <Form.Control isInvalid={endPoint==""}
                              type="text"
                              placeholder="End Point"
                              onChange={event => {setEndPoint(event.target.value);}}/>
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