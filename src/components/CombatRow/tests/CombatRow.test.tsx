import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CombatRow } from "../CombatRow";

describe("CombatRow", () => {
  it("adds an enemy with the entered HP as its starting and max HP", async () => {
    render(<CombatRow heroName="Ironclad" />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "10");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    expect(screen.getByText("Enemy 1")).toBeInTheDocument();
    expect(screen.getByText("10/10 HP")).toBeInTheDocument();
  });

  it("clamps HP adjustments to the enemy's max HP", async () => {
    render(<CombatRow heroName="Ironclad" />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "10");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    await userEvent.click(screen.getByLabelText("Increase Enemy 1 HP"));

    expect(screen.getByText("10/10 HP")).toBeInTheDocument();
  });

  it("clamps row damage at 0 HP across all enemies", async () => {
    render(<CombatRow heroName="Ironclad" />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "1");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    await userEvent.click(screen.getByLabelText("Deal custom damage to all enemies in row"));
    await userEvent.type(screen.getByLabelText("Damage amount"), "5");
    await userEvent.click(screen.getByLabelText("Confirm damage"));

    expect(screen.getByText("0/1 HP")).toBeInTheDocument();
  });

  it("damages all enemies in the row, not just one", async () => {
    render(<CombatRow heroName="Ironclad" />);

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "5");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "5");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));

    await userEvent.click(screen.getByLabelText("Deal 1 damage to all enemies in row"));

    expect(screen.getAllByText("4/5 HP")).toHaveLength(2);
  });
});
