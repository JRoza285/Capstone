import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header id="navbar">
      <nav>
        {token ? (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/liftlibrary">Lift Library</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/liftlibrary">Lift Library</NavLink>

          </>
        )}
      </nav>
    </header>
  );
}
