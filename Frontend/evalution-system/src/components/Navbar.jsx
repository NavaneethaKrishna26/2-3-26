import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">TeamEval Pro</div>
      <div className="nav-links">
        <Link to="/" className="nav-btn">
          Home
        </Link>
        {!localStorage.getItem("token") ? (
          <>
            <Link to="/register" className="nav-btn nav-register">
              Register
            </Link>
            <Link to="/login" className="nav-btn nav-login">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/admin-dashboard" className="nav-btn nav-login">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="nav-btn nav-register">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
