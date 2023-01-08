import { Row, Button, Container, Alert } from "react-bootstrap";
import { useState } from "react";
import { AddReferencePointMap } from "../atoms/add-reference-point-map";
import { useNavigate, useParams } from "react-router";
import API from "../../API";

function AddReferencePoint() {
  const [changed, setChanged] = useState(true);
  const [showAlert, setShowAlert] = useState("");
  const [alreadySelected, setAlreadySelected] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  return (
    <Container className="mt-2" fluid>
      {showAlert !== "" ? (
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
            <Alert.Heading>{showAlert}</Alert.Heading>
          </Alert>
        </Row>
      ) : (
        <></>
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
            onClick={async () => {
              const emptyNames = alreadySelected.filter(
                (elem) => elem.name === "" || elem.name === undefined
              );
              console.log("x:", emptyNames);
              if (emptyNames.length > 0) {
                console.log(emptyNames.map((elem) => elem.id));
                setShowAlert(
                  "Reference Points name are mandatory! Insert name for reference points: " +
                    emptyNames
                      .map((elem) =>
                        alreadySelected.findIndex(
                          (elem1) => elem1.id === elem.id
                        )
                      )
                      .concat()
                );
                return;
              }
              let refList = await Promise.all(
                alreadySelected.map(async (el) => {
                  let url =
                    "https://nominatim.openstreetmap.org/reverse?lat=" +
                    el.pos.lat +
                    "&lon=" +
                    el.pos.lng +
                    "&zoom=16";
                  let address = await fetch(url)
                    .then((response) => response.text())
                    .then((str) =>
                      new window.DOMParser().parseFromString(str, "text/xml")
                    )
                    .then(
                      (data) =>
                        data
                          .getElementsByTagName("reversegeocode")[0]
                          .getElementsByTagName("result")[0].innerHTML
                    )
                    .catch((err) => console.log(err));
                  let altitude = await API.getAltitudeFromCoordinates(
                    el.pos.lat,
                    el.pos.lng
                  );
                  return {
                    latitude: el.pos.lat,
                    longitude: el.pos.lng,
                    altitude: altitude.elevation,
                    name: el.name,
                    address: address,
                    description: el.description,
                  };
                })
              );
              API.addReferencePoints(id, refList)
                .then(() => {
                  setShowAlert("success");
                  setAlreadySelected([]);
                  navigate("/my-hikes");
                })
                .catch((err) => {
                  console.log(err);
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
            {alreadySelected.length > 1
              ? "Add reference points"
              : "Add reference point"}
          </Button>
        </Row>
      </Row>
    </Container>
  );
}

export { AddReferencePoint };
