import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterSelect } from "./CharacterSelect";

describe("CharacterSelect", () => {
  it("omits already-picked characters from the options", () => {
    render(
      <CharacterSelect
        availableCharacters={["Ironclad", "Silent", "Defect"]}
        characters={["Silent"]}
        maxCharacters={4}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("option", { name: "Silent" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ironclad" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Defect" })).toBeInTheDocument();
  });

  it("disables the select once maxCharacters is reached", () => {
    render(
      <CharacterSelect
        availableCharacters={["Ironclad", "Silent"]}
        characters={["Ironclad", "Silent"]}
        maxCharacters={2}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("calls onSelect with the chosen character", async () => {
    const onSelect = vi.fn();
    render(
      <CharacterSelect
        availableCharacters={["Ironclad", "Silent"]}
        characters={[]}
        maxCharacters={4}
        onSelect={onSelect}
      />,
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "Silent");

    expect(onSelect).toHaveBeenCalledWith("Silent");
  });
});
