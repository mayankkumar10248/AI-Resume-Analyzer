import { useState } from "react";
import "./Login.css";

function Login({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login details:", {
      email,
      password,
    });

    alert("Login functionality will be connected soon.");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="login-header">
          <div className="login-icon">
            🔐
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to continue to your AI Resume Analyzer
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-button"
              onClick={() =>
                alert("Password reset will be added later.")
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        <div className="signup-text">
          Don't have an account?
          <button
            type="button"
            onClick={() =>
              alert("Registration will be added next.")
            }
          >
            Create account
          </button>
        </div>

      </div>

    </div>
  );
}

export default Login;