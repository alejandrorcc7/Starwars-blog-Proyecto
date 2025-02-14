import React, { useContext, useState, useEffect } from "react";
import CardContext from "../context/CardContext";
import { useNavigate } from "react-router-dom";

// Importar todas las imágenes de manera dinámica
const images = import.meta.glob("/src/assets/img/*/*.{jpg,png}", { eager: true });

const Home = () => {
  const { addCard, removeCard, card } = useContext(CardContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ people: [], planets: [], vehicles: [] });

  const endpoints = ["people", "planets", "vehicles"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = "https://www.swapi.tech/api/";

        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(`${baseUrl}${endpoint}/`);
            const result = await response.json();
            const details = await Promise.all(
              result.results.map(async (item) => {
                const itemResponse = await fetch(item.url);
                const itemData = await itemResponse.json();
                return { ...item, properties: itemData.result.properties };
              })
            );
            return { [endpoint]: details };
          })
        );

        setData(Object.assign({}, ...responses));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleLike = (id, type, name) => {
    const uniqueId = `${type}-${id}`;
    const isLiked = card.some((fav) => fav.id === uniqueId);
    isLiked ? removeCard({ id: uniqueId, name }) : addCard({ id: uniqueId, name });
  };

  const verCard = (id, type, url) => navigate("/card", { state: { id, type, url } });

  const renderCards = (items, type) => (
    <div className="overflow-x-auto d-flex justify-content-center" style={{ width: "900px", height: "520px", whiteSpace: "nowrap" }}>
      <div className="d-flex flex-fill">
        {items.map((item) => {
          const uniqueId = `${type}-${item.uid}`;
          const isLiked = card.some((fav) => fav.id === uniqueId);

          // Construir la ruta de la imagen correctamente
          const imagePath = `/src/assets/img/${type}/${item.uid}.jpg`;
          const foundImage = images[imagePath];
          const imageURL = foundImage ? foundImage.default : "/img/default.jpg"; // Si no se encuentra, usar la imagen por defecto

          return (
            <div key={uniqueId} className="card custom-card m-2" style={{ width: "300px", minWidth: "300px", maxWidth: "500px", height: "500px" }}>
              <img 
                src={imageURL} 
                className="card-img-top p-3 " 
                alt={item.properties.name} 
                onError={(e) => e.target.src = "/img/default.jpg"} 
                style={{ width: "300px", height: "300px", objectFit: "cover" }} // Ajustar el tamaño de la imagen
              />
              <div className="card-body">
                <h5 className="card-title">{item.properties.name}</h5>
                <p className="card-text">
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
                <button className="btn btn-primary" onClick={() => verCard(item.uid, type, item.url)}>Learn more!</button>
                <button className={`btn float-end ${isLiked ? "btn-danger" : "btn-outline-danger"}`} onClick={() => toggleLike(item.uid, type, item.properties.name)}>
                  {isLiked ? "♥" : "♡"}
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
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          {renderCards(data[type], type)}
        </div>
      ))}
    </div>
  );
};

export default Home;
