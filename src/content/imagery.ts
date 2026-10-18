/**
 * Imagery slots. Every section image on the site is a <Scene name="…"> — an original, theme-aware illustration
 * (no stock-photo licence involved). To use real photography instead, put the file in /public/images and map it here,
 * e.g.  home: { src: "/images/home.jpg", alt: "A family home in Subukia" }.
 * Only use photos CONSOLE owns or has a licence for. Photos are shown with a tonal overlay so text stays readable.
 */
export type SceneName = "land" | "hills" | "home" | "road" | "family" | "health";

export const photos: Partial<Record<SceneName, { src: string; alt: string }>> = {};

/**
 * Real photographs, hotlinked from Unsplash's CDN under the Unsplash License (free, commercial use allowed, credit appreciated —
 * credit is shown under each photo). Chosen by title/licence on the Unsplash pages; REVIEW each one visually before launch, and
 * swap any you don't like by changing the id below. If a photo fails to load, the illustration for `fallback` is shown instead.
 * Prefer CONSOLE's own photography when available: add it to /public/images and use { src: "/images/…" } instead.
 */
export type PhotoId = "land" | "family" | "road" | "home" | "health";

export type StockPhoto = {
  src: string;
  alt: string;
  by: string;
  page: string;
  fallback: SceneName;
};

const cdn = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const stockPhotos: Record<PhotoId, StockPhoto> = {
  land: {
    src: cdn("1734036871909-906fb9b3d474"),
    alt: "Photograph of a green field with houses in the distance",
    by: "Joe Ol",
    page: "https://unsplash.com/photos/a-green-field-with-houses-in-the-distance-ZY0u6We7rDE",
    fallback: "hills",
  },
  family: {
    src: cdn("1596510914965-9ae08acae566"),
    alt: "Photograph of a woman carrying a baby",
    by: "Lawrence Crayton",
    page: "https://unsplash.com/photos/woman-in-black-and-white-striped-shirt-carrying-baby-in-blue-onesie-FWX91ORBR6E",
    fallback: "family",
  },
  road: {
    src: cdn("1762809675965-9c60ecb1d5d6"),
    alt: "Photograph of a car driving on a road with sunset light through trees",
    by: "Donnie Rosie",
    page: "https://unsplash.com/photos/car-driving-on-a-road-with-sunset-light-through-trees-WbjtAqSZ4Eg",
    fallback: "road",
  },
  home: {
    src: cdn("1570129477492-45c003edd2be"),
    alt: "Photograph of a gray wooden house",
    by: "Todd Kent",
    page: "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
    fallback: "home",
  },
  health: {
    src: cdn("1678695972687-033fa0bdbac9"),
    alt: "Photograph of a woman wearing a white coat and a stethoscope",
    by: "Ato Aikins",
    page: "https://unsplash.com/photos/a-woman-wearing-a-white-coat-and-a-stethoscope-TPT4pevJEmQ",
    fallback: "health",
  },
};
