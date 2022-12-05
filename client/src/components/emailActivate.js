import { useEffect, useState } from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import API from '../API';

function EmailActivate() {

    const [success, setSuccess] = useState('');

    useEffect(() => {
        API.activateEmail({ 'token': window.location.pathname.split('/')[3] })
        .then(() => {setSuccess(true); 
           
        })
        .catch(() => { setSuccess(false);});
    }, []);

    return (
    <Container>
    <Row className="justify-content-center align-items-center" >
    <Card className="text-center" style={{ width: '20rem' }}>
        <Card.Body>
            <Card.Title>Email verification</Card.Title>
            <Card.Subtitle>{success ? 'Email verified successful' : 'Wrong or expired token'}</Card.Subtitle>
        </Card.Body>
    </Card>
    </Row>
</Container>
    );
}

export { EmailActivate };