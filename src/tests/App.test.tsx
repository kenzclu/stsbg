import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App", () => {
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
});
