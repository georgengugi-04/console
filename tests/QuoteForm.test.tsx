import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/forms/QuoteForm";

// The success animation is decorative and needs canvas/IntersectionObserver, which jsdom lacks.
vi.mock("@lottiefiles/dotlottie-react", () => ({ DotLottieReact: () => null, setWasmUrl: () => {} }));

afterEach(() => vi.unstubAllGlobals());

async function reachStep3(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: /health insurance/i }));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.type(await screen.findByLabelText(/full name/i), "Amina Wanjiku");
  await user.type(screen.getByLabelText(/email address/i), "amina@example.com");
  await user.type(screen.getByLabelText(/phone number/i), "0712 345 678");
  await user.click(screen.getByRole("radio", { name: /email/i }));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await screen.findByRole("heading", { name: /anything we should know/i });
}

describe("QuoteForm journey", () => {
  it("blocks step 1 until a category is chosen", async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/choose an insurance category/i);
  });

  it("shows inline errors for invalid contact details and a Kenyan phone hint", async () => {
    const user = userEvent.setup();
    render(<QuoteForm initialProduct="motor" />);
    await user.type(await screen.findByLabelText(/phone number/i), "123");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText(/valid kenyan number/i)).toBeInTheDocument();
  });

  it("pressing Enter on an early step advances instead of submitting the whole form", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<QuoteForm initialProduct="motor" />);
    await user.type(await screen.findByLabelText(/full name/i), "Amina{Enter}");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("keeps entered values when moving back and forth, and requires consent", async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await reachStep3(user);
    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(await screen.findByLabelText(/full name/i)).toHaveValue("Amina Wanjiku");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await screen.findByRole("heading", { name: /anything we should know/i });
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText(/please confirm you agree/i)).toBeInTheDocument();
  });

  it("is honest when the server cannot deliver: no success message, direct contact offered", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code: "not_configured", message: "Online enquiries aren't connected yet, so we haven't received your details." }), {
        status: 503,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<QuoteForm />);
    await reachStep3(user);
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /aren't connected yet/i })).toBeInTheDocument());
    expect(screen.queryByText(/thank you|we've received|success/i)).toBeNull();
    expect(screen.getByRole("link", { name: /email us/i })).toHaveAttribute("href", expect.stringContaining("mailto:"));
    // the number shown is unconfirmed, so it must not be a tel: link
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(sent).toMatchObject({ product: "health", consent: true, phone: "+254712345678" });
  });

  it("prevents duplicate submissions on a double click", async () => {
    const user = userEvent.setup();
    let release!: (r: Response) => void;
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((r) => (release = r)));
    vi.stubGlobal("fetch", fetchMock);
    render(<QuoteForm />);
    await reachStep3(user);
    await user.click(screen.getByRole("checkbox"));
    const send = screen.getByRole("button", { name: /send/i });
    await user.dblClick(send);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    release(new Response(JSON.stringify({ ok: true, mode: "delivered", reference: "Q-AAAA1111" }), { status: 200, headers: { "content-type": "application/json" } }));
    expect(await screen.findByText(/Q-AAAA1111/)).toBeInTheDocument();
  });
});
