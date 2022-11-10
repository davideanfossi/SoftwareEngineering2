import { useState, React } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';

function Checkbox() {
    return (
        <Form.Group controlId='remember-me'>
            <div className="mb-3">
                <Form.Check
                    type={'checkbox'}
                    label={'Remember me'}
                />
            </div>
        </Form.Group>
    )
}

function Registration() {
    return(
    <Form.Group controlId='click-here'>
        <div className="mb-3">
        If you are not already registered: {' '}
        <Button variant='link' href='registration'>
            click here
        </Button>
        </div>
    </Form.Group>
    );
}

function LoginForm(props) {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        const credentials = { email, password };
        props.login(credentials)
        .then( () => navigate('')  )
        .catch((err) => { 
            setErrorMessage(err); setShowAlert(true); 
      });
    };

    //Header a riga 55
    return (
        <>
            
            <Container>
                <Row className="justify-content-md-center">
                        <Form onSubmit={handleLogin}>
                            <h1>Hike Tracker</h1>
                            <h3>Please insert your email and password</h3>
                            <Form.Group className='mb-2' controlId='email'>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={email} 
                                    onChange={(ev) => setEmail(ev.targer.value)} 
                                    required={true} 
                                    placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className='mb-2' controlId='password'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control 
                                    type='password' 
                                    value={password} 
                                    onChange={(ev)=>setPassword(ev.targer.value)} 
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

export { LoginForm };

