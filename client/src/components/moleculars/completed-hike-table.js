import { Container } from "react-bootstrap";
import { CompletedHikeRow } from "../atoms/completed-hike-row";

export const CompletedHikeTable = ({ completedHikeList }) => {
  return (
    <Container className="hike-table" fluid>
      {completedHikeList.map((hike, count) => (
        <CompletedHikeRow
          recordedHike={hike}
          key={hike.id}
          even={count % 2 === 0}
        />
      ))}
    </Container>
  );
};
