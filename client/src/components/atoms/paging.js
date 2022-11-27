import { Col, Container, Pagination, Row } from "react-bootstrap";

export const Paging = ({ page, onPageChange, totalPages }) => {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <Container fluid>
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination>{items}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};
