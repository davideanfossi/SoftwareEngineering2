/* eslint-disable jsx-a11y/img-redundant-alt */
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import API from "../../API";
import { HikeMap } from "../atoms/hike-map";
import defaultHikeImage from "../../public/default-hike-image.svg";
import { Button } from "react-bootstrap";
import { UserContext } from "../../context/user-context";
import { StartHike } from "../moleculars/startHike";

export const HikePage = () => {
  const userContext = useContext(UserContext);

  const [showForm, setshowForm] = useState("");
  const [showButton, setShowButton] = useState(true);

  const isLocalGuide = ["Local Guide"].includes(userContext.user.role);
  const { id } = useParams();
  const [hike, setHike] = useState({});
  const [track, setTrack] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    API.getHike(id).then((res) => {
      console.log(res);
      setHike(res.hike);
      setTrack(res.track);
    });
  }, [id]);

  function handleClick(event) {
    event.preventDefault();
    setShowButton(false);
    setshowForm("success");
  }

  return (
    <Container fluid className="mt-4">
      <Row className="m-2 justify-content-center">
        <Col className="hike-row" lg={10}>
          <Container fluid>
            <Row>
              <Col
                xs={12}
                lg={4}
                className="p-1 d-flex justify-content-center align-items-center"
              >
                {hike.imageName ? (
                  <img
                    src={
                      "https://happiestoutdoors.ca/wp-content/uploads/2019/10/AlpineMeadowsTrailGroup.jpg.webp"
                    }
                    alt="hike-image"
                    width="100%"
                    className="m-2"
                  />
                ) : (
                  <img src={defaultHikeImage} alt="hike-image" height={200} />
                )}
              </Col>
              <Col xs={12} lg={8} className="align-items-center d-flex">
                <Container>
                  <Row>
                    <Col xs={12} lg={6} className="align-items-center d-flex">
                      <Container
                        fluid
                        className="d-flex justify-content-center align-items-center my-3 text-center flex-column"
                      >
                        <Row>
                          <Col className="fw-bold">Title:</Col>
                        </Row>
                        <Row>
                          <Col>{hike.title}</Col>
                        </Row>
                        <Row>
                          <Col className="fw-bold">Length:</Col>
                          <Col className="fw-bold">Time:</Col>
                          <Col className="fw-bold">Ascent:</Col>
                        </Row>
                        <Row>
                          <Col>{hike.length}m</Col>
                          <Col>{hike.expectedTime}min</Col>
                          <Col>{hike.ascent}m</Col>
                        </Row>
                        <Row>
                          <Col className="fw-bold">Difficulty:</Col>
                        </Row>
                        <Row>
                          <Col>{hike.difficulty}</Col>
                        </Row>
                      </Container>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Container
                        fluid
                        className="d-flex justify-content-center align-items-center my-3 text-center flex-column"
                      >
                        <Row className="w-100 ">
                          <Col className="fw-bold">Description:</Col>
                        </Row>
                        <Row className="justify-content-center w-100 ">
                          <Col xs={12} className="w-100">
                            {hike.description}
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                  {showButton ?
                    <Row className="w-100 justify-content-center my-1 mx-0">
                      <Col xs={6}>
                        <Button className="w-100 px-0" variant='warning' type='submit' size="lg" onClick={handleClick}>
                          Start Hike
                        </Button>
                      </Col>
                    </Row>
                    :
                    <></>
                  }
                  <StartHike form={showForm} hikeId={hike.id} userId={userContext.user.id} />
                  <Row className=" w-100 justify-content-center my-1 mx-0">
                    <Col xs={6}>
                      <Button
                        className="w-100 px-0"
                        onClick={() => navigate("/")}
                      >
                        Go back
                      </Button>
                    </Col>
                    {isLocalGuide && (
                      <Col xs={6}>
                        <Button
                          className="w-100 px-0"
                          onClick={() => navigate("/link-start-end/" + hike.id)}
                        >
                          Link start/end
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col>
          <HikeMap
            startPoint={hike.startPoint}
            endPoint={hike.endPoint}
            referencesPoints={hike.referencePoints}
            track={track}
          />
        </Col>
      </Row>
    </Container>
  );
};
