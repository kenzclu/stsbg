import { useState, type DragEvent, type ReactNode } from "react";
import "./DraggableRow.css";

type DraggableRowProps = {
  index: number;
  onMove: (from: number, to: number) => void;
  children: ReactNode;
};

export function DraggableRow(props: DraggableRowProps) {
  const { index, onMove, children } = props;
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onMove(Number(e.dataTransfer.getData("text/plain")), index);
  };

  return (
    <div
      className={isOver ? "draggable-row drag-over" : "draggable-row"}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
