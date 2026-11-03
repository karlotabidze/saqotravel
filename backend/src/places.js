const API = "https://places.googleapis.com/v1";
const SEARCH_MASK = "places.id,nextPageToken";
const DETAILS_MASK = [
  "id", "displayName", "location", "formattedAddress", "addressComponents",
  "primaryType", "types", "rating", "userRatingCount", "photos",
  "websiteUri", "googleMapsUri", "businessStatus"
].join(",");

export const PLACE_TYPES = [
  "hotel", "hostel", "guest_house", "bed_and_breakfast", "resort_hotel",
  "motel", "cottage", "inn", "lodging", "extended_stay_hotel",
  "farmstay", "camping_cabin"
];

export function categoryFor(place = {}) {
  const types = new Set([place.primaryType, ...(place.types || [])].filter(Boolean));
  if (types.has("hostel")) return "hostel";
  if (["guest_house", "bed_and_breakfast", "farmstay", "private_guest_room"].some(t => types.has(t))) return "guest_house";
  if (["cottage", "camping_cabin"].some(t => types.has(t))) return "cottage";
  if (["resort_hotel"].some(t => types.has(t))) return "resort";
  if (["apartment_building", "apartment_complex", "extended_stay_hotel"].some(t => types.has(t))) return "apartment";
  if (["hotel", "motel", "inn", "lodging"].some(t => types.has(t))) return "hotel";
  return "other";
}

function component(place, type) {
  return place.addressComponents?.find(c => c.types?.includes(type))?.longText || "";
}
const clean = value => String(value || "").normalize("NFC").replace(/\s+/g, " ").trim();

export function normalizePlace(place) {
  const region = clean(component(place, "administrative_area_level_1"));
  const city = clean(component(place, "locality") || component(place, "administrative_area_level_2"));
  const village = clean(component(place, "sublocality") || component(place, "neighborhood") || component(place, "administrative_area_level_3"));
  return {
    placeId: place.id,
    name: place.displayName?.text || "სასტუმრო",
    location: place.location || null,
    address: place.formattedAddress || "",
    region,
    city,
    village,
    category: categoryFor(place),
    googleMapsUri: place.googleMapsUri || "",
    websiteUri: place.websiteUri || "",
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? 0,
    businessStatus: place.businessStatus || "BUSINESS_STATUS_UNSPECIFIED",
    photos: (place.photos || []).slice(0, 3).map(p => ({
      name: p.name,
      authorAttributions: p.authorAttributions || []
    }))
  };
}

async function request(path, body, mask, apiKey) {
  const response = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": mask
    },
    body: JSON.stringify(body)
  });
  if (response.status === 429 || response.status >= 500) {
    const error = new Error(`Google Places temporary error: ${response.status}`);
    error.retryable = true;
    throw error;
  }
  if (!response.ok) throw new Error(`Google Places error ${response.status}: ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

export async function textSearch(body, apiKey) {
  return request("places:searchText", body, SEARCH_MASK, apiKey);
}
export async function nearbySearch(body, apiKey) {
  return request("places:searchNearby", body, SEARCH_MASK, apiKey);
}
export async function placeDetails(placeId, apiKey, languageCode = "ka") {
  const url = `${API}/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(languageCode)}`;
  const response = await fetch(url, {
    headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": DETAILS_MASK }
  });
  if (response.status === 429 || response.status >= 500) {
    const error = new Error(`Google Places temporary error: ${response.status}`);
    error.retryable = true;
    throw error;
  }
  if (!response.ok) throw new Error(`Place Details error ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return normalizePlace(await response.json());
}

export async function withRetry(fn, attempts = 5) {
  for (let i = 0; ; i++) {
    try { return await fn(); }
    catch (error) {
      if (!error.retryable || i >= attempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * (2 ** i), 15000) + Math.random() * 300));
    }
  }
}
