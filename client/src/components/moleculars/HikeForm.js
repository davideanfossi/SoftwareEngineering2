import { useState, useRef } from "react";
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
  const [image, setImage] = useState('');

  const [startLongitude, setStartLongitude] = useState('');
  const [startLatitude, setStartLatitude] = useState('');
  const [endLongitude, setEndLongitude] = useState('');
  const [endLatitude, setEndLatitude] = useState('');
  const [startAltitude, setStartAltitude] = useState('');
  const [endAltitude, setEndAltitude] = useState('');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [showErr, setShowErr] = useState(false);

  const ref = useRef();

  const cancelInput = (cancelFile=false) => {
    setShowErr(false);
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
    setImage('');
    if(cancelFile) setFile('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let flag = false;

    if (title === '') { setShowErr(true); setTitle(''); flag = true; }
    if (length === '') { setShowErr(true); setLength(''); flag = true; }
    if (expectedTime === '' || !(parseInt(expectedTime) > 0)) { setShowErr(true); setExpectedTime(''); flag = true; }
    if (startPointLabel === '') { setShowErr(true); setStartPointLabel(''); flag = true; }
    if (endPointLabel === '') { setShowErr(true); setEndPointLabel(''); flag = true; }
    if (file === '') { setShowErr(true); setFile(''); flag = true; }
    if (image === '') { setShowErr(true); setImage(''); flag = true; }

    if (flag) return;

    setShowErr(false);
    
    const formData = new FormData();
    formData.append('trackingfile', file);
    formData.append('title', title);
    formData.append('length', length);
    formData.append('expectedTime', expectedTime);
    formData.append('ascent', ascent);
    formData.append('difficulty', difficult);
    formData.append('description', description);
    formData.append('image', image);

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
        cancelInput(true);
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
            <Form.Control isInvalid={showErr && file === ''}
              type="file"
              ref={ref}
              placeholder="gpx file"
              onChange={event => {
                setFile(event.target.files[0]);

                const handleFileLoad = async (event) => {
                  // get coordinates
                  let { start, end, name, desc, length, ascent } = parseGpx(event.target.result);
                  cancelInput(false);

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
            <Form.Control isInvalid={showErr && title === ''}
              type="text"
              placeholder="Title"
              value={title}
              onChange={event => { setTitle(event.target.value); }} />
            <Form.Control.Feedback type="invalid">
              Title cant be empty
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="align-items-center pt-2">
            <Col md={4} xs={6}>
              <Form.Group>
                <Form.Label>Length (m)</Form.Label>
                <Form.Control isInvalid={showErr && length === ''}
                  type="number" step={100} min={0}
                  placeholder="length"
                  value={length}
                  disabled="disabled"
                  onChange={event => { setLength(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  length must to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4} xs={6}>
              <Form.Group>
                <Form.Label>Ascent (m)</Form.Label>
                <Form.Control isInvalid={showErr && ascent === ''}
                  type="number" step={100} min={0}
                  placeholder="Ascent"
                  value={ascent}
                  disabled="disabled"
                  onChange={event => { setAscent(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  Ascent must to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4} xs={9}>
              <Form.Group>
                <Form.Label>Expected Time (min)</Form.Label>
                <Form.Control isInvalid={showErr && expectedTime === ''}
                  type="number" step={10} min={0}
                  placeholder="Expected Time"
                  value={expectedTime}
                  onChange={event => { setExpectedTime(event.target.value); }} />
                <Form.Control.Feedback type="invalid">
                  Expected Time must to be a number greater than 0
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4}
              isInvalid={showErr && description === ''}
              type="text"
              placeholder="Description"
              value={description}
              onChange={event => { setDescription(event.target.value); }} />
            <Form.Control.Feedback type="invalid">
              Description cannot be empty
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
                <Form.Control isInvalid={showErr &&  startPointLabel === ''}
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
                <Form.Control isInvalid={showErr && endPointLabel === ''}
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

          <Form.Group style={{ paddingTop: "12px", paddingBottom: "20px" }}>
              <Form.Label>Image of the Hike</Form.Label>
              <Form.Control isInvalid={showErr && image === ''}
                type="file"
                ref={ref}
                placeholder="img file"
                onChange={(event) => {
                  setImage(event.target.files[0]);
                }}
              />
              <Form.Control.Feedback type="invalid">
                  Image cannot be empty
               </Form.Control.Feedback>
            </Form.Group>

            {image !== "" ? (
              <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <div className="text-center" style={{ paddingBottom: "10px" }}>
                  <img
                    alt="Not found"
                    width={"250px"}
                    src={URL.createObjectURL(image)}
                  />
                </div>
                <div className="text-center">
                  <Button
                    className="btn-danger"
                    style={{ width: "250px" }}
                    onClick={() => {
                      setImage("");
                      ref.current.value = null;
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : null}

          <Button type="submit" variant="warning" >Submit</Button>
        </Form>
      </Container>
    </Container>
  );
}

export { HikeForm };