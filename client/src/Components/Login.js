import { useState, React } from 'react';
import { Button, Form, Container, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API'

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = {"username": email, "password": password };
        
        let user = props.login(credentials)
        .then( () => {props.setUser(user.username); navigate('/');} )
        .catch((err) => { 
            setShowAlert(true); 
        });
    }

    return (
        <>
            <Container>
                <Row style={{"paddingLeft": "0.7rem"}}>
                            <b style={{"fontSize": "2rem", "color": 'black', "paddingBottom": "0.3rem"}}>Insert Hike</b>
                </Row>
                {
                    showAlert === true ? 
                    <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
                    <Alert.Heading>Registration occurred with errors!</Alert.Heading>
                    </Alert> : null
                }
                <Row style={{"paddingLeft": "0.7rem"}}>
                            <b style={{"fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem"}}>Please insert your email and password:</b>
                </Row>
                    <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white"}}>
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
                                    onChange={(ev)=>setPassword(ev.target.value)} 
                                    required={true} 
                                    minLength={8} 
                                    placeholder="Password" />
                            </Form.Group>
                            <Checkbox />
                            <Registration />
                            <Form.Group>
                                <Button variant='warning' type='submit' size='lg' onSubmit={() => {handleSubmit()}}>
                                    Login
                                </Button>
                                {' '}
                                <Button variant='light' type='reset' size='lg'>
                                    Cancel
                                </Button>
                            </Form.Group>
                        </Form>
                    </Container>
            </Container>
        </>
    );

}

export { Login };

