import { useState, React } from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Outlet } from 'react-router-dom';
import { Register } from './Register';

function LoginForm() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    return (
        <>
        <h1>Hike Tracker</h1>
        <h3>Please insert your email and password:</h3>
        <form>
            <label>email:
                <input type="text" />
            </label>
        </form>
        <form>
            <label>password:
                <input type="password" name="password" />
            </label>
        </form>
        If you are not already registered:
        <nav>
            <li>
                <Link to='/register'>click here</Link>
            </li>
        </nav>
        <Outlet />
        <Router>
            <Route path="register" element={<Register />} />
        </Router>
        <Button color='yellow'>
            Login
        </Button>
        </>
    );

}

export { LoginForm };

