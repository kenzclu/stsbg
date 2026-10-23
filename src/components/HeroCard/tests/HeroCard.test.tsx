import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroCard } from "../HeroCard";

describe("HeroCard", () => {
  it("deals 1 damage to the row when the preset button is clicked", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await userEvent.click(screen.getByLabelText("Deal 1 damage to all enemies in row"));

    expect(onDamageEnemies).toHaveBeenCalledWith(1);
  });

  it("deals custom damage to the row once a positive amount is confirmed", async () => {
    const onDamageEnemies = vi.fn();
    render(<HeroCard name="Ironclad" onDamageEnemies={onDamageEnemies} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to all enemies in row"));
    await userEvent.type(screen.getByLabelText("Damage amount"), "7");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(onDamageEnemies).toHaveBeenCalledWith(7);
  });

  it("keeps confirm disabled for non-positive or non-integer input", async () => {
    render(<HeroCard name="Ironclad" onDamageEnemies={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to all enemies in row"));
    await userEvent.type(screen.getByLabelText("Damage amount"), "-1");

    expect(screen.getByLabelText("Confirm damage")).toBeDisabled();
  });

  it("returns to the Custom button after cancelling", async () => {
    render(<HeroCard name="Ironclad" onDamageEnemies={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Deal custom damage to all enemies in row"));
    await userEvent.keyboard("{Escape}");

    expect(screen.getByLabelText("Deal custom damage to all enemies in row")).toBeInTheDocument();
  });
});
