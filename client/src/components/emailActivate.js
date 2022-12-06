import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { CardMessage } from './atoms/card-message';
import API from '../API';

function EmailActivate() {

    const [success, setSuccess] = useState('');

    useEffect(() => {
        API.activateEmail({ 'token': window.location.pathname.split('/')[3] })
            .then(() => {
                setSuccess(true);

            })
            .catch(() => { setSuccess(false); });
    }, []);

    return (
        <Container className='mt-5'>
            <Row className="justify-content-center align-items-center" >
                {success ?
                    <CardMessage className="text-center" bgVariant="light" textVariant="black" border="success" style={{ width: '70vw'}} 
                        title="Email verification" subtitle="Email successfully verified"/>
                    :
                    <CardMessage className="text-center" bgVariant="light" textVariant="black" border="danger" style={{ width: '70vw'}} 
                        title="Email verification" subtitle="Wrong or expired token"/>
                }
            </Row>
        </Container>
    );
}
// text-center
// style={{ width: '70vw', "background-color": "LightGray" }}
export { EmailActivate };