import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <span className="header-logo" aria-hidden="true">
          🛒
        </span>
        <div>
          <h1>Loja Virtual Serratec</h1>
          <p className="header-subtitle">
            Faça seu pedido e receba recomendações personalizadas com IA
          </p>
        </div>
      </div>
    </header>
  );
}
