import { useState } from "react";
import { criarPedido, buscarPedido } from "./api/pedidoService";

export default function Loja() {
  const [cliente, setCliente] = useState("");
  const [cidade, setCidade] = useState("");
  const [produtos, setProdutos] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState(null);

  async function aguardarAnalise(id) {
    for (let i = 0; i < 20; i++) {
      const pedidoAtualizado = await buscarPedido(id);
      console.log("Tentativa", i + 1, pedidoAtualizado);

      if (pedidoAtualizado.perfilCliente || pedidoAtualizado.mensagemIA) {
        return pedidoAtualizado;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    throw new Error("Análise da IA não retornou a tempo");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setAnalise(null);

    try {
      const pedido = {
        cliente,
        cidade,
        produtos: produtos.split(",").map(p => p.trim()),
        valorTotal: Number(valorTotal),
      };

      const response = await criarPedido(pedido);
      const id = response.id;

      console.log("Pedido criado:", response);

      const resultadoIA = await aguardarAnalise(id);

      console.log("IA retornou:", resultadoIA);
      setAnalise(resultadoIA);

      setCliente("");
      setCidade("");
      setProdutos("");
      setValorTotal("");

    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta do backend:", error.response?.data);
      alert("Erro: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Loja Virtual 🛒</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Produtos (vírgula)"
          value={produtos}
          onChange={(e) => setProdutos(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Valor total"
          type="number"
          value={valorTotal}
          onChange={(e) => setValorTotal(e.target.value)}
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Processando IA..." : "Finalizar Pedido"}
        </button>
      </form>

      {analise && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h2>🧠 Análise da IA</h2>

          <p><strong>Perfil:</strong> {analise.perfilCliente}</p>

          <p><strong>Recomendações:</strong></p>
          <ul>
            {analise.recomendacoes?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <p><strong>Mensagem:</strong> {analise.mensagemPersonalizada}</p>
        </div>
      )}
    </div>
  );
}