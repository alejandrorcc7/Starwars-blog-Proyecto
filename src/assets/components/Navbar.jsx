import React, { useState, useContext } from "react";
import CardContext from "../context/CardContext";

const Navbar = () => {
  const { card, removeCard } = useContext(CardContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/src/assets/img/logo.png" alt="Bootstrap" width="100" height="90" />
        </a>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end m-3">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary dropdown-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              Favorites ({card.length || 0})
            </button>
            <ul className={`dropdown-menu${isOpen ? " show" : ""}`} style={{ top: "100%", left: "0" }}>
  {card.length > 0 ? (
    card.map((item) => (
      <li key={item.id} className="d-flex justify-content-between align-items-center px-3">
        {item.name} {/* Ahora sí se mostrará el nombre */}
        <button className="btn btn-danger btn-sm ms-2" onClick={() => removeCard(item)}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </li>
    ))
  ) : (
    <li className="dropdown-item text-muted text-center">No favorites yet</li>
  )}
</ul>


          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
