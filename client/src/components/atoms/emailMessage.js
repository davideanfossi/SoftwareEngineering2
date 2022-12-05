import { Container, Card, Row } from 'react-bootstrap';

function EmailMessage() {
    return (
            <Container className='mt-4'>
                <Row className="justify-content-center align-items-center" >
                <Card className="text-center" style={{ width: '30rem' }}>
                    <Card.Body>
                        <Card.Title>Please check your email</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">We've sent you a verification message</Card.Subtitle>
                    </Card.Body>
                </Card>
                </Row>
            </Container>
    );
}

export { EmailMessage };