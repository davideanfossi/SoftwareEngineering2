import { InputGroup, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { useState } from "react";

export const InsertReferencePointTable = ({ rp, idx, updateList, updaterp }) => {
  const [name, setName] = useState(rp.name);
  const [description, setDescription] = useState(rp.description);
  return (
    <Row key={"reference-point-table" + idx} style={{ cursor: "pointer" }}>
      <Col>
        <Container fluid>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">{"# " + idx}</InputGroup.Text>
            <Form.Control
              placeholder="Name"
              aria-label="Reference point name"
              aria-describedby="basic-addon1"
              value={name}
              onChange={(ev) => {
                rp.name = ev.target.value;
                setName(ev.target.value);
                updaterp(rp);
              }}
            />
            <Form.Control
              placeholder="Description"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={description}
              onChange={(ev) => {
                rp.description = ev.target.value;
                setDescription(ev.target.value);
                updaterp(rp);
              }}
            />
            <Button>
              <Trash
                onClick={() => {
                  updateList(rp);
                }}
              />
            </Button>
          </InputGroup>
        </Container>
      </Col>
    </Row>
  );
};
