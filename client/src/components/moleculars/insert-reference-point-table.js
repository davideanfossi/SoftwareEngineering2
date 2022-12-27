import { InputGroup, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";


export const InsertReferencePointTable = ({ rp, idx, updateList }) => {
  
  return (
        <Row
          key={"reference-point-table" + idx}
          style={{ cursor: "pointer" }}
        >
          <Col>
            <Container fluid>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  {"# " + idx}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Name"
                  aria-label="Reference point name"
                  aria-describedby="basic-addon1"
                  onChange={(ev) => {rp.name = ev.target.value;}}
                />
                <Form.Control
                  placeholder="Description"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={(ev) => {rp.description = ev.target.value;}}
                />
                <Button>
                <Trash onClick={() => {
                  updateList(rp);}}/>
                </Button>
              </InputGroup>
            </Container>
          </Col>
        </Row>
  );
};
