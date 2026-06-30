import './LoadingSpinner.css';

export default function LoadingSpinner({ mensagem = 'Carregando...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-text">{mensagem}</p>
    </div>
  );
}
