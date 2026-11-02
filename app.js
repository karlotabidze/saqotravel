const state = { tours: [], flights: [], lang: localStorage.getItem("saqo-language") || "ka", theme: localStorage.getItem("saqo-theme") || "light", selectedTour: null };
const emailAddress = "karlotabidze@gmail.com";
const translations = {
  ka: { navHome:"მთავარი",navTours:"შიდა ტურები",navFlights:"ფრენები",navAbout:"ჩვენს შესახებ",navContact:"კონტაქტი",planTrip:"დაგეგმე მოგზაურობა",heroEyebrow:"აღმოაჩინე საქართველო ჩვენთან ერთად",heroTitle:"შენი შემდეგი თავგადასავალი<br>აქ იწყება.",heroText:"მთები, ზღვა, ღვინო და დაუვიწყარი ისტორიები — აღმოაჩინე საქართველო შენს ტემპში.",exploreTours:"ტურების აღმოჩენა",searchFlights:"შიდა ფრენები",tabTours:"ტურები",tabFlights:"შიდა ფრენები",destination:"მიმართულება",tourType:"ტურის ტიპი",duration:"ხანგრძლივობა",findTour:"ტურის ძიება",from:"საიდან",to:"სად",date:"თარიღი",passengers:"მგზავრები",findFlight:"რეისების ძიება",toursEyebrow:"შენი საქართველო",toursTitle:"აღმოაჩინე ადგილები,<br>რომლებიც არასდროს დაგავიწყდება.",toursIntro:"შერჩეული მარშრუტები საქართველოს ყველა კუთხეში — ქალაქური გასეირნებებიდან მთის თავგადასავლებამდე.",filterCity:"ქალაქი",filterPrice:"მაქს. ფასი",filterDuration:"ხანგრძლივობა",filterType:"ტურის ტიპი",flightEyebrow:"საქართველო ზემოდან",flightTitle:"გადაადგილდი მარტივად.",flightIntro:"მოძებნე შიდა რეისები თბილისს, ბათუმსა და ქუთაისს შორის.",flightHint:"აირჩიე მიმართულება და თარიღი ფრენების მოსაძებნად.",flightDisclaimer:"ფრენები ამ ეტაპზე დემო მონაცემებია. ფასები და განრიგი არ წარმოადგენს რეალურ შეთავაზებას.",aboutEyebrow:"ჩვენი ამბავი",aboutTitle:"საქართველო უფრო მეტია,<br>ვიდრე მიმართულება.",aboutText:"Saqo Travel აერთიანებს ადგილობრივ გამოცდილებას, გამორჩეულ მარშრუტებსა და მარტივ დაგეგმვას. გვჯერა, რომ საუკეთესო მოგზაურობა ადამიანებით, გემოებითა და აღმოჩენებით იქმნება.",regions:"რეგიონი",local:"ადგილობრივი შთაბეჭდილებები",support:"მხარდაჭერა",contactEyebrow:"დავგეგმოთ ერთად",contactTitle:"მზად ხარ ახალი<br>ისტორიისთვის?",contactText:"მოგვწერე სასურველი მიმართულება და ჩვენი გუნდი დაგეხმარება მოგზაურობის დაგეგმვაში.",yourName:"სახელი",yourPhone:"ტელეფონი",yourMessage:"შეტყობინება",sendRequest:"მოთხოვნის გაგზავნა",contactNote:"მოთხოვნა გაიგზავნება პირდაპირ ჩვენს ელფოსტაზე.",phoneInvalid:"შეიყვანეთ ქართული მობილურის ნომერი ფორმატით +995 5XX XXX XXX.",sendSuccess:"მოთხოვნა წარმატებით გაიგზავნა. მადლობა!",sendError:"მოთხოვნის გაგზავნა ვერ მოხერხდა. სცადეთ მოგვიანებით.",namePlaceholder:"თქვენი სახელი",phonePlaceholder:"+995 5XX XXX XXX",messagePlaceholder:"სად გსურთ მოგზაურობა?",themeLight:"ღია რეჟიმი",themeDark:"მუქი რეჟიმი",allDestinations:"ყველა მიმართულება",allTypes:"ყველა ტიპი",nature:"ბუნება",culture:"კულტურა",wine:"ღვინო",adventure:"თავგადასავალი",anyDuration:"ნებისმიერი",oneDay:"1 დღე",twoThreeDays:"2–3 დღე",fourPlusDays:"4+ დღე",allCities:"ყველა ქალაქი",upTo100:"100 ₾-მდე",upTo200:"200 ₾-მდე",upTo400:"400 ₾-მდე",rights:"ყველა უფლება დაცულია.",backTop:"ზემოთ დაბრუნება ↑",bookingTitle:"ტურის მოთხოვნა",sendBooking:"მოთხოვნის გაგზავნა",details:"დეტალები",book:"დაჯავშნის მოთხოვნა",days:"დღე",perPerson:"ერთ ადამიანზე",noTours:"მითითებული ფილტრებით ტური ვერ მოიძებნა.",included:"ფასში შედის",program:"პროგრამა",route:"მარშრუტი",bookFlight:"დაჯავშნის მოთხოვნა",flightNoResults:"ამ თარიღისთვის დემო რეისი ვერ მოიძებნა." },
  en: { navHome:"Home",navTours:"Georgia tours",navFlights:"Flights",navAbout:"About us",navContact:"Contact",planTrip:"Plan your trip",heroEyebrow:"Discover Georgia with us",heroTitle:"Your next adventure<br>starts here.",heroText:"Mountains, sea, wine and unforgettable stories — discover Georgia at your own pace.",exploreTours:"Explore tours",searchFlights:"Domestic flights",tabTours:"Tours",tabFlights:"Domestic flights",destination:"Destination",tourType:"Tour type",duration:"Duration",findTour:"Find a tour",from:"From",to:"To",date:"Date",passengers:"Passengers",findFlight:"Search flights",toursEyebrow:"Your Georgia",toursTitle:"Discover places<br>you will never forget.",toursIntro:"Curated routes across Georgia — from city walks to mountain adventures.",filterCity:"City",filterPrice:"Max. price",filterDuration:"Duration",filterType:"Tour type",flightEyebrow:"Georgia from above",flightTitle:"Travel with ease.",flightIntro:"Find domestic flights between Tbilisi, Batumi and Kutaisi.",flightHint:"Choose your route and date to search flights.",flightDisclaimer:"Flights are demo data only. Prices and schedules are not real offers.",aboutEyebrow:"Our story",aboutTitle:"Georgia is more<br>than a destination.",aboutText:"Saqo Travel brings together local expertise, unique routes and easy planning. We believe the best journeys are made of people, flavours and discoveries.",regions:"Regions",local:"Local experiences",support:"Support",contactEyebrow:"Let's plan together",contactTitle:"Ready for a new<br>story?",contactText:"Tell us where you want to go and our team will help plan your journey.",yourName:"Name",yourPhone:"Phone",yourMessage:"Message",sendRequest:"Send request",contactNote:"Your request will be sent directly to our email.",phoneInvalid:"Enter a Georgian mobile number in the format +995 5XX XXX XXX.",sendSuccess:"Your request was sent successfully. Thank you!",sendError:"Could not send your request. Please try again.",namePlaceholder:"Your name",phonePlaceholder:"+995 5XX XXX XXX",messagePlaceholder:"Where would you like to travel?",themeLight:"Light mode",themeDark:"Dark mode",allDestinations:"All destinations",allTypes:"All types",nature:"Nature",culture:"Culture",wine:"Wine",adventure:"Adventure",anyDuration:"Any duration",oneDay:"1 day",twoThreeDays:"2–3 days",fourPlusDays:"4+ days",allCities:"All cities",upTo100:"Up to ₾100",upTo200:"Up to ₾200",upTo400:"Up to ₾400",rights:"All rights reserved.",backTop:"Back to top ↑",bookingTitle:"Tour enquiry",sendBooking:"Send enquiry",details:"Details",book:"Request booking",days:"days",perPerson:"per person",noTours:"No tours match your filters.",included:"Included",program:"Itinerary",route:"Route",bookFlight:"Request booking",flightNoResults:"No demo flights found for this date." }
};
const t = (key) => translations[state.lang][key] || key;
const cityName = (tour) => state.lang === "en" ? tour.cityEn : tour.city;
const tourName = (tour) => state.lang === "en" ? tour.titleEn : tour.title;
const tourDescription = (tour) => state.lang === "en" ? tour.descriptionEn : tour.description;
const tourTypeLabel = (tour) => state.lang === "en" ? ({ nature: "Nature", culture: "Culture", wine: "Wine", adventure: "Adventure" }[tour.type] || tour.type) : tour.typeKa;
const money = (value) => new Intl.NumberFormat(state.lang === "ka" ? "ka-GE" : "en-US").format(value) + " ₾";
function safeText(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[char])); }

async function loadData() {
  try {
    const [toursResponse, flightsResponse] = await Promise.all([fetch("./data/tours.json"), fetch("./data/flights.json")]);
    if (!toursResponse.ok || !flightsResponse.ok) throw new Error("JSON მონაცემების ჩატვირთვა ვერ მოხერხდა");
    state.tours = await toursResponse.json();
    state.flights = await flightsResponse.json();
    renderTours();
    populateCities();
  } catch (error) {
    document.getElementById("tour-grid").innerHTML = '<p class="empty-state">მონაცემების ჩატვირთვა ვერ მოხერხდა. შეამოწმეთ data საქაღალდე.</p>';
    console.error(error);
  }
}
function populateCities() {
  const cities = [...new Set(state.tours.map((tour) => tour.city))];
  ["quick-city","filter-city"].forEach((id) => {
    const select = document.getElementById(id);
    select.querySelectorAll("option:not(:first-child)").forEach((option) => option.remove());
    cities.forEach((city) => { const option = document.createElement("option"); option.value = city; const tour = state.tours.find((item) => item.city === city); option.textContent = state.lang === "en" && tour ? tour.cityEn : city; select.append(option); });
  });
}
function renderTours() {
  const city = document.getElementById("filter-city").value;
  const price = Number(document.getElementById("filter-price").value || 0);
  const duration = document.getElementById("filter-duration").value;
  const type = document.getElementById("filter-type").value;
  const list = state.tours.filter((tour) => (!city || tour.city === city) && (!price || tour.price <= price) && (!type || tour.type === type) && (!duration || (duration === "1" ? tour.days === 1 : duration === "2" ? tour.days >= 2 && tour.days <= 3 : tour.days >= 4)));
  const grid = document.getElementById("tour-grid");
  if (!list.length) { grid.innerHTML = '<p class="empty-state">' + t("noTours") + '</p>'; return; }
  grid.innerHTML = list.map((tour) => '<article class="tour-card"><div class="tour-image" style="background-image:url(\'' + safeText(tour.image) + '\')"><span class="tour-tag">' + safeText(tourTypeLabel(tour)) + '</span></div><div class="tour-card-body"><div class="tour-meta"><span>⌖ ' + safeText(cityName(tour)) + '</span><span>' + tour.days + ' ' + t("days") + '</span></div><h3>' + safeText(tourName(tour)) + '</h3><p>' + safeText(tourDescription(tour)) + '</p><div class="tour-card-bottom"><span class="tour-price">' + money(tour.price) + ' <small>' + t("perPerson") + '</small></span><button class="text-button" data-details="' + safeText(tour.id) + '">' + t("details") + ' ↗</button></div></div></article>').join("");
  grid.querySelectorAll("[data-details]").forEach((button) => button.addEventListener("click", () => openTour(button.dataset.details)));
}
function openTour(id) {
  const tour = state.tours.find((item) => item.id === id);
  if (!tour) return;
  state.selectedTour = tour;
  const title = tourName(tour);
  const included = state.lang === "en" ? tour.includedEn : tour.included;
  const itinerary = state.lang === "en" ? tour.itineraryEn : tour.itinerary;
  document.getElementById("tour-detail").innerHTML = '<div class="detail-image" style="background-image:url(\'' + safeText(tour.image) + '\')"></div><div class="detail-content"><p class="eyebrow">' + safeText(cityName(tour)) + ' · ' + tour.days + ' ' + t("days") + '</p><h2>' + safeText(title) + '</h2><p>' + safeText(tourDescription(tour)) + '</p><h3>' + t("program") + '</h3><ul>' + itinerary.map((item) => '<li>' + safeText(item) + '</li>').join("") + '</ul><h3>' + t("included") + '</h3><ul>' + included.map((item) => '<li>' + safeText(item) + '</li>').join("") + '</ul><p><strong>' + money(tour.price) + '</strong> · ' + t("perPerson") + '</p><button class="button button-dark detail-book" id="open-booking">' + t("book") + '</button></div>';
  document.getElementById("tour-dialog").showModal();
  document.getElementById("open-booking").addEventListener("click", () => { document.getElementById("tour-dialog").close(); openBooking(tour); });
}
function openBooking(tour) {
  const form = document.getElementById("booking-form");
  form.elements.tour.value = tourName(tour);
  document.getElementById("booking-dialog").showModal();
}
function renderFlights(from, to, date, pax) {
  const results = state.flights.filter((flight) => flight.from === from && flight.to === to && (!flight.date || flight.date === date));
  const container = document.getElementById("flight-results");
  if (!results.length) { container.innerHTML = '<p class="flight-placeholder">' + t("flightNoResults") + '</p>'; return; }
  container.innerHTML = results.map((flight) => '<article class="flight-card"><div class="flight-airline"><strong>' + safeText(flight.airline) + '</strong><span>' + safeText(flight.number) + '</span></div><div class="flight-time"><strong>' + safeText(flight.departure) + '</strong><br><small>' + safeText(flight.from) + '</small></div><div class="flight-time"><strong>' + safeText(flight.arrival) + '</strong><br><small>' + safeText(flight.to) + '</small></div><div class="flight-price">' + money(flight.price * pax) + '</div><button class="button" data-flight="' + safeText(flight.number) + '">' + t("bookFlight") + '</button></article>').join("");
  container.querySelectorAll("[data-flight]").forEach((button) => button.addEventListener("click", () => {
    const flight = results.find((item) => item.number === button.dataset.flight);
    const subject = encodeURIComponent("Saqo Travel — flight enquiry " + flight.number);
    const body = encodeURIComponent("Flight: " + flight.number + "\nRoute: " + flight.from + " - " + flight.to + "\nDate: " + date + "\nPassengers: " + pax + "\nDemo price: " + (flight.price * pax) + " GEL");
    window.location.href = "mailto:" + emailAddress + "?subject=" + subject + "&body=" + body;
  }));
}
function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => { const value = t(element.dataset.i18n); if (value.includes("<br>")) element.innerHTML = value; else element.textContent = value; });
  document.getElementById("language-switch").textContent = state.lang === "ka" ? "EN" : "KA";
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  localStorage.setItem("saqo-language", state.lang);
  renderTours();
}
function applyTheme() { document.documentElement.dataset.theme = state.theme; const button = document.getElementById("theme-switch"); button.textContent = state.theme === "dark" ? "☀" : "☾"; button.setAttribute("aria-label", t(state.theme === "dark" ? "themeLight" : "themeDark")); localStorage.setItem("saqo-theme", state.theme); }
function validGeorgianPhone(value) { return new RegExp("^\\+9955\\d{8}$").test(value.replaceAll(" ", "")); }
function setupPhoneValidation(form) { const input = form.querySelector('input[name="phone"]'); if (!input) return; input.addEventListener("input", () => { input.value = input.value.replace(/[^0-9+]/g, ""); input.setCustomValidity(""); }); }
function setupEvents() {
  ["filter-city","filter-price","filter-duration","filter-type"].forEach((id) => document.getElementById(id).addEventListener("change", renderTours));
  document.getElementById("tour-search").addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("filter-city").value = document.getElementById("quick-city").value;
    document.getElementById("filter-type").value = document.getElementById("quick-type").value;
    document.getElementById("filter-duration").value = document.getElementById("quick-duration").value;
    renderTours();
    document.getElementById("tours").scrollIntoView({ behavior:"smooth" });
  });
  document.querySelectorAll(".search-tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll(".search-tab").forEach((item) => item.classList.toggle("active", item === tab));
    document.getElementById("tour-search").classList.toggle("hidden", tab.dataset.tab !== "tour-search");
    document.getElementById("flight-search").classList.toggle("hidden", tab.dataset.tab !== "flight-search");
  }));
  document.getElementById("flight-search").addEventListener("submit", (event) => {
    event.preventDefault();
    const from = document.getElementById("flight-from").value;
    const to = document.getElementById("flight-to").value;
    if (from === to) { alert("აირჩიეთ განსხვავებული აეროპორტები."); return; }
    renderFlights(from, to, document.getElementById("flight-date").value, Number(document.getElementById("flight-pax").value));
    document.getElementById("flights").scrollIntoView({ behavior:"smooth" });
  });
  document.getElementById("language-switch").addEventListener("click", () => { state.lang = state.lang === "ka" ? "en" : "ka"; applyLanguage(); applyTheme(); });
  document.getElementById("theme-switch").addEventListener("click", () => { state.theme = state.theme === "light" ? "dark" : "light"; applyTheme(); });
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const nav = document.getElementById("main-nav");
    const open = nav.classList.toggle("open");
    document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#main-nav a").forEach((link) => link.addEventListener("click", () => document.getElementById("main-nav").classList.remove("open")));
  document.getElementById("dialog-close").addEventListener("click", () => document.getElementById("tour-dialog").close());
  document.getElementById("booking-close").addEventListener("click", () => document.getElementById("booking-dialog").close());
  document.getElementById("booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = "ტურის მოთხოვნა\nტური: " + data.get("tour") + "\nსახელი: " + data.get("name") + "\nტელეფონი: " + data.get("phone") + "\nთარიღი: " + data.get("date") + "\nადამიანები: " + data.get("people");
    window.location.href = "mailto:" + emailAddress + "?subject=" + encodeURIComponent("Saqo Travel — ტურის მოთხოვნა") + "&body=" + encodeURIComponent(body);
  });
  const contactForm = document.getElementById("contact-form");
  setupPhoneValidation(contactForm);
  setupPhoneValidation(document.getElementById("booking-form"));
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = form.elements.phone;
    if (!validGeorgianPhone(phone.value)) { phone.setCustomValidity(t("phoneInvalid")); phone.reportValidity(); return; }
    const button = form.querySelector('button[type="submit"]');
    const note = form.querySelector(".form-note");
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = state.lang === "ka" ? "იგზავნება..." : "Sending...";
    try {
      const response = await fetch("https://formsubmit.co/ajax/" + emailAddress, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: form.elements.name.value.trim(), phone: phone.value.trim(), message: form.elements.message.value.trim(), _subject: "Saqo Travel — ახალი მოთხოვნა", _template: "table", _captcha: "false" }) });
      const result = await response.json();
      if (!response.ok || result.success !== "true") throw new Error(result.message || "Email delivery failed");
      note.textContent = t("sendSuccess"); note.classList.add("form-success"); form.reset();
    } catch (error) { console.error(error); note.textContent = t("sendError") + " " + emailAddress; note.classList.remove("form-success"); }
    finally { button.disabled = false; button.textContent = originalText; }
  });
}
document.getElementById("year").textContent = new Date().getFullYear();
const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
document.getElementById("flight-date").min = today.toISOString().slice(0,10);
document.getElementById("flight-date").value = today.toISOString().slice(0,10);
applyLanguage();
applyTheme();
setupEvents();
loadData();