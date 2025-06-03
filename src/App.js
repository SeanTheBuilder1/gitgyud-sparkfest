import './App.css';
import supabase from './supabase-client';
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

function App() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  return (
    <div>
      <h1>Sign up for Newsletter</h1>
      <form>
        <input
          name="Email"
          type={'email'}
          value={email}
          required
          placeholder="joe@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          name="Name"
          type={'name'}
          value={name}
          required
          placeholder="Joe"
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit">Sign up</button>
        <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} />
      </form>
    </div>
  );
}

export default App;
