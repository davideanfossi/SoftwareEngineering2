import { Navbar, Nav, Container } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
export const Layout = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  const goInsertHike = () => {
    navigate("/insert-hike");
  };
  return (
    <>
      <Navbar className="nav">
        <Container>
          <Navbar.Brand onClick={goHome}>Hike Tracker</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={goHome}>Home</Nav.Link>
            <Nav.Link onClick={goInsertHike}>New Hike</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
