import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createDataTransfer } from "../../../test/createDataTransfer";
import { DraggableRow } from "../DraggableRow";

describe("DraggableRow", () => {
  it("reports the dragged row's index and its own index on drop", () => {
    const onMove = vi.fn();
    const dataTransfer = createDataTransfer();
    render(
      <>
        <DraggableRow index={0} onMove={onMove}>
          <div draggable>first</div>
        </DraggableRow>
        <DraggableRow index={2} onMove={onMove}>
          <div draggable>third</div>
        </DraggableRow>
      </>,
    );

    fireEvent.dragStart(screen.getByText("third"), { dataTransfer });
    fireEvent.drop(screen.getByText("first"), { dataTransfer });

    expect(onMove).toHaveBeenCalledWith(2, 0);
  });

  it("highlights while a drag hovers and clears when it leaves", () => {
    render(
      <DraggableRow index={0} onMove={vi.fn()}>
        <div>row</div>
      </DraggableRow>,
    );
    const row = screen.getByText("row").parentElement!;

    fireEvent.dragOver(row);
    expect(row).toHaveClass("drag-over");

    fireEvent.dragLeave(row);
    expect(row).not.toHaveClass("drag-over");
  });
});
