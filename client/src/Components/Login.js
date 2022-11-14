import { useState, React } from 'react';
import { Button, Form, Container, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
    return(
    <Form.Group className='mb-3' controlId='click-here'>
        If not registered:
        <Button variant='link' href='/register'>
            click here
        </Button>
    </Form.Group>
    );
}

function Login(props) {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleLogin = (event) => {
        event.preventDefault();
        const credentials = { email, password };
        let user = props.login(credentials)
        .then( () => {props.setUser(user.username); navigate('');} )
        .catch((err) => { 
            setErrorMessage(err); setShowAlert(true); 
      });
    };

    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                        <Form onSubmit={handleLogin}>
                            <h1>Hike Tracker</h1>
                            <h3>Please insert your email and password:</h3>
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
                                    onChange={(ev)=>setPassword(ev.target.value)} 
                                    required={true} 
                                    minLength={8} 
                                    placeholder="Password" />
                            </Form.Group>
                            <Checkbox />
                            <Registration />
                            <Form.Group>
                                <Button variant='warning' type='submit' size='lg'>
                                    Login
                                </Button>
                                {' '}
                                <Button variant='light' type='reset' size='lg'>
                                    Cancel
                                </Button>
                            </Form.Group>
                            <Alert style={{ marginTop:20 }} variant='danger' dismissible
                            show={showAlert}   onClose={() => setShowAlert(false)}>{errorMessage}</Alert>
                        </Form>
                </Row>
            </Container>
        </>
    );

}

export { Login };

