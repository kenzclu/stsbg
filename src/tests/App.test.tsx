import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { createDataTransfer } from "../tests/createDataTransfer";

describe("App", () => {
  it("offers only character selection until a character is added", async () => {
    render(<App />);

    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "End Turn" })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "End Turn" })).toBeInTheDocument();
  });

  it("adds a combat row for each selected character", async () => {
    render(<App />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");

    expect(screen.getByText("Ironclad")).toBeInTheDocument();
  });

  it("disables character selection once MAX_CHARACTERS is reached", async () => {
    render(<App />);
    const select = screen.getByRole("combobox");

    await userEvent.selectOptions(select, "Ironclad");
    await userEvent.selectOptions(select, "Silent");
    await userEvent.selectOptions(select, "Defect");
    await userEvent.selectOptions(select, "Watcher");

    expect(select).toBeDisabled();
  });

  it("resets enemy rows when Reset is clicked", async () => {
    render(<App />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");
    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "10");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));
    expect(screen.getByText("Enemy 1")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.queryByText("Enemy 1")).not.toBeInTheDocument();
  });

  it("applies poison damage and clears block when End Turn is clicked", async () => {
    render(<App />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");
    await userEvent.click(screen.getByLabelText("Add enemy"));
    await userEvent.type(screen.getByLabelText("Enemy HP"), "10");
    await userEvent.click(screen.getByLabelText("Confirm add enemy"));
    await userEvent.click(screen.getByLabelText("Add poison to Enemy 1"));
    await userEvent.click(screen.getByLabelText("Add poison to Enemy 1"));
    await userEvent.click(screen.getByLabelText("Add block to Enemy 1"));

    await userEvent.click(screen.getByRole("button", { name: "End Turn" }));

    expect(screen.getByText("8/10 🩸")).toBeInTheDocument();
    expect(screen.getByLabelText("Add block to Enemy 1")).toHaveTextContent(
      "0",
    );
  });

  describe("reordering characters", () => {
    const heroNames = () =>
      Array.from(document.querySelectorAll(".hero-card .label-strong")).map(
        (el) => el.textContent,
      );

    const dragHeroOnto = (source: string, target: string) => {
      const dataTransfer = createDataTransfer();
      const sourceCard = screen.getByText(source).closest("[draggable]")!;
      const targetRow = screen.getByText(target).closest(".draggable-row")!;
      fireEvent.dragStart(sourceCard, { dataTransfer });
      fireEvent.dragOver(targetRow, { dataTransfer });
      fireEvent.drop(targetRow, { dataTransfer });
    };

    it("moves a character to where it is dropped", async () => {
      render(<App />);
      await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");
      await userEvent.selectOptions(screen.getByRole("combobox"), "Silent");
      await userEvent.selectOptions(screen.getByRole("combobox"), "Defect");

      dragHeroOnto("Defect", "Ironclad");

      expect(heroNames()).toEqual(["Defect", "Ironclad", "Silent"]);
    });

    it("keeps a character's enemies with it after it moves", async () => {
      render(<App />);
      await userEvent.selectOptions(screen.getByRole("combobox"), "Ironclad");
      await userEvent.selectOptions(screen.getByRole("combobox"), "Silent");
      await userEvent.click(screen.getAllByLabelText("Add enemy")[0]);
      await userEvent.type(screen.getByLabelText("Enemy HP"), "10");
      await userEvent.click(screen.getByLabelText("Confirm add enemy"));

      dragHeroOnto("Ironclad", "Silent");

      const [first, second] = document.querySelectorAll(".draggable-row");
      expect(first).toHaveTextContent("Silent");
      expect(second).toHaveTextContent("Ironclad");
      expect(second).toHaveTextContent("Enemy 1");
    });
  });
});
