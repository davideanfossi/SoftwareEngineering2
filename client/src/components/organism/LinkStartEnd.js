import { Row, Button, Container, Alert } from "react-bootstrap";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { LinkPointMap } from "../atoms/link-point-map";
import { useParams } from "react-router";
import API from "../../API";

function LinkStartEnd() {
  const [changed, setChanged] = useState(true);
  const [startPoint, setStartPoint] = useState({ type: undefined, id: -1 });
  const [endPoint, setEndPoint] = useState({ type: undefined, id: -1 });
  const [showAlert, setShowAlert] = useState('');
  const { id } = useParams();

  return (
    <Container className="mt-2" fluid>
      {
        showAlert === "success" ?
        <Row
        className="justify-content-center align-items-center text-center mt-3"
        style={{ margin: "0px" }}
      >
            <Alert variant="success" onClose={() => { setShowAlert(""); }} dismissible>
              <Alert.Heading>Link Successful!</Alert.Heading>
            </Alert>
          </Row>
          :
          <>{
            showAlert === "error" ?
            <Row
            className="justify-content-center align-items-center mt-3"
            style={{ margin: "0px" }}
          >
                <Alert variant="danger" onClose={() => { setShowAlert(""); }} dismissible>
                  <Alert.Heading>Something went wrong!</Alert.Heading>
                </Alert>
              </Row>
              : <></>
          }</>
      }
      <Row
        className="justify-content-center align-items-center"
        style={{ margin: "0px" }}
      >
        <Row
          className="align-items-center text-right"
          style={{
            paddingTop: "20px",
            paddingBottom: "50px",
            paddingRight: "0px",
            paddingLeft: "0px",
            margin: "0px",
            width: "1000px",
          }}
        >
          <Tabs
            defaultActiveKey="start"
            style={{
              backgroundColor: "rgb(239, 208, 131)",
              boxShadow: "none",
              width: "auto",
              padding: "0",
              borderRadius: "10px 10px 0px 0px",
            }}
            onSelect={() => setChanged(true)}
          >
            <Tab eventKey="start" title="Link Start">
              <LinkPointMap
                start
                changed={changed}
                setChanged={setChanged}
                selected={startPoint}
                setSelected={setStartPoint}
              />
            </Tab>
            <Tab eventKey="end" title="Link End">
              <LinkPointMap
                end
                changed={changed}
                setChanged={setChanged}
                selected={endPoint}
                setSelected={setEndPoint}
              />
            </Tab>
          </Tabs>

          {/* <Map/> */}

          <Button
            onClick={() => {
              API.linkStartEndPoint(id, startPoint, endPoint).then(
                () => { setShowAlert("success"); })
                .catch(err => { setShowAlert("error"); });
            }}
            style={{
              backgroundColor: "rgb(239, 208, 131)",
              width: "auto",
              border: "none",
              color: "black",
              marginTop: "15px",
            }}
          >
            Link Selected
          </Button>
        </Row>
      </Row>
    </Container>
  );
}

export { LinkStartEnd };
