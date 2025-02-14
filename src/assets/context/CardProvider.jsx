import React, { useState } from 'react'
import CardContext from './CardContext'

const CardProvider = ({ children }) => {
  const [card, setCard] = useState([]);
  const [cachedItems, setCachedItems] = useState({});

  const addCard = (item) => {
    setCard((prevState) => [...prevState, item]);
  };

  const removeCard = (item) => {
    setCard((prevState) => prevState.filter((fav) => fav.id !== item.id));
  };

  const cacheItem = (id, details) => {
    setCachedItems((prevState) => ({ ...prevState, [id]: details }));
  };

  return (
    <CardContext.Provider value={{ card, addCard, removeCard, cachedItems, cacheItem }}>
      {children}
    </CardContext.Provider>
  );
};


export default CardProvider