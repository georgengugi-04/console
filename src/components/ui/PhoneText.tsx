import { company } from "@/content/company";

/**
 * Renders the company phone number. It only becomes a tappable `tel:` link once the number's status is
 * "supplied" — until CONSOLE confirms the number (the supplied one looks a digit short), a tap must not
 * dial a wrong number.
 */
export function PhoneText({ className = "" }: { className?: string }) {
  const { phone } = company.contact;
  if (phone.status !== "supplied") return <span className={className}>{phone.display}</span>;
  return (
    <a href={`tel:${phone.tel}`} className={className}>
      {phone.display}
    </a>
  );
}
