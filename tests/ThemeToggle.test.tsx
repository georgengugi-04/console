import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("data-theme", "light");
});

describe("ThemeToggle", () => {
  it("exposes its state and really changes the document theme", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Dark mode" });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem("console.theme")).toBe("dark");
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });
});
