 import { useState } from "react";
import "./Login.css";

function Login({ onBack, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    alert("Login functionality will be connected to the backend soon.");

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to your AI Resume Analyzer account
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>

        </form>

        <div className="register-link">
          Don't have an account?{" "}
          <span onClick={onRegister}>
            Create account
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;