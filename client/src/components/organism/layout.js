import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
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
    API.logout()
      .then((res) => {
        userContext.setUser({
          id: undefined,
          role: undefined,
          user: undefined,
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const goInsertHike = () => {
    navigate("/insert-hike");
  };

  const goMyHikes = () => {
    navigate("/my-hikes");
  };
  const goInsertParking = () => {
    navigate("/insertparking");
  };
  const goSearchHut = () => {
    navigate("/search-hut");
  }
  const goMyHuts = () => {
    navigate("/my-huts");
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="nav">
        <Container fluid>
          <Navbar.Toggle className="me-2" />
          <Navbar.Brand onClick={goHome}>
            <div className="brand">Hike Tracker</div>
          </Navbar.Brand>
          {userContext.user.id !== undefined && (
            <div className="d-flex justify-content-end">
              <NavDropdown
                align="end"
                className="dropdown-menu-left"
                title={
                  <div className="d-flex align-items-center">
                    <PersonCircle />
                    <div className="px-1">{userContext.user.user}</div>
                  </div>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => {
                    goMyHikes();
                  }}
                >
                  My hikes
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    goMyHuts();
                  }}
                >
                  My huts
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          )}
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link onClick={goHome}>Home</Nav.Link>
              {["Hiker", "Local Guide"].includes(userContext.user.role) && (
                <Nav.Link onClick={goSearchHut}>Search Hut</Nav.Link>
              )}
              {["Local Guide"].includes(userContext.user.role) && (
                <Nav.Link onClick={goInsertHike}>New Hike</Nav.Link>
              )}
              {["Local Guide"].includes(userContext.user.role) && (
                <Nav.Link onClick={goInsertParking}>New Parking</Nav.Link>
              )}
              {userContext.user.id === undefined && (
                <>
                  <Nav.Link onClick={goLogin}>Login</Nav.Link>
                  <Nav.Link onClick={goRegister}>Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
