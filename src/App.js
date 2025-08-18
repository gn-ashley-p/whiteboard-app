import { useEffect, useRef, useState } from 'react';
import './App.css';

const Whiteboard = () => {
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleStart = (event) => {
      setDrawing(true);
      mousePos.current = getMousePosition(canvasRef.current, event);
    };

    const handleStop = () => {
      setDrawing(false);
    };

    const handleMove = (event) => {
      if (!drawing) { return; }
      const lastPos = mousePos.current;
      const currentPos = getMousePosition(canvasRef.current, event);
      mousePos.current = currentPos; 

      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.closePath();
      ctx.stroke();
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mouseup', handleStop);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleStop);


    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mouseup', handleStop);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleStop);

    };
  }, [currentColor, drawing]);

  return (
    <div>
      <button onClick={() => setCurrentColor("red")}>red</button>
      <button onClick={() => setCurrentColor("green")}>green</button>
      <button onClick={() => setCurrentColor("blue")}>blue</button>
      <button onClick={() => setCurrentColor("black")}>black</button>
      <canvas id="whiteboard" width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
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
