import { Link } from "react-router-dom"

function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Pokemones</Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Inicio</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar