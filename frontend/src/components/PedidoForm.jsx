import './PedidoForm.css';

const PRODUTOS_SUGERIDOS = [
  'Notebook',
  'Mouse Gamer',
  'Teclado Mecânico',
  'Headset Gamer',
  'Monitor 27"',
  'SSD 1TB',
];

export default function PedidoForm({ onSubmit, desabilitado }) {
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const produtosSelecionados = Array.from(
      form.querySelectorAll('input[name="produto"]:checked')
    ).map((input) => input.value);

    if (produtosSelecionados.length === 0) {
      return;
    }

    onSubmit({
      cliente: form.cliente.value.trim(),
      cidade: form.cidade.value.trim(),
      valorTotal: parseFloat(form.valorTotal.value),
      produtos: produtosSelecionados,
    });
  }

  return (
    <section className="form-section" aria-labelledby="form-title">
      <h2 id="form-title">Novo Pedido</h2>

      <form className="pedido-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="cliente">Nome do cliente</label>
          <input
            id="cliente"
            name="cliente"
            type="text"
            placeholder="Ex: Maria Silva"
            required
            disabled={desabilitado}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            id="cidade"
            name="cidade"
            type="text"
            placeholder="Ex: Petrópolis"
            required
            disabled={desabilitado}
          />
        </div>

        <div className="form-group">
          <label htmlFor="valorTotal">Valor total (R$)</label>
          <input
            id="valorTotal"
            name="valorTotal"
            type="number"
            min="1"
            step="0.01"
            placeholder="Ex: 820.00"
            required
            disabled={desabilitado}
          />
        </div>

        <fieldset className="form-group produtos-fieldset" disabled={desabilitado}>
          <legend>Produtos</legend>
          <div className="produtos-grid">
            {PRODUTOS_SUGERIDOS.map((produto) => (
              <label key={produto} className="produto-checkbox">
                <input type="checkbox" name="produto" value={produto} />
                <span>{produto}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-enviar" disabled={desabilitado}>
          {desabilitado ? 'Enviando...' : 'Enviar Pedido'}
        </button>
      </form>
    </section>
  );
}
