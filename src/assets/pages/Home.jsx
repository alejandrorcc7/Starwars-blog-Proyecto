import React, { useContext } from "react"; // Importa React y useContext
import CardContext from "../context/CardContext"; // Importa el contexto de tarjetas
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegación

// Importa imágenes de manera dinámica
const images = import.meta.glob("/src/assets/img/*/*.{jpg,png}", { eager: true });

const Home = () => {
  const { addCard, removeCard, card, data } = useContext(CardContext); // Usa el contexto de tarjetas
  const navigate = useNavigate(); // Inicializa la función de navegación
  const endpoints = [ "planets", "people",  "vehicles"]; // Define categorías

  // Función para alternar "like" en una tarjeta
  const toggleLike = (id, type, name) => {
    const uniqueId = `${type}-${id}`; // Crea ID único
    const isLiked = card.some((fav) => fav.id === uniqueId); // Verifica si está en favoritos
    isLiked ? removeCard({ id: uniqueId, name }) : addCard({ id: uniqueId, name });
  };

  // Función para navegar a la vista de detalle de la tarjeta
  const verCard = (id, type, url) => navigate("/card", { state: { id, type, url } });

  // Renderiza las tarjetas de una categoría
  const renderCards = (items, type) => (
    <div className="overflow-x-auto d-flex justify-content-center" style={{ width: "900px", height: "520px", whiteSpace: "nowrap" }}>
      <div className="d-flex flex-fill">
        {items.map((item) => {
          const uniqueId = `${type}-${item.uid}`; // ID único
          const isLiked = card.some((fav) => fav.id === uniqueId); // Verifica si está en favoritos
          const imagePath = `/src/assets/img/${type}/${item.uid}.jpg`; // Ruta de la imagen
          const foundImage = images[imagePath]; // Busca la imagen importada
          const imageURL = foundImage ? foundImage.default : "/img/default.jpg"; // Usa imagen o default

          return (
            <div key={uniqueId} className="card custom-card m-2" style={{ width: "300px", minWidth: "300px", maxWidth: "500px", height: "500px" }}>
              {/* Imagen de la tarjeta */}
              <img 
                src={imageURL} 
                className="card-img-top p-3" 
                alt={item.properties.name} 
                onError={(e) => e.target.src = "/img/default.jpg"} 
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.properties.name}</h5> {/* Nombre */}
                <p className="card-text"> {/* Información según tipo */}
                  {type === "people" && (
                    <>
                      <strong>Gender:</strong> {item.properties.gender} <br />
                      <strong>Hair Color:</strong> {item.properties.hair_color} <br />
                      <strong>Eye Color:</strong> {item.properties.eye_color}
                    </>
                  )}
                  {type === "planets" && (
                    <>
                      <strong>Population:</strong> {item.properties.population} <br />
                      <strong>Terrain:</strong> {item.properties.terrain}
                    </>
                  )}
                  {type === "vehicles" && (
                    <>
                      <strong>Model:</strong> {item.properties.model}
                    </>
                  )}
                </p>
                <button className="btn btn-primary" onClick={() => verCard(item.uid, type, item.url)}>Learn more!</button> {/* Botón detalles */}
                <button className={`btn float-end ${isLiked ? "btn-danger" : "btn-outline-danger"}`} onClick={() => toggleLike(item.uid, type, item.properties.name)}>
                  {isLiked ? "♥" : "♡"} {/* Botón de "like" */}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      {endpoints.map((type) => (
        <div key={type}>
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2> {/* Título */}
          {renderCards(data[type], type)} {/* Renderiza tarjetas */}
        </div>
      ))}
    </div>
  );
};

export default Home; // Exporta el componente
