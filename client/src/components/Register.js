import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import API from '../API';
import { CardMessage } from './atoms/card-message';


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
    const [alertMsg, setAlertMsg] = useState('');

    const handleCancel = () => {
        setName('');
        setSurname('');
        setUsername('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setConfPassword('');
        setShowAlert('');
        setAlertMsg('');
    };


    const validateData= ()=>{

        let flag = false;

        if (username === '') { setUsername(''); flag = true; }
        if (password === '') { setPassword(''); flag = true; }
        if (confPassword === '') { setConfPassword(''); flag = true; }
        if (password !== confPassword) { setPassword(''); setConfPassword(''); flag = true; }

        if (role !== 'Hiker') {
            if (name === '') { setName(''); flag = true; }
            if (surname === '') { setSurname(''); flag = true; }
            if (phoneNumber === '') { setPhoneNumber(''); flag = true; }
        }

        return flag;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const flag= validateData();
        if (flag) return;

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

        API.registerUser(formData)
            .then(() => { setShowAlert('success'); })
            .catch((err) => {
                setAlertMsg(err);
                setShowAlert('error');
            });

    };

    function resetAlert() { setShowAlert('') }
    function handleHikerClick() { setAdditionalData(false); setRole('Hiker'); setName(""); setSurname(""); setUsername(""); setPhoneNumber("") }
    function handleLocalGuideClick() { setAdditionalData(true); setRole('Local Guide'); }
    function handleHutWorkerClick() { setAdditionalData(true); setRole('Hut Worker'); }
    function handleName(ev) { setName(ev.target.value) }
    function handleSurname(ev) { setSurname(ev.target.value) }
    function handleUsername(ev) { setUsername(ev.target.value) }
    function handlePhoneNumber(ev) { setPhoneNumber(ev.target.value) }
    function handleEmail(ev) { setEmail(ev.target.value) }
    function handlePassword(ev) { setPassword(ev.target.value) }
    function handleConfPassword(ev) { setConfPassword(ev.target.value) }

    return (
        <>
            <Container className='mt-3'>
                {
                    showAlert === "success" ?
                        <Row className='justify-content-center align-items-center mt-4 mb-4'>
                            <CardMessage className="text-center" style={{ width: '60vw' }} title="Please check your email" subtitle="We've sent you a verification message" />
                        </Row>
                        :
                        <>{
                            showAlert === "error" ?
                                <Alert variant="danger" onClose={resetAlert} dismissible>
                                    <Alert.Heading>{alertMsg}</Alert.Heading>
                                </Alert>
                                : <></>
                        }</>
                }
                <Row>
                    <b style={{ "fontSize": "2rem", "color": 'black', "paddingBottom": "0.3rem" }}>Register</b>
                </Row>
                <Container className="border border-4 rounded" style={{ "marginTop": "0.5rem", "padding": "1rem", "backgroundColor": "white" }}>
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
                                onClick={handleHikerClick}
                            />
                            <Form.Check
                                inline
                                label="Local guide"
                                name='group1'
                                type='radio'
                                id='inline-radio-2'
                                onClick={handleLocalGuideClick}
                            />
                            <Form.Check
                                inline
                                label="Hut worker"
                                name='group1'
                                type='radio'
                                id='inline-radio-3'
                                onClick={handleHutWorkerClick}
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
                                        onChange={handleName}
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
                                        onChange={handleSurname}
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
                                        onChange={handlePhoneNumber}
                                        required={true}
                                        placeholder="Your phone number here"
                                        minLength={10}
                                        maxLength={10} />
                                    <Form.Control.Feedback type="invalid">Please insert a valid phone number</Form.Control.Feedback>
                                </Form.Group>
                            </>
                            :
                            <></>
                        }
                        <Form.Group className='mb-2' controlId='username'>
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type='text'
                                value={username}
                                minLength={1}
                                onChange={handleUsername}
                                required={true}
                                placeholder="Create a fancy username"
                                maxLength={30} />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='email'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder="name@example.com"
                                value={email}
                                onChange={handleEmail}
                                required={true}
                                maxLength={50} />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='password'>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={handlePassword}
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
                                onChange={handleConfPassword}
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
                                    <Button variant='light' size='lg' onClick={handleCancel}>Cancel</Button>
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