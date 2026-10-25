import { act, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";

export const DAMAGE_BUTTON = "Deal damage to all enemies in row, hold for custom amount";

export async function holdDamageButton() {
  vi.useFakeTimers();
  fireEvent.pointerDown(screen.getByLabelText(DAMAGE_BUTTON));
  await act(() => vi.advanceTimersByTimeAsync(600));
  vi.useRealTimers();
}
