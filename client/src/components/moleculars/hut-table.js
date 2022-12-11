import { Container } from "react-bootstrap";
import { HutRow } from "../atoms/hut-row";

export const HutTable = ({ hutList }) => {
  return (
    <Container className="hike-table" fluid>
      {hutList.map((hut, count) => (
        <HutRow hut={hut} key={hut.id} even={count % 2 === 0} />
      ))}
    </Container>
  );
};
