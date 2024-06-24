import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import '../styles/LoginPage.css'

const Login = () => {
  const location = useLocation();
  const successMessage = location.state && location.state.successMessage;
  console.log("login " + successMessage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email, password });
      let token = response.data.token;

      // Redirect to Kanban page after successful login
      navigate('/board', { state: { token } });
      
    } catch (error: any) {
      setError(error.response.data.message)
    }
  };
  return (
      <div className="form_container">
        {successMessage && <p className="success">{successMessage}</p>}
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
          </form>
        <div className="link"><p>You don't have an account ?</p> <p><Link to="/signup">SignUp</Link></p></div>

      </div>
  );
};

export default Login;
