import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DAMAGE_BUTTON, holdDamageButton } from "../../../tests/holdDamageButton";
import { HeroCard } from "../HeroCard";

describe("HeroCard", () => {
  it("deals 1 damage to the row on a quick tap", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await userEvent.click(screen.getByLabelText(DAMAGE_BUTTON));

    expect(onDamageEnemies).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("opens the custom amount input on hold without dealing damage", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await holdDamageButton();

    expect(screen.getByLabelText("Damage amount")).toBeInTheDocument();
    expect(onDamageEnemies).not.toHaveBeenCalled();
  });

  it("deals custom damage to the row once a positive amount is confirmed", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await holdDamageButton();
    await userEvent.type(screen.getByLabelText("Damage amount"), "7");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(onDamageEnemies).toHaveBeenCalledWith(7);
  });

  it("keeps confirm disabled for zero or non-integer input", async () => {
    render(<HeroCard name="Ironclad" onDamageEnemies={vi.fn()} />);

    await holdDamageButton();
    await userEvent.type(screen.getByLabelText("Damage amount"), "0");

    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();
  });

  it("deals negative damage (healing) to the row when a negative amount is confirmed", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await holdDamageButton();
    await userEvent.type(screen.getByLabelText("Damage amount"), "-4");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(onDamageEnemies).toHaveBeenCalledWith(-4);
  });

  it("returns to the damage button after cancelling", async () => {
    render(<HeroCard name="Ironclad" onDamageEnemies={vi.fn()} />);

    await holdDamageButton();
    await userEvent.keyboard("{Escape}");

    expect(screen.getByLabelText(DAMAGE_BUTTON)).toBeInTheDocument();
  });
});
