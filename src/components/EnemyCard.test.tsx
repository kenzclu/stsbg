import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnemyCard, type Enemy } from "./EnemyCard";

function makeEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return { name: "Enemy 1", currentHp: 5, maxHp: 10, ...overrides };
}

describe("EnemyCard", () => {
  it("calls onAdjustHp(-1) when the decrease button is clicked", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} />);

    await userEvent.click(screen.getByLabelText("Decrease Enemy 1 HP"));

    expect(onAdjustHp).toHaveBeenCalledWith(-1);
  });

  it("calls onAdjustHp(1) when the increase button is clicked", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} />);

    await userEvent.click(screen.getByLabelText("Increase Enemy 1 HP"));

    expect(onAdjustHp).toHaveBeenCalledWith(1);
  });

  it("disables the decrease button at 0 HP and the increase button at max HP", () => {
    render(<EnemyCard enemy={makeEnemy({ currentHp: 0, maxHp: 10 })} onAdjustHp={vi.fn()} />);
    expect(screen.getByLabelText("Decrease Enemy 1 HP")).toBeDisabled();
    expect(screen.getByLabelText("Increase Enemy 1 HP")).not.toBeDisabled();
  });

  it("disables the custom damage button once the enemy is at 0 HP", () => {
    render(<EnemyCard enemy={makeEnemy({ currentHp: 0 })} onAdjustHp={vi.fn()} />);
    expect(screen.getByLabelText("Deal custom damage to Enemy 1")).toBeDisabled();
  });

  it("submits custom damage as a negative delta", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    await userEvent.type(screen.getByLabelText("Damage amount"), "3");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(onAdjustHp).toHaveBeenCalledWith(-3);
  });

  it("disables confirm until a positive integer is entered", async () => {
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Damage amount"), "0");
    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Damage amount"), "{backspace}5");
    expect(screen.getByLabelText("Confirm damage")).not.toBeDisabled();
  });

  it("cancels the custom damage form on Escape", async () => {
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByLabelText("Damage amount")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Deal custom damage to Enemy 1")).toBeInTheDocument();
  });
});
