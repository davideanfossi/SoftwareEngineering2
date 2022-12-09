import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ChevronCompactDown, ChevronCompactUp } from "react-bootstrap-icons";
import API from "../../API";

export const HutRow = ({ hut, even }) => {

  return (
    <Row className={even ? "hike-row-even" : "hike-row"}>
      <Col>
        <Container fluid>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={8}
              // sm={4}
              // md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Name:</Col>
                </Row>
                <Row>
                  <Col>
                    {hut.name}
                  </Col>
                </Row>
              </Container>
            </Col>


            <Col
               className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={8}
              // sm={2}
              // md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Number of beds:</Col>
                </Row>
                <Row>
                  <Col>{hut.numberOfBeds}</Col>
                </Row>
              </Container>
            </Col>

            {hut.optionalWebsite === "" ? <></> :
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={8}
              // sm={4}
              // md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Website:</Col>
                </Row>
                <Row>
                  <Col>
                    {hut.optionalWebsite}
                  </Col>
                </Row>
              </Container>
            </Col> }

            <Col
               className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={4}
              // sm={2}
              // md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Phone:</Col>
                </Row>
                <Row>
                  <Col>{hut.phone}</Col>
                </Row>
              </Container>
            </Col>
            <Col
               className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={4}
              // sm={2}
              // md={1}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold ">Email:</Col>
                </Row>
                <Row>
                  <Col>{hut.email}m</Col>
                </Row>
              </Container>
            </Col>
            <Col
               className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={12}
              // sm={4}
              // md={2}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Altitude:</Col>
                </Row>
                <Row>
                  <Col>
                    {parseInt(hut.point.altitude)} m
                  </Col>
                </Row>
              </Container>
            </Col>
            
            <Col
              className="d-flex justify-content-center align-items-center my-3 text-center"
              // xs={12}
              // sm={6}
              // md={4}
            >
              <Container fluid>
                <Row>
                  <Col className="fw-bold">Description:</Col>
                </Row>
                <Row>
                  <Col>
                    {hut.description}
                  </Col>
                </Row>
              </Container>
            </Col>
           

          </Row>
        </Container>
      </Col>
    </Row>
  );
};
