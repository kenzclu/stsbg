import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnemyCard, type Enemy } from "../EnemyCard";

function makeEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return { name: "Enemy 1", currentHp: 5, maxHp: 10, counters: { poison: 0, block: 0 }, ...overrides };
}

describe("EnemyCard", () => {
  it("calls onAdjustHp(-1) when the decrease button is clicked", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} onAdjustCounter={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Decrease Enemy 1 HP"));

    expect(onAdjustHp).toHaveBeenCalledWith(-1);
  });

  it("calls onAdjustHp(1) when the increase button is clicked", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} onAdjustCounter={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Increase Enemy 1 HP"));

    expect(onAdjustHp).toHaveBeenCalledWith(1);
  });

  it("disables the decrease button at 0 HP and the increase button at max HP", () => {
    render(<EnemyCard enemy={makeEnemy({ currentHp: 0, maxHp: 10 })} onAdjustHp={vi.fn()} onAdjustCounter={vi.fn()} />);
    expect(screen.getByLabelText("Decrease Enemy 1 HP")).toBeDisabled();
    expect(screen.getByLabelText("Increase Enemy 1 HP")).not.toBeDisabled();
  });

  it("disables the custom damage button once the enemy is at 0 HP", () => {
    render(<EnemyCard enemy={makeEnemy({ currentHp: 0 })} onAdjustHp={vi.fn()} onAdjustCounter={vi.fn()} />);
    expect(screen.getByLabelText("Deal custom damage to Enemy 1")).toBeDisabled();
  });

  it("submits custom damage as a negative delta", async () => {
    const onAdjustHp = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={onAdjustHp} onAdjustCounter={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    await userEvent.type(screen.getByLabelText("Damage amount"), "3");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(onAdjustHp).toHaveBeenCalledWith(-3);
  });

  it("disables confirm until a positive integer is entered", async () => {
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Damage amount"), "0");
    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Damage amount"), "{backspace}5");
    expect(screen.getByLabelText("Confirm damage")).not.toBeDisabled();
  });

  it("cancels the custom damage form on Escape", async () => {
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to Enemy 1"));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByLabelText("Damage amount")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Deal custom damage to Enemy 1")).toBeInTheDocument();
  });

  it("shows the enemy's poison and block counts", () => {
    render(
      <EnemyCard
        enemy={makeEnemy({ counters: { poison: 2, block: 3 } })}
        onAdjustHp={vi.fn()}
        onAdjustCounter={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Add poison to Enemy 1")).toHaveTextContent("2");
    expect(screen.getByLabelText("Add block to Enemy 1")).toHaveTextContent("3");
  });

  it("calls onAdjustCounter(poison, 1) when the poison badge is clicked", async () => {
    const onAdjustCounter = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={onAdjustCounter} />);

    await userEvent.click(screen.getByLabelText("Add poison to Enemy 1"));

    expect(onAdjustCounter).toHaveBeenCalledWith("poison", 1);
  });

  it("calls onAdjustCounter(block, 1) when the block badge is clicked", async () => {
    const onAdjustCounter = vi.fn();
    render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={onAdjustCounter} />);

    await userEvent.click(screen.getByLabelText("Add block to Enemy 1"));

    expect(onAdjustCounter).toHaveBeenCalledWith("block", 1);
  });

  describe("holding a counter icon", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    function holdFor(label: string, ms: number) {
      fireEvent.pointerDown(screen.getByLabelText(label));
      act(() => {
        vi.advanceTimersByTime(ms);
      });
    }

    it("lets you add a custom amount to the counter", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const onAdjustCounter = vi.fn();
      render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={onAdjustCounter} />);

      holdFor("Add poison to Enemy 1", 600);
      await userEvent.type(screen.getByLabelText("Poison amount"), "5");
      await userEvent.click(screen.getByLabelText("Confirm poison"));

      expect(onAdjustCounter).toHaveBeenCalledOnce();
      expect(onAdjustCounter).toHaveBeenCalledWith("poison", 5);
    });

    it("does not add the quick +1 when the hold ends in a release", () => {
      vi.useFakeTimers();
      const onAdjustCounter = vi.fn();
      render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={onAdjustCounter} />);

      const badge = screen.getByLabelText("Add block to Enemy 1");
      holdFor("Add block to Enemy 1", 600);
      fireEvent.pointerUp(badge);
      fireEvent.click(badge);

      expect(onAdjustCounter).not.toHaveBeenCalled();
    });

    it("keeps a short press as a plain +1", () => {
      vi.useFakeTimers();
      const onAdjustCounter = vi.fn();
      render(<EnemyCard enemy={makeEnemy()} onAdjustHp={vi.fn()} onAdjustCounter={onAdjustCounter} />);

      const badge = screen.getByLabelText("Add block to Enemy 1");
      holdFor("Add block to Enemy 1", 100);
      fireEvent.pointerUp(badge);
      fireEvent.click(badge);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onAdjustCounter).toHaveBeenCalledExactlyOnceWith("block", 1);
      expect(screen.queryByLabelText("Block amount")).not.toBeInTheDocument();
    });
  });
});
