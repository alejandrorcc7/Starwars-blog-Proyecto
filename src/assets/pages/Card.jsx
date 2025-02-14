import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Importar las imágenes de manera dinámica
const images = import.meta.glob("/src/assets/img/*/*.{jpg,png}", { eager: true });

const Card = () => {
  const { state } = useLocation();
  const { id, type } = state || {};
  
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`);
        if (response.ok) {
          const data = await response.json();
          const details = {
            ...data.result.properties,
            description: data.result.description,
          };
          setItemDetails(details);
        } else {
          console.error("Failed to fetch data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    if (id && type) {
      fetchItemDetails();
    }
  }, [id, type]);

  if (!itemDetails) {
    return <div class="text-center m-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  }

  // Obtener la imagen correcta
  const imagePath = `/src/assets/img/${type}/${id}.jpg`;
  const foundImage = images[imagePath];
  const imageURL = foundImage ? foundImage.default : "/img/default.jpg";

  return (
    <div className="container d-flex justify-content-center">
      <div className="card mb-3 mt-3 p-3" style={{ maxWidth: "900px", width: "900px" }}>
        <div className="row g-0">
          {/* Imagen a la izquierda */}
          <div className="col-md-4 d-flex justify-content-center">
            <img 
              src={imageURL} 
              className="card-img-top p-3" 
              alt={itemDetails.name} 
              onError={(e) => e.target.src = "/img/default.jpg"}
              style={{ width: "100%", maxWidth: "300px", objectFit: "cover" }} 
            />
          </div>

          {/* Nombre arriba y descripción debajo, alineado con la imagen */}
          <div className="col-md-8 d-flex flex-column justify-content-start ">
            <h5 className="card-title text-center">{itemDetails.name}</h5>
            <p className="mt-2"><strong>Description:</strong> {itemDetails.description || "No description available"}</p>
          </div>
        </div>

        {/* Datos organizados en UNA SOLA FILA */}
        <div className="container mt-3">
          <div className="row text-center d-flex justify-content-center">
            {type === "people" && (
              <>
                <div className="col"><strong>Height</strong><br />{itemDetails.height} cm</div>
                <div className="col"><strong>Mass</strong><br />{itemDetails.mass} kg</div>
                <div className="col"><strong>Hair Color</strong><br />{itemDetails.hair_color}</div>
                <div className="col"><strong>Skin Color</strong><br />{itemDetails.skin_color}</div>
                <div className="col"><strong>Eye Color</strong><br />{itemDetails.eye_color}</div>
                <div className="col"><strong>Birth Year</strong><br />{itemDetails.birth_year}</div>
                <div className="col"><strong>Gender</strong><br />{itemDetails.gender}</div>
              </>
            )}
            {type === "planets" && (
              <>
                <div className="col"><strong>Climate</strong><br />{itemDetails.climate}</div>
                <div className="col"><strong>Diameter</strong><br />{itemDetails.diameter} km</div>
                <div className="col"><strong>Gravity</strong><br />{itemDetails.gravity}</div>
                <div className="col"><strong>Population</strong><br />{itemDetails.population}</div>
                <div className="col"><strong>Terrain</strong><br />{itemDetails.terrain}</div>
              </>
            )}
            {type === "vehicles" && (
              <>
                <div className="col"><strong>Model</strong><br />{itemDetails.model}</div>
                <div className="col"><strong>Manufacturer</strong><br />{itemDetails.manufacturer}</div>
                <div className="col"><strong>Cost</strong><br />{itemDetails.cost_in_credits}</div>
                <div className="col"><strong>Length</strong><br />{itemDetails.length} meters</div>
                <div className="col"><strong>Max Speed</strong><br />{itemDetails.max_atmosphering_speed} km/h</div>
                <div className="col"><strong>Crew</strong><br />{itemDetails.crew}</div>
                <div className="col"><strong>Passengers</strong><br />{itemDetails.passengers}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
