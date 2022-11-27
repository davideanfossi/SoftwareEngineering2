import { Navbar, Nav, Container, NavDropdown, Row, Col } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../context/user-context";
import { PersonCircle } from "react-bootstrap-icons";
import API from "../../API";

export const Layout = (props) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const goHome = () => {
    navigate("/");
  };
  const goLogin = () => {
    navigate("/login");
  };
  const goRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    API.logout().then(
      (res) => {
        userContext.setUser({
          id: undefined,
          role: undefined,
          user: undefined,
        })
        navigate("/");
      }
    )
      .catch((err) => console.log(err));
  }


  const goInsertHike = () => {
    navigate("/insert-hike");
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="nav">
        <Container fluid>
          <Navbar.Brand onClick={goHome}>Hike Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link onClick={goHome}>Home</Nav.Link>
              {["Local Guide"].includes(userContext.user.role) && (
                <Nav.Link onClick={goInsertHike}>New Hike</Nav.Link>
              )}
              {userContext.user.id === undefined &&
                <>
                  <Nav.Link onClick={goLogin}>Login</Nav.Link>
                  <Nav.Link onClick={goRegister}>Register</Nav.Link>
                </>
              }
            </Nav>
            {userContext.user.id !== undefined &&
              <Container fluid>
                <Row >
                  <Col xs={1}>
                    <PersonCircle />
                  </Col>
                  <Col xs={1} >
                    <NavDropdown title={userContext.user.user} id="basic-nav-dropdown">
                      <NavDropdown.Item onClick={() => { handleLogout(); }}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Col>
                </Row>
              </Container>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
