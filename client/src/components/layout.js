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

  const handleLogout = () => {
    console.log("TODO logout");
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
            <img 
            src="user.svg" 
            alt="" 
            width="32" 
            height="32"
            />
            <NavDropdown title="User" id="basic-nav-dropdown">
              <NavDropdown.Item>Signed in as: { props.user }</NavDropdown.Item>
              <NavDropdown.Item onClick={() => { handleLogout(); }}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
