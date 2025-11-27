import { useState } from "react";
import type { FormEvent } from 'react'
import { signUp } from "../lib/auth-client"
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log(email)
      const {data, error} = await signUp.email({
        name: "John Doe",
        email,
        password,
      }, {
        onSuccess: () => {
          navigate('/');
        },
        onError: (error) => {
          console.error("Signup failed:", error);
        }
      });
      console.log(data)

    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>

        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>

        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
