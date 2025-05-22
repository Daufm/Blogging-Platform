// src/api/api.js
import axios from "axios";

export const fetchAuthorData = async (username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/authors/${username}`);
  return res.data;
};
