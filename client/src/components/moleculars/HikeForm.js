import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import API from "../../API";
import parseGpx from "../atoms/gpxParser";

function HikeForm() {
  // Form state
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [length, setLength] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [ascent, setAscent] = useState('');
  const [difficult, setDifficult] = useState('Tourist');
  const [description, setDescription] = useState('');
  const [startPointLabel, setStartPointLabel] = useState('');
  const [endPointLabel, setEndPointLabel] = useState('');
  const [file, setFile] = useState('');

  const [startLongitude, setStartLongitude] = useState('');
  const [startLatitude, setStartLatitude] = useState('');
  const [endLongitude, setEndLongitude] = useState('');
  const [endLatitude, setEndLatitude] = useState('');
  const [startAltitude, setStartAltitude] = useState('');
  const [endAltitude, setEndAltitude] = useState('');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');

  const ref = useRef();

  const cancelInput = () => {
    setTitle('');
    setLength('');
    setExpectedTime('');
    setAscent('');
    setDescription('');
    setStartLongitude('');
    setStartLatitude('');
    setEndLongitude('');
    setEndLatitude('');
    setStartPointLabel('');
    setEndPointLabel('');
    setStartAltitude('');
    setEndAltitude('');
    setStartAddress('');
    setEndAddress('');
  };

  useEffect(() => {
    cancelInput();
  }, [file]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let flag = false;

    if (title === '') { setTitle(null); flag = true; }
    if (length === '' || !(parseInt(length) > 0)) { setLength(null); flag = true; }
    if (expectedTime === '' || !(parseInt(expectedTime) > 0)) { setExpectedTime(null); flag = true; }
    if (ascent === '' || !(parseInt(ascent) > 0)) { setAscent(null); flag = true; }
    if (startPointLabel === '') { setStartPointLabel(null); flag = true; }
    if (endPointLabel === '') { setEndPointLabel(null); flag = true; }
    if (file === '') { setFile(null); flag = true; }

    if (flag) return;

    const formData = new FormData();
    formData.append('trackingfile', file);
    formData.append('title', title);
    formData.append('length', length);
    formData.append('expectedTime', expectedTime);
    formData.append('ascent', ascent);
    formData.append('difficulty', difficult);
    formData.append('description', description);

    formData.append('startLongitude', startLongitude);
    formData.append('startLatitude', startLatitude);
    formData.append('endLongitude', endLongitude);
    formData.append('endLatitude', endLatitude);
    formData.append('startAltitude', startAltitude);
    formData.append('endAltitude', endAltitude);
    formData.append('startPointLabel', startPointLabel);
    formData.append('endPointLabel', endPointLabel);
    formData.append('startAddress', startAddress);
    formData.append('endAddress', endAddress);

    API.newHike(formData)
      .then(() => {
        cancelInput();
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
        <b style={{ "fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem" }}>Insert Hike</b>
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


      <Container className="border border-4 rounded" style={{ "marginTop": "0.5rem", "padding": "1rem" }}>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mt-2">
            <Form.Label>Gpx File</Form.Label>
            <Form.Control isInvalid={file === null}
              type="file"
              ref={ref}
              placeholder="gpx file"
              onChange={event => {
                setFile(event.target.files[0]);

                const handleFileLoad = async (event) => {
                  // get coordinates
                  let { start, end, name, desc, length, ascent } = parseGpx(event.target.result);

                  setTitle(name);
                  setDescription(desc);
                  setLength(length);
                  setAscent(ascent);

                  setStartLatitude(start.lat);
                  setStartLongitude(start.lon);
                  setEndLatitude(end.lat);
                  setEndLongitude(end.lon);

                  setStartAltitude(start.ele);
                  setEndAltitude(end.ele);

                  // reverse coordinates
                  let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + start.lat + '&lon=' + start.lon + '&zoom=16';
                  let address = await fetch(url)
                    .then(response => response.text())
                    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                    .then(data => data.getElementsByTagName("reversegeocode")[0].getElementsByTagName("result")[0].innerHTML)
                    .catch(err => console.log(err));

                  setStartAddress(address);
                  setStartPointLabel(address.split(",")[0]);

                  url = 'https://nominatim.openstreetmap.org/reverse?lat=' + end.lat + '&lon=' + end.lon + '&zoom=16';
                  address = await fetch(url)
                    .then(response => response.text())
                    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                    .then(data => data.getElementsByTagName("reversegeocode")[0].getElementsByTagName("result")[0].innerHTML)
                    .catch(err => console.log(err));

                  setEndAddress(address);
                  setEndPointLabel(address.split(",")[0]);
                }

                const reader = new FileReader()
                reader.onload = handleFileLoad;
                reader.readAsText(event.target.files[0]);
              }} />
            <Form.Control.Feedback type="invalid">
              You need to select a gpx file
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3 mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control isInvalid={title === null}
              type="text"
              placeholder="Title"
              value={title}
              onChange={event => { setTitle(event.target.value); }} />
            <Form.Control.Feedback type="invalid">
              Title cant be empty
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="align-items-center pt-2">
            <Col md>
              <Form.Group>
                <Form.Label>Length (m)</Form.Label>
                <Form.Control isInvalid={length === null}
                  type="number" step={100} min={0}
                  placeholder="length"
                  value={length}
                  disabled="disabled"
                  onChange={event => { setLength(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  length needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md>
              <Form.Group>
                <Form.Label>Expected Time (min)</Form.Label>
                <Form.Control isInvalid={expectedTime === null}
                  type="number" step={10} min={0}
                  placeholder="Expected Time"
                  value={expectedTime}
                  onChange={event => { setExpectedTime(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  Expected Time  needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md>
              <Form.Group>
                <Form.Label>Ascent (m)</Form.Label>
                <Form.Control isInvalid={ascent === null}
                  type="number" step={100} min={0}
                  placeholder="Ascent"
                  value={ascent}
                  disabled="disabled"
                  onChange={event => { setAscent(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  Ascent  needs to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4}
              isInvalid={description === null}
              type="text"
              placeholder="Description"
              value={description}
              onChange={event => { setDescription(event.target.value); }} />
            <Form.Control.Feedback type="invalid">
              Description cant be empty
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md>
              <Form.Group className="mt-3">
                <Form.Label>Start Point</Form.Label>
                <Form.Control type="text"
                  placeholder={startAddress}
                  disabled="disabled" />
              </Form.Group>
            </Col>

            <Col md>
              <Form.Group className="mt-3">
                <Form.Label>End Point</Form.Label>
                <Form.Control type="text"
                  placeholder={endAddress}
                  disabled="disabled" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md>
              <Form.Group className="mt-3">
                <Form.Label>Start Point Label</Form.Label>
                <Form.Control isInvalid={startPointLabel === null}
                  type="text"
                  placeholder="Start Point Label"
                  value={startPointLabel}
                  onChange={event => { setStartPointLabel(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  Start Point Label cannot be empty
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md>
              <Form.Group className="mt-3">
                <Form.Label>End Point Label</Form.Label>
                <Form.Control isInvalid={endPointLabel === null}
                  type="text"
                  placeholder="End Point Label"
                  value={endPointLabel}
                  onChange={event => { setEndPointLabel(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  End Point Label cannot be empty
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group as={Col} md="8" className="mt-3">
            <Form.Label>Difficulty</Form.Label><br></br>
            <div style={{ "paddingTop": "8px" }}>
              <Form.Check inline defaultChecked type="radio" name="difficulty" label="Tourist" onChange={() => setDifficult("Tourist")} />
              <Form.Check inline type="radio" name="difficulty" label="Hiker" onChange={() => setDifficult("Hiker")} />
              <Form.Check inline type="radio" name="difficulty" label="Professional Hiker" onChange={() => setDifficult("Professional Hiker")} />
            </div>
          </Form.Group>

          <Button type="submit" style={{ "marginTop": "12px", "backgroundColor": 'blue', "borderColor": 'blue' }}>Submit</Button>
        </Form>
      </Container>
    </Container>
  );
}

export { HikeForm };