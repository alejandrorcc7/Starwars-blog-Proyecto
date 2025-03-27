import React, { useEffect, useState, useContext } from "react"; 
// Importa React y los hooks useEffect, useState y useContext desde React.

import { useLocation, useNavigate } from "react-router-dom"; 
// Importa useLocation y useNavigate desde react-router-dom para gestionar la ubicación y la navegación.

import CardContext from "../context/CardContext"; 
// Importa el contexto CardContext, que probablemente almacena los ítems en caché y funciones relacionadas.

const images = import.meta.glob("/src/assets/img/*/*.{jpg,png}", { eager: true }); 
// Importa las imágenes de manera dinámica usando Vite. Se cargan todas las imágenes jpg o png dentro de la carpeta /src/assets/img/.
// "eager: true" indica que las imágenes se cargan inmediatamente, sin esperar a que se soliciten.

const Card = () => { 
  // Define el componente funcional Card.

  const { state } = useLocation(); 
  // Usa el hook useLocation para obtener el estado de la ubicación (generalmente de la ruta actual).
  
  const navigate = useNavigate(); 
  // Usa el hook useNavigate para obtener la función que permite navegar a otras rutas.

  const { id, type } = state || {}; 
  // Extrae las propiedades `id` y `type` del estado de la ruta, o asigna un objeto vacío si `state` es undefined.

  const { cachedItems, cacheItem } = useContext(CardContext); 
  // Usa useContext para acceder al contexto `CardContext`, que contiene la información de ítems en caché y la función para agregar un ítem al caché.

  const [itemDetails, setItemDetails] = useState(cachedItems[`${type}-${id}`] || null); 
  // Usa el hook useState para crear el estado `itemDetails`, que se inicializa con los detalles del ítem desde el caché si existen.
  // Si no están en caché, se inicia como null.

  useEffect(() => { 
    // Usa useEffect para realizar efectos secundarios. Este efecto se ejecuta cuando `id`, `type`, `itemDetails`, o `cacheItem` cambian.

    const fetchItemDetails = async () => { 
      // Define una función asíncrona que obtiene los detalles del ítem.

      if (itemDetails) return; // Si `itemDetails` ya tiene información, no realiza la petición para evitar duplicados.

      try {
        const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`); 
        // Hace una solicitud a la API de Star Wars usando el `type` y `id` del ítem.

        if (response.ok) { 
          // Si la respuesta es exitosa (status 200-299),
          const data = await response.json(); 
          // Convierte la respuesta a JSON.

          const details = data.result.properties; 
          // Extrae las propiedades del ítem desde la respuesta.

          setItemDetails(details); 
          // Actualiza el estado `itemDetails` con los detalles obtenidos.

          cacheItem(`${type}-${id}`, details); 
          // Guarda los detalles del ítem en el caché usando la función `cacheItem`.
        } else {
          console.error("Failed to fetch data:", response.status); 
          // Si la respuesta no es exitosa, muestra un error en la consola.
        }
      } catch (error) {
        console.error("Error fetching item details:", error); 
        // Si ocurre un error en la solicitud, lo captura y lo muestra en la consola.
      }
    };

    fetchItemDetails(); 
    // Llama a la función `fetchItemDetails` para obtener los detalles del ítem cuando el efecto se ejecute.

  }, [id, type, itemDetails, cacheItem]); 
  // El efecto se ejecuta cada vez que cambian los valores de `id`, `type`, `itemDetails` o `cacheItem`.

  if (!itemDetails) { 
    // Si `itemDetails` es null o undefined (aún cargando o no encontrado),
    return (
      <div className="text-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading..</span>
        </div>
      </div>
    );
    // Muestra un spinner de carga hasta que los detalles estén disponibles.
  }

  const imagePath = `/src/assets/img/${type}/${id}.jpg`; 
  // Construye la ruta de la imagen usando `type` e `id`.

  const foundImage = images[imagePath]; 
  // Intenta encontrar la imagen en las importaciones dinámicas de imágenes.

  const imageURL = foundImage ? foundImage.default : "/img/default.jpg"; 
  // Si se encuentra la imagen, usa su URL. Si no, usa una imagen predeterminada.

  return ( 
    <div className="container d-flex justify-content-center mt-4">
      {/* Contenedor principal que alinea el contenido en el centro y da un margen superior. */}
      
      <div className="card p-3 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        {/* Crea una tarjeta con un relleno de 3, sombra y un tamaño máximo de 600px. */}
        
        <button 
          className="btn btn-danger btn-sm align-self-end" 
          onClick={() => navigate("/")}
        >
          ❌ Cerrar
        </button>
        {/* Botón para navegar a la ruta principal ("/") al hacer clic. */}
        
        <img 
          src={imageURL} 
          className="card-img-top p-3" 
          alt={itemDetails.name} 
          onError={(e) => (e.target.src = "/img/default.jpg")} 
          // Si hay un error al cargar la imagen, se reemplaza por la imagen predeterminada.
          style={{ width: "300px", height: "300px", objectFit: "cover", alignSelf: "center" }} 
        />
        {/* Muestra la imagen del ítem con un tamaño de 300x300px y ajuste de contenido. */}
        
        <div className="card-body text-center">
          <h5 className="card-title">{itemDetails.name}</h5>
          {/* Muestra el nombre del ítem en el título de la tarjeta. */}
        </div>
        
        <div className="list-group list-group-flush">
          {/* Lista de detalles del ítem */}
          {Object.entries(itemDetails).map(([key, value]) => (
            // Recorre las propiedades de `itemDetails` y las muestra en una lista.
            !["created", "edited", "homeworld", "url", "description"].includes(key) && (
              // Excluye ciertas claves como `created`, `edited`, `homeworld`, `url`, y `description` de la lista.
              <div key={key} className="list-group-item d-flex justify-content-between">
                <strong>{key.replace("_", " ").toUpperCase()}:</strong>
                <span>{value}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card; 
// Exporta el componente `Card` como el componente principal de este archivo.
