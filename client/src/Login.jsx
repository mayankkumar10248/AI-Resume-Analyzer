  import { useState } from "react";
import "./Login.css";

function Login({ onBack, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://ai-resume-analyzer-5csg.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Login Successful!");

      localStorage.setItem("user", JSON.stringify(data.user));

      if (onLogin) {
        onLogin(data.user);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="login-header">

          <div className="login-icon">
            🔐
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to your AI Resume Analyzer account
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            >
              Forgot Password?
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

          <button onClick={onRegister}>
            Create account
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;