import { useState, React, useContext } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/user-context";
import API from '../API';

function Checkbox() {
    return (
        <Form.Group className='mb-3' controlId='remember-me'>
            <Form.Check
                type={'checkbox'}
                label={'Remember me'}
            />
        </Form.Group>
    )
}

function Registration() {
    return (
        <Form.Group className='mb-3' controlId='click-here'>
            <Row>
                <Col xs={6} md={3} lg={2}>
                    If not registered: {""}
                    <Link to='/register'>click here</Link>
                </Col>
            </Row>
        </Form.Group>
    );
}

function Login() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { "username": email, "password": password };

        API.login(credentials)
            .then((user) => {
                userContext.setUser({
                    id: user.id,
                    role: user.role,
                    user: user.username
                });
                navigate('/');
            })
            .catch((err) => {
                userContext.setUser({
                    id: undefined,
                    role: undefined,
                    user: undefined,
                });
                setShowAlert(true);
            });
    }

    return (
        <>
            <Container className='mt-3'>
                <Row>
                    <b style={{ "fontSize": "2rem", "color": 'black', "paddingBottom": "0.3rem" }}>Login</b>
                </Row>
                {
                    showAlert === true ?
                        <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
                            <Alert.Heading>Incorrect username and/or password</Alert.Heading>
                        </Alert> : null
                }
                <Container className="border border-4 rounded" style={{ "marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white" }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-2' controlId='email'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                required={true}
                                placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='password'>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                required={true}
                                minLength={8}
                                placeholder="Password" />
                        </Form.Group>
                        <Checkbox />
                        <Registration />
                        <Form.Group>
                            <Button variant='warning' type='submit' size='lg' onSubmit={() => { handleSubmit() }}>
                                Login
                            </Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Container>
        </>
    );

}

export { Login };

