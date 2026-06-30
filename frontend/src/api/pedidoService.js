import axios from "axios";

const API_BASE = "http://localhost:8080";

export async function criarPedido(dados) {
  const response = await axios.post(`${API_BASE}/pedidos`, dados);
  return response.data;
}

export async function buscarPedido(id) {
  const response = await axios.get(`${API_BASE}/pedidos/${id}`);
  return response.data;
}