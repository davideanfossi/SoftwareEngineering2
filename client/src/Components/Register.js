import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API';


function Register(props) {

    const [role, setRole] = useState('Hiker');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const [additionalData, setAdditionalData] = useState(false);
    const [showAlert, setShowAlert] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let flag = false;

        if(username === ''){setUsername(''); flag=true;}
        if(password === ''){setPassword(''); flag=true;}
        if(confPassword === ''){setConfPassword(''); flag=true;}
        if(password !== confPassword){setPassword(''); setConfPassword(''); flag=true;}

        if(role !== 'Hiker'){
            if(name === ''){setName(''); flag=true;}
            if(surname === ''){setSurname(''); flag=true;}
            if(phoneNumber === ''){setPhoneNumber(''); flag=true;}
        }

        if(flag) return;

        let formData =
        {
            'email': email,
            'username': username ? username : "",
            'role': role,
            'password': password,
            'name': name ? name : "",
            'surname': surname ? surname : "",
            'phoneNumber': phoneNumber ? phoneNumber : ""
        }
        //const credentials = { email, username, role, password, name, surname, phoneNumber };
        props.register(formData)
            .then(() => {setShowAlert('success');} )
            .catch((err) => {
                setShowAlert('error');
            });
        
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
                                </Alert> 
                                : <></>
                        }</>
                }
                <Row style={{ "paddingLeft": "0.7rem" }}>
                    <b style={{ "fontSize": "1.3rem", "color": 'black', "paddingBottom": "0.6rem" }}>Please compile the data down below:</b>
                </Row>
                    <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white"}}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>Select your profile:</Form.Label> 
                            <Form.Group className='check-line'>
                                <Form.Check
                                    inline
                                    label="Hiker"
                                    name='group1'
                                    type='radio'
                                    id='inline-radio-1'
                                    defaultChecked
                                    onClick={() => {setAdditionalData(false); setRole('Hiker'); setName(""); setSurname(""); setPhoneNumber("")}}
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
                                        minLength={1}
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
                                        minLength={1}
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
                                        isInvalid={phoneNumber && isNaN(Number.parseInt(phoneNumber))}
                                        value={phoneNumber}
                                        onChange={(ev) => setPhoneNumber(ev.target.value)}
                                        required={true}
                                        placeholder="Your phone number here"
                                        minLength={10}
                                        maxLength={10} />
                                    <Form.Control.Feedback type="invalid">Please insert a valid phone number</Form.Control.Feedback>
                                </Form.Group>
                            </>
                            :
                            <>
                                <Form.Group className='mb-2' controlId='username'>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={username}
                                        minLength={1}
                                        onChange={(ev) => setUsername(ev.target.value)}
                                        required={true}
                                        placeholder="Create a fancy username"
                                        maxLength={30} />
                                </Form.Group>
                            </>}
                        <Form.Group className='mb-2' controlId='email'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder="name@example.com"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                required={true}
                                maxLength={50} />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='password'>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                required={true}
                                minLength={6}
                                maxLength={15}
                                placeholder="Enter a password"
                                aria-describedby="passwordHelpBlock" />
                            <Form.Text id="passwordHelpBlock" muted>
                                Your password must be 6-15 characters long, contain letters and numbers.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='conf-password'>
                            <Form.Label>Confirm password:</Form.Label>
                            <Form.Control
                                type='password'
                                isInvalid={confPassword && confPassword !== password}
                                value={confPassword}
                                onChange={(ev) => setConfPassword(ev.target.value)}
                                required={true}
                                minLength={6}
                                maxLength={15}
                                placeholder="Confirm your password" />
                            <Form.Control.Feedback type="invalid">passwords do not match</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mt-3'>
                            <Row xs="auto">
                                <Col>
                                    <Button variant="warning" type="submit" size='lg'>Register</Button> 
                                    &ensp; &ensp;
                                    <Button variant='light' size='lg'>Cancel</Button>
                                </Col>         
                            </Row>
                        </Form.Group>
                    </Form>
                </Container>
            </Container>
        </>
    );
}

export { Register };