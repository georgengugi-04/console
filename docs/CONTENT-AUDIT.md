# Content audit — `koo.zip`

The archive is small: four legacy HTML pages, one stylesheet, an empty `script.js`, two images. It was used strictly
as a **data source**; none of its layout, styling or code was reused.

## Reused (verified present in the files)
| Fact | Source |
|---|---|
| Name "CONSOLE INSURANCE" / "CONSOLE Insurance Agency" | all pages |
| Address "20109 Subukia, Nakuru" | `insurance-contact.html` |
| Email `mainamalcolm@consoleinsurance.com` | `insurance-contact.html` |
| Phone "+254 12701222" (**see below**) | `insurance-contact.html` |
| Service categories: Vehicle, Health, Property | `modern-insurance.html` |
| "health, auto, home, or life insurance" | `koo.html` (so Life is included) |

## Problems found
1. **The phone number is not a valid Kenyan number** — only 8 digits follow +254 (mobiles need 9). It is shown exactly as
   supplied but is **not** a `tel:` link until the status in `content/company.ts` is changed to `supplied`.
2. **Email name vs founder name** — the address starts `maina…`, the founder is Malcolm **Njoroge**. Possibly a
   middle name; please confirm the address is the one to publish.
3. **`ecommerce-contact (1).html` belongs to a different business** (`info@modernshop.com`, "ARKYLS District",
   +254 718-470-465, Poppins/Tailwind template). Nothing from it was used.
4. **Unverified claims in the legacy copy were dropped**: "24/7 roadside assistance", "Comprehensive coverage…",
   login / sign-up / social-login form (no auth exists).
5. **`1.jpg`** is a stock photograph (tree and lake) and **`2.webp`** is an *older* logo that differs from the logo
   you supplied separately; the supplied logo was used as the reference.
6. The legacy contact form only showed `alert('Thank you…')` with no backend — the exact "fake success" the brief
   forbids. It was replaced by real validation and honest delivery states.

## Not in the archive (so not on the site)
Licence / IRA registration, underwriters or insurer partners, opening hours, social profiles, exact street address
or map coordinates, founding date, claims process and documents, whether **business** insurance is offered,
a founder photograph, data-protection registration. Business insurance is hidden; the founder card uses a labelled
placeholder; the map card links to a Maps search for "Subukia, Nakuru" instead of showing an invented pin.
