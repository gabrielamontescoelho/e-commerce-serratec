import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/pedidos";

export default function Loja() {
  const [cliente, setCliente] = useState("");
  const [cidade, setCidade] = useState("");
  const [produtosInput, setProdutosInput] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState(null);

  async function aguardarAnalise(id) {
    for (let i = 0; i < 20; i++) {
      const response = await axios.get(`${API_URL}/${id}`);
      const data = response.data;

      if (data?.perfilCliente || data?.mensagemIA) {
        return data;
      }

      await new Promise((r) => setTimeout(r, 3000));
    }

    throw new Error("A inteligência artificial demorou muito para responder. Tente atualizar a página.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!produtosInput.trim()) {
      alert("Por favor, digite pelo menos um produto!");
      return;
    }

    setLoading(true);
    setAnalise(null);

    try {
      const listaProdutos = produtosInput
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "");

      const pedido = {
        cliente,
        cidade,
        produtos: listaProdutos,
        valorTotal: Number(valorTotal),
      };

      const responsePedido = await axios.post(API_URL, pedido);
      const resultadoIA = await aguardarAnalise(responsePedido.data.id);

      setAnalise(resultadoIA);
      setCliente("");
      setCidade("");
      setProdutosInput("");
      setValorTotal("");
    } catch (error) {
      alert("Erro na integração: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  const listaRecomendacoes = analise?.recomendacoes
    ? analise.recomendacoes.split(",").map((item) => item.trim())
    : [];

  return (
    <div style={{ padding: "20px 40px", fontFamily: "Segoe UI, Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🛒 TechStore IA</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        
        <div>
          <label htmlFor="cliente" style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>Nome do Cliente:</label>
          <input
            id="cliente"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            placeholder="Ex: Maria Silva"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="cidade" style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>Cidade:</label>
          <input
            id="cidade"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            placeholder="Ex: Petrópolis"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="produtos" style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>Produtos (separados por vírgula):</label>
          <input
            id="produtos"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            placeholder="Ex: Notebook, Mouse Gamer"
            value={produtosInput}
            onChange={(e) => setProdutosInput(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="valorTotal" style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>Valor Total (R$):</label>
          <input
            id="valorTotal"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            placeholder="Ex: 820"
            type="number"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading} 
          style={{ 
            padding: 12, 
            backgroundColor: loading ? "#ccc" : "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            fontSize: "16px", 
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "⏳ Processando IA..." : "🚀 Finalizar Pedido"}
        </button>
      </form>

      {loading && (
        <div aria-live="polite" style={{ marginTop: 20, padding: 15, backgroundColor: "#fff3cd", border: "1px solid #ffeba0", borderRadius: 4 }}>
          <p style={{ margin: 0, color: "#856404" }}>⏳ O pedido foi saved! Agora a IA está analisando sua compra para gerar cupons e recomendações. Por favor, aguarde...</p>
        </div>
      )}

      {analise && (
        <div aria-live="assertive" style={{ marginTop: 25, padding: 20, border: "2px solid #28a745", backgroundColor: "#f8fff9", borderRadius: 6 }}>
          <h2 style={{ color: "#28a745", marginTop: 0 }}>🧠 Resultado da Análise Inteligente</h2>

          <p><b>👤 Perfil do Cliente:</b> <span style={{ textTransform: "uppercase", color: "#0056b3" }}>{analise.perfilCliente}</span></p>

          <p><b>💡 Recomendações Exclusivas:</b></p>
          {listaRecomendacoes.length > 0 ? (
            <ul>
              {listaRecomendacoes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma recomendação gerada.</p>
          )}

          <div style={{ display: "inline-block", backgroundColor: "#e2f0d9", padding: "5px 10px", borderRadius: 4, border: "1px dashed #385723" }}>
            <p style={{ margin: 0 }}><b>🎫 Cupom de Desconto:</b> <code>{analise.cupomDesconto || "Não gerado"}</code></p>
          </div>

          <p style={{ marginTop: 15, fontStyle: "italic", color: "#555" }}>"{analise.mensagemIA}"</p>
        </div>
      )}
    </div>
  );
}