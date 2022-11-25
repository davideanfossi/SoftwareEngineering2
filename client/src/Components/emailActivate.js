import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Alert } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import API from '../API'

function EmailActivate() {

    const navigate = useNavigate(); 
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        API.activateEmail({ 'token': window.location.pathname.split('/')[3] })
        .then(() => {setSuccess(true); 
           
        })
        .catch(() => { setSuccess(false);});
    }, []);

    return (
        <h1>
            {success ? 'Email verified successful' : 'Wrong or expired token'}
        </h1>
    );
}

export { EmailActivate };