import { useEffect, useRef } from 'react';
import './App.css';

function Whiteboard() {
  let drawing = false;
  let mousePos = { x: 0, y: 0 };
  let currentColor = "black";
  const canvasRef = useRef(null);

  const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  const handleStart = (event) => {
    drawing = true; 
    mousePos = getMousePosition(canvasRef.current, event);
  }

  const handleStop = () => {
    drawing = false;
  }

  const handleMove = (event) => {
    if (!drawing) { return; }
    const lastPos = mousePos;
    mousePos = getMousePosition(canvasRef.current, event);

    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.closePath();
    ctx.stroke();
  }
  
  const changeColor = (color) => () => {
    currentColor = color;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mouseup', handleStop);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleStop);
  })

  return (
    <div>
      <button onClick={changeColor("red")}>red</button>
      <button onClick={changeColor("green")}>green</button>
      <button onClick={changeColor("blue")}>blue</button>
      <button onClick={changeColor("black")}>black</button>
      <canvas id="whiteboard" width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>;
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Whiteboard />
    </div>
  );
}
