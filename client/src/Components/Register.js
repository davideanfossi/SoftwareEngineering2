import { useState } from 'react';
import { Container, Form, Button, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API'


function Register(props) {

    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const [additionalData, setAdditionalData] = useState(false);
    const [showAlert, setShowAlert] = useState('');
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData =
        {
            'email': email,
            'username': username,
            'role': role,
            'password': password,
            'name': name,
            'surname': surname,
            'phoneNumber': phoneNumber
        }
        //const credentials = { email, username, role, password, name, surname, phoneNumber };
        props.register(formData)
            .then(() => {setShowAlert('success'); navigate('/login')} )
            .catch((err) => {
                setShowAlert('error');
            });
            setValidated(true);
        
    };

    return (
        <>
            <Container>
                <Row style={{ "paddingLeft": "0.7rem" }}>
                    <b style={{ "fontSize": "2rem", "color": 'black', "paddingBottom": "0.3rem" }}>Insert Hike</b>
                </Row>
                {
                    showAlert === "success" ? 
                    <Alert variant="success" onClose={() => setShowAlert('')} dismissible>
                    <Alert.Heading>Registration has been successful!</Alert.Heading>
                    </Alert> 
                    : 
                    <>{
                    showAlert === "error" ?
                    <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
                    <Alert.Heading>Registration occurred with errors!</Alert.Heading>
                    </Alert> : null
                    }</>
                }
                <Row style={{ "paddingLeft": "0.7rem" }}>
                    <b style={{ "fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem" }}>Please compile the data down below:</b>
                </Row>
                    <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white"}}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <li>Select your profile:</li>
                            <Form.Group className='check-line'>
                                <Form.Check
                                    inline
                                    label="Hiker"
                                    name='group1'
                                    type='radio'
                                    id='inline-radio-1'
                                    onClick={() => {setAdditionalData(false); setRole('Hiker')}}
                                />
                                <Form.Check
                                    inline
                                    label="Local guide"
                                    name='group1'
                                    type='radio'
                                    id='inline-radio-2'
                                    onClick={() => {setAdditionalData(true); setRole('Local guide')}}
                                />
                                <Form.Check
                                    inline
                                    label="Hut worker"
                                    name='group1'
                                    type='radio'
                                    id='inline-radio-3'
                                    onClick={() => {setAdditionalData(true); setRole('Hut worker')} }
                                />
                            </Form.Group>
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
                                        maxLength={20} />
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='surname'>
                                    <Form.Label>Surname:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={surname}
                                        onChange={(ev) => setSurname(ev.target.value)}
                                        required={true}
                                        placeholder="Your surname here"
                                        maxLength={20} />
                                </Form.Group>

                                <Form.Group className='mb-2' controlId='phone-number'>
                                    <Form.Label>Phone number:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(ev) => setPhoneNumber(ev.target.value)}
                                        required={true}
                                        placeholder="Your phone number here"
                                        minLength={10}
                                        maxLength={13} />
                                </Form.Group>
                            </>
                            :
                            <>
                                <Form.Group className='mb-2' controlId='username'>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={username}
                                        onChange={(ev) => setUsername(ev.target.value)}
                                        required={true}
                                        placeholder="Create a fancy username"
                                        maxLength={20} />
                                </Form.Group>
                            </>}
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
                        {
                            confPassword === password ? <Form.Control.Feedback>Correct.</Form.Control.Feedback>
                                :
                                <Form.Control.Feedback type="invalid">passwords do not match</Form.Control.Feedback>
                        }
                        <Form.Group className='mt-3'>
                            <Button variant='warning' type='submit' size='lg' onSubmit={() => { handleSubmit() }}>
                                Register
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

export { Register };