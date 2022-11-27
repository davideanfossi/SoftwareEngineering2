import { useEffect, useState } from 'react';
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
        <h1>
            {success ? 'Email verified successful' : 'Wrong or expired token'}
        </h1>
    );
}

export { EmailActivate };