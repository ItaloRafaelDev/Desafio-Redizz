import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para armazenar as bolinhas desenhadas
  const [circles, setCircles] = useState([]);
  // Estado para armazenar as bolinhas que foram desfeitas (para refazer)
  const [redoCircles, setRedoCircles] = useState([]);
  // Referência para o elemento canvas
  const canvasRef = useRef(null);
  // Referência para o elemento que representa o papel de parede
  const wallpaperRef = useRef(null);

  // Função para gerar uma cor aleatória em formato RGB
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Adiciona uma bolinha nas coordenadas x, y ao estado das bolinhas
  const addCircle = (x, y) => {
    const newCircle = { x, y, color: getRandomColor() };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
    setRedoCircles([]); // Limpa as bolinhas que foram desfeitas ao adicionar uma nova
  };

  // Desfaz a última bolinha desenhada
  const undo = () => {
    const lastCircle = circles[circles.length - 1];
    if (lastCircle) {
      setCircles((prevCircles) => prevCircles.slice(0, -1));
      setRedoCircles((prevRedoCircles) => [...prevRedoCircles, lastCircle]);
    }
  };

  // Refaz a última bolinha desfeita
  const redo = () => {
    const lastRedoCircle = redoCircles[redoCircles.length - 1];
    if (lastRedoCircle) {
      setCircles((prevCircles) => [...prevCircles, lastRedoCircle]);
      setRedoCircles((prevRedoCircles) => prevRedoCircles.slice(0, -1));
    }
  };

  // Limpa todas as bolinhas desenhadas
  const clearAll = () => {
    setCircles([]);
    setRedoCircles([]);
  };

  // Trata o clique no canvas, adicionando uma bolinha nas coordenadas do clique
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addCircle(x, y);
  };

  // Animação das bolinhas: muda suas cores aleatoriamente e redesenha no canvas
  const animateCircles = () => {
    const updatedCircles = circles.map((circle) => ({
      ...circle,
      color: getRandomColor(),
    }));

    setCircles(updatedCircles);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    updatedCircles.forEach((circle) => {
      context.beginPath();
      context.arc(circle.x, circle.y, 15, 0, 2 * Math.PI);
      context.fillStyle = circle.color;
      context.fill();
      context.stroke();
    });

    requestAnimationFrame(animateCircles);
  };

  useEffect(() => {
    // Inicia a animação das bolinhas quando o componente é montado
    animateCircles();
  }, [circles]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {/* Botões de interação com as bolinhas */}
          <button onClick={undo}>Desfazer</button>
          <button onClick={redo}>Refazer</button>
          <button onClick={clearAll}>Limpar</button>
        </div>
        {/* Elemento que representa o papel de parede */}
        <div ref={wallpaperRef} className="wallpaper"></div>
        {/* Canvas para desenho das bolinhas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ width: '100%', height: '100%', margin: '20px 0' }}
        ></canvas>
      </header>
    </div>
  );
}

export default App;
