import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
import { Register } from "./Register"
export const Layout = (props) => {
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
            <NavDropdown title="User" id="basic-nav-dropdown">
              <NavDropdown.Item>Signed in as: { props.user }</NavDropdown.Item>
              <NavDropdown.Item>Logout</NavDropdown.Item>
            </NavDropdown>
              <Navbar.Brand href="#user">
                <img
                  src="client\src\user.svg"
                  width="30"
                  height="30"
                  className="justify-content-end"
                />
              </Navbar.Brand>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
