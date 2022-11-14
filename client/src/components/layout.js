import { Navbar, Nav, Container } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
import { Register } from "./register"
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
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: { Register.username }
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
