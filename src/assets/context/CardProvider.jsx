import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect
import CardContext from './CardContext'; // Importa el contexto de tarjetas

const CardProvider = ({ children }) => {
  const [card, setCard] = useState([]); // Estado para almacenar las tarjetas favoritas
  const [cachedItems, setCachedItems] = useState({}); // Estado para almacenar datos en caché
  const [data, setData] = useState({ planets: [],people: [], vehicles: [] }); // Estado para almacenar los datos de la API
  const endpoints = ["people", "planets", "vehicles"]; // Define los tipos de datos a obtener

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = "https://www.swapi.tech/api/"; // URL base de la API

        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            // Verifica si los datos ya están en caché
            if (cachedItems[endpoint]) {
              return { [endpoint]: cachedItems[endpoint] };
            }

            const response = await fetch(`${baseUrl}${endpoint}/`); // Obtiene la lista de elementos
            const result = await response.json(); // Convierte la respuesta a JSON
            
            // Obtiene los detalles de cada elemento
            const details = await Promise.all(
              result.results.map(async (item) => {
                const itemResponse = await fetch(item.url);
                const itemData = await itemResponse.json();
                return { ...item, properties: itemData.result.properties }; // Agrega propiedades al objeto
              })
            );

            // Almacena los datos en caché
            setCachedItems((prev) => ({ ...prev, [endpoint]: details }));
            return { [endpoint]: details };
          })
        );

        setData(Object.assign({}, ...responses)); // Combina los datos en un solo objeto
      } catch (error) {
        console.error("Error fetching data:", error); // Captura errores en la petición
      }
    };

    fetchData();
  }, [cachedItems]); // Se ejecuta cada vez que cambia cachedItems

  // Agrega una tarjeta a favoritos
  const addCard = (item) => {
    setCard((prevState) => [...prevState, item]);
  };

  // Elimina una tarjeta de favoritos
  const removeCard = (item) => {
    setCard((prevState) => prevState.filter((fav) => fav.id !== item.id));
  };

  return (
    <CardContext.Provider value={{ card, addCard, removeCard, cachedItems, data }}>
      {children} {/* Renderiza los componentes hijos dentro del contexto */}
    </CardContext.Provider>
  );
};

export default CardProvider; // Exporta el proveedor de contexto
