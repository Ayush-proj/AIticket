import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logoutSuccess } from "./Features/Auth/authSlice";

function App() {
  // LOCAL state: purely visual, nobody else needs it.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // APP state: the single source of truth for authentication.
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setValidationError("Please fill in both email and password.");
      return;
    }
    setValidationError("");

    try {
      // .unwrap() rejects the promise if the thunk was rejected,
      // so we can await it like normal async code.
      await dispatch(login({ email: trimmedEmail, password })).unwrap();

      setEmail("");
      setPassword("");
    } catch {
      // Nothing to do. The message is already in state.auth.error.
      // We do NOT store it a second time here.
    }
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <div
        style={{
          margin: "20px auto",
          padding: "10px",
          border: "1px solid #ddd",
          maxWidth: "300px",
        }}
      >
        <h3>Current Auth State</h3>
        <p>User: {user ? user.name : "null"}</p>
        <p>Email: {user ? user.email : "null"}</p>
        <p>Role: {user ? user.role : "null"}</p>
        <p>Token: {token ? "present" : "not present"}</p>
        <p>Loading: {loading ? "true" : "false"}</p>
        <p>Error: {error ? error : "null"}</p>
      </div>

      {user ? (
        <div>
          <p>
            Logged in as {user.name} ({user.email})
          </p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            gap: "12px",
            width: "280px",
          }}
        >
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            disabled={loading}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationError("");
            }}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            disabled={loading}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationError("");
            }}
          />

          {validationError && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {validationError}
            </span>
          )}

          {error && (
            <span style={{ color: "red", fontSize: "14px" }}>{error}</span>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}

export default App;