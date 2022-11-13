import { Navbar, Nav, Container } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
export const Layout = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const goLogin = () => {
    navigate("/login");
  }
  const goRegister = () => {
    navigate("/register");
  }

  return (
    <>
      <Navbar className="nav">
        <Container>
          <Navbar.Brand onClick={goHome}>Hike Tracker</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={goHome}>Home</Nav.Link>
            <Nav.Link onClick={goLogin}>Login</Nav.Link>
            <Nav.Link onClick={goRegister}>Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
