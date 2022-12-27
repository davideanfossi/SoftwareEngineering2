import { Row, Button, Container, Alert } from "react-bootstrap";
import { useState } from "react";
import { AddReferencePointMap } from "../atoms/add-reference-point-map";
import { useParams } from "react-router";
import API from "../../API";

function AddReferencePoint() {
  const [changed, setChanged] = useState(true);
  const [showAlert, setShowAlert] = useState("");
  const [alreadySelected, setAlreadySelected] = useState([]);
  const { id } = useParams();

  return (
    <Container className="mt-2" fluid>
      {showAlert === "success" ? (
        <Row
          className="justify-content-center align-items-center text-center mt-3"
          style={{ margin: "0px" }}
        >
          <Alert
            variant="success"
            onClose={() => {
              setShowAlert("");
            }}
            dismissible
          >
            <Alert.Heading>Reference point successfully added!</Alert.Heading>
          </Alert>
        </Row>
      ) : (
        <>
          {showAlert === "error" ? (
            <Row
              className="justify-content-center align-items-center mt-3"
              style={{ margin: "0px" }}
            >
              <Alert
                variant="danger"
                onClose={() => {
                  setShowAlert("");
                }}
                dismissible
              >
                <Alert.Heading>Something went wrong!</Alert.Heading>
              </Alert>
            </Row>
          ) : (
            <></>
          )}
        </>
      )}

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
          <AddReferencePointMap
            changed={changed}
            setChanged={setChanged}
            setAlreadySelected={setAlreadySelected}
            alreadySelected={alreadySelected}
          />

          {/* <Map/> */}

          <Button
            onClick={() => {
              API.AddReferencePoint(id, alreadySelected)
                .then(() => {
                  setShowAlert("success");
                  setAlreadySelected([]);
                })
                .catch((err) => {
                  setShowAlert("error");
                });
            }}
            style={{
              backgroundColor: "rgb(239, 208, 131)",
              width: "auto",
              border: "none",
              color: "black",
              marginTop: "15px",
            }}
          >
            {alreadySelected.length >1 ?  
              "Add reference points" : "Add reference point"
            }
          </Button>
        </Row>
      </Row>
    </Container>
  );
}

export { AddReferencePoint };
