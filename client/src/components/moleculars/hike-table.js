import { Container } from "react-bootstrap";
import { HikeRow } from "../atoms/hike-row";

export const HikeTable = ({ hikeList }) => {
  return (
    <Container className="hike-table" fluid>
      {hikeList.map((hike, count) => (
        <HikeRow hike={hike} key={hike.id} even={count % 2 === 0} />
      ))}
    </Container>
  );
};
