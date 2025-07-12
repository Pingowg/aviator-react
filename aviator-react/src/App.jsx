import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './index.css';

function gerarCrash() {
  const r = Math.random();
  if (r < 0.01) return (Math.random() * 80 + 20).toFixed(2);
  if (r < 0.1) return (Math.random() * 15 + 5).toFixed(2);
  if (r < 0.4) return (Math.random() * 3 + 2).toFixed(2);
  return (Math.random() * 0.99 + 1.01).toFixed(2);
}

export default function App() {
  const [banca, setBanca] = useState(100);
  const [aposta, setAposta] = useState(10);
  const [retirada, setRetirada] = useState(1.5);
  const [historico, setHistorico] = useState([]);
  const [resultado, setResultado] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (resultado.startsWith('💥')) audioRef.current.play();
  }, [resultado]);

  const jogar = () => {
    if (aposta > banca) {
      setResultado('❌ Saldo insuficiente.');
      return;
    }
    const crash = parseFloat(gerarCrash());
    setHistorico(h => [crash, ...h.slice(0, 9)]);
    let nova = banca - aposta;
    if (retirada <= crash) {
      const ganho = +(aposta * retirada).toFixed(2);
      nova += ganho;
      setResultado(`✅ Ganhou R$${ganho} | Crash: ${crash}x`);
    } else {
      setResultado(`💥 Perdeu R$${aposta} | Crash: ${crash}x`);
    }
    setBanca(+nova.toFixed(2));
  };

  const data = { labels: historico.map((_, i) => i+1).reverse(), datasets: [
      { label: 'Crash', data: historico.slice().reverse(), fill: false, borderColor: '#8884d8' }
  ]};

  return (
    <div className="container">
      <audio ref={audioRef} src="/crash.mp3" />
      <h1>🎮 Simulador Aviator</h1>
      <p><strong>💰 Banca:</strong> R${banca.toFixed(2)}</p>

      <div className="inputs">
        <div><label>Aposta:</label>
          <input type="number" value={aposta} onChange={e => setAposta(+e.target.value)} /></div>
        <div><label>Saque:</label>
          <input type="number" step="0.01" value={retirada} onChange={e => setRetirada(+e.target.value)} /></div>
      </div>

      <button onClick={jogar}>🎯 Jogar</button>

      <p className="resultado">{resultado}</p>

      <div className="grafico">
        <Line data={data} />
      </div>
    </div>
  );
}
