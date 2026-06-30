import './AnaliseIA.css';

export default function AnaliseIA({ pedido }) {
  if (!pedido) return null;

  const itens = [
    { label: 'Perfil do cliente', valor: pedido.perfilCliente, icone: '👤' },
    { label: 'Recomendações', valor: pedido.recomendacoes, icone: '✨' },
    { label: 'Cupom de desconto', valor: pedido.cupomDesconto, icone: '🎟️' },
    { label: 'Mensagem da IA', valor: pedido.mensagemIA, icone: '💬' },
  ].filter((item) => item.valor);

  return (
    <section className="analise-section" aria-labelledby="analise-title" aria-live="polite">
      <h2 id="analise-title">Análise da IA</h2>
      <p className="analise-pedido-id">Pedido #{pedido.id}</p>

      <div className="analise-resumo">
        <p>
          <strong>{pedido.cliente}</strong> · {pedido.cidade}
        </p>
        <p className="analise-valor">
          R$ {pedido.valorTotal?.toFixed(2).replace('.', ',')}
        </p>
      </div>

      <div className="analise-cards">
        {itens.map((item) => (
          <article key={item.label} className="analise-card">
            <span className="analise-icone" aria-hidden="true">
              {item.icone}
            </span>
            <div>
              <h3>{item.label}</h3>
              <p>{item.valor}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
