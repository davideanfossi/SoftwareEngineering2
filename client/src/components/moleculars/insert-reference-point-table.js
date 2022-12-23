import { InputGroup, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";

export const InsertReferencePointTable = ({ referencePointList }) => {
  return (
    <Container fluid>
      {referencePointList.map((rp, idx) => (
        <Row
          id={"reference-point-table" + idx}
          //className={idx % 2 ? "hut-row-even" : "hut-row"}
          style={{ cursor: "pointer" }}
        >
          <Col>
            <Container fluid>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  {"# " + idx}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Description"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              {/* <Row>
                <Col
                  className="d-flex justify-content-center align-items-center my-3 text-center"
                >
                  <Container fluid>
                    
                    <Col className="fw-bold">Name: {idx}</Col>
                  </Container>
                </Col>

                <Col
                  className="d-flex justify-content-center align-items-center my-3 text-center"
                >
                  <Container fluid>
                  
                    <Row>
                      <Col className="fw-bold">
                        Description:
                      </Col>
                    </Row>
                    <Row>
                      <Col>{rp.description}</Col>
                    </Row>
                  </Container>
                </Col>
              </Row> */}
            </Container>
          </Col>
        </Row>
      ))}
    </Container>
  );
};
