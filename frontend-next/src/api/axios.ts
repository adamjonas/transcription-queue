import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_APP_CRYPTO_API_URL,
});