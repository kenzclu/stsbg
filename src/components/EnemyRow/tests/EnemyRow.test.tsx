import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnemyRow } from "../EnemyRow";
import type { Enemy } from "../../EnemyCard/EnemyCard";

describe("EnemyRow", () => {
  it("renders one EnemyCard per enemy", () => {
    const enemies: Enemy[] = [
      { name: "Enemy 1", currentHp: 5, maxHp: 10, counters: { poison: 0, block: 0 } },
      { name: "Enemy 2", currentHp: 8, maxHp: 8, counters: { poison: 0, block: 0 } },
    ];
    render(<EnemyRow enemies={enemies} onAddEnemy={vi.fn()} onAdjustHp={vi.fn()} />);

    expect(screen.getByText("Enemy 1")).toBeInTheDocument();
    expect(screen.getByText("Enemy 2")).toBeInTheDocument();
  });

  it("forwards adjustHp calls with the enemy's index", async () => {
    const onAdjustHp = vi.fn();
    const enemies: Enemy[] = [
      { name: "Enemy 1", currentHp: 5, maxHp: 10, counters: { poison: 0, block: 0 } },
      { name: "Enemy 2", currentHp: 5, maxHp: 8, counters: { poison: 0, block: 0 } },
    ];
    render(<EnemyRow enemies={enemies} onAddEnemy={vi.fn()} onAdjustHp={onAdjustHp} />);

    await userEvent.click(screen.getByLabelText("Increase Enemy 2 HP"));

    expect(onAdjustHp).toHaveBeenCalledWith(1, 1);
  });

  it("adds an enemy with the entered HP as both current and max", async () => {
    const onAddEnemy = vi.fn();
    render(<EnemyRow enemies={[]} onAddEnemy={onAddEnemy} onAdjustHp={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "12");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    expect(onAddEnemy).toHaveBeenCalledWith(12);
  });

  it("does not add an enemy for a non-positive HP value", async () => {
    const onAddEnemy = vi.fn();
    render(<EnemyRow enemies={[]} onAddEnemy={onAddEnemy} onAdjustHp={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    expect(screen.getByLabelText("Confirm add enemy")).toBeDisabled();

    expect(onAddEnemy).not.toHaveBeenCalled();
  });
});
