import { useState } from 'react';
import { Container, Form, Button, Row, Alert } from 'react-bootstrap';
import { Header } from './Header'

function Register() {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const [additionalData, setAdditionalData] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    //A cosa serve Header?? a riga 16
    return(
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Form>
                        <h1>Hike Tracker</h1>
                        <h3>Please compile the data down below:</h3>
                        {additionalData ? 
                        <>
                        <Form.Group className='mb-2' controlId='name'>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control 
                                    type="text" 
                                    value={name} 
                                    onChange={(ev) => setName(ev.target.value)} 
                                    required={true} 
                                    placeholder="Your name here"
                                    maxLength={20}/>
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='surname'>
                        <Form.Label>Surname:</Form.Label>
                        <Form.Control 
                                    type='text' 
                                    value={surname} 
                                    onChange={(ev) => setSurname(ev.target.value)} 
                                    required={true} 
                                    placeholder="Your surname here" 
                                    maxLength={20}/>
                        </Form.Group>
                        </> 
                        : <></> }
                        <Form.Group className='mb-2' controlId='surname'>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control 
                                    type='text' 
                                    value={username} 
                                    onChange={(ev) => setUsername(ev.target.value)} 
                                    required={true} 
                                    placeholder="Create a fancy username"
                                    maxLength={20} />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='email'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control 
                                    type='email' 
                                    value={email} 
                                    onChange={(ev) => setEmail(ev.target.value)} 
                                    required={true} 
                                    placeholder="Enter email"
                                    maxLength={40} />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='password'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control 
                                    type='password' 
                                    value={password} 
                                    onChange={(ev) => setPassword(ev.target.value)} 
                                    required={true}
                                    minLength={8}
                                    maxLength={20}
                                    placeholder="Enter a password" 
                                    aria-describedby="passwordHelpBlock" />
                        <Form.Text id="passwordHelpBlock" muted>
                            Your password must be 8-20 characters long, contain letters and numbers.
                        </Form.Text>
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='conf-password'>
                        <Form.Label>Confirm password:</Form.Label>
                        <Form.Control 
                                    type='password' 
                                    value={confPassword} 
                                    onChange={(ev) => setConfPassword(ev.target.value)} 
                                    required={true} 
                                    minLength={8}
                                    maxLength={20}
                                    placeholder="Confirm your password" />
                        </Form.Group>
                        <Form.Group className='mt-3'>
                                <Button variant='warning' type='submit' size='lg' onSubmit={() => {setShowAlert(true)}}>
                                    Register
                                </Button>
                                {' '}
                                <Button variant='light' type='reset' size='lg'>
                                    Cancel
                                </Button>
                            </Form.Group>
                            <Alert style={{ marginTop:20 }} variant='success' dismissible
                            show={showAlert}   onClose={() => setShowAlert(false)}>You registered correctly!</Alert>
                    </Form>
                </Row>
            </Container>
        </>
    );
}

export { Register };