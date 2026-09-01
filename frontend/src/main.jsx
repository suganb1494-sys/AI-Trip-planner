import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  IndianRupee,
  MapPin,
  Plane,
  Send,
  Sparkles,
  Users,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import "./index.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const money = (value) => Number(value).toLocaleString("en-IN");

async function apiJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    throw new Error(data.detail || "The trip service is unavailable.");
  }
  return data;
}

const destinationCatalog = {
  dubai: {
    name: "Dubai",
    flight: 24500,
    hotel: 7200,
    attractions: [
      ["Burj Khalifa & Dubai Mall", "Downtown Dubai", 3900],
      ["Al Fahidi Historical District", "Bur Dubai", 0],
      ["Dubai Creek abra ride", "Deira", 120],
      ["Desert safari", "Lahbab", 4500],
      ["Jumeirah Beach", "Jumeirah", 0],
    ],
    restaurants: [
      ["Operation Falafel", 900],
      ["Arabian Tea House", 1600],
    ],
    context:
      "The Dubai Metro connects the airport, Downtown, and Dubai Marina.",
  },
  goa: {
    name: "Goa",
    flight: 6500,
    hotel: 4200,
    attractions: [
      ["Calangute Beach morning", "North Goa", 0],
      ["Fort Aguada", "Candolim", 100],
      ["Basilica of Bom Jesus", "Old Goa", 0],
      ["Dudhsagar Falls family excursion", "Mollem", 1800],
      ["Colva Beach sunset", "South Goa", 0],
    ],
    restaurants: [
      ["Vinayak Family Restaurant", 650],
      ["Mum’s Kitchen", 900],
    ],
    context:
      "Group North Goa beaches together and keep Old Goa heritage sights on a separate day to reduce travel time.",
  },
  paris: {
    name: "Paris",
    flight: 46000,
    hotel: 11500,
    attractions: [
      ["Eiffel Tower", "7th arrondissement", 2800],
      ["Louvre Museum", "1st arrondissement", 2200],
      ["Montmartre walk", "Montmartre", 0],
      ["Seine river cruise", "Pont Neuf", 1800],
      ["Versailles day trip", "Versailles", 3000],
    ],
    restaurants: [
      ["Bouillon Chartier", 1700],
      ["Café de Flore", 2200],
    ],
    context:
      "Paris Metro links the major sights; group central riverbank attractions to minimize transfers.",
  },
  singapore: {
    name: "Singapore",
    flight: 18500,
    hotel: 8500,
    attractions: [
      ["Gardens by the Bay", "Marina Bay", 1900],
      ["Singapore Zoo", "Mandai", 3300],
      ["Chinatown heritage walk", "Chinatown", 0],
      ["Sentosa beach day", "Sentosa", 1200],
      ["Botanic Gardens", "Tanglin", 0],
    ],
    restaurants: [
      ["Maxwell Food Centre", 700],
      ["Lau Pa Sat", 900],
    ],
    context:
      "Singapore MRT is the most efficient way to connect Marina Bay, Chinatown, and Sentosa.",
  },
};

function genericDestination(name) {
  return {
    name,
    flight: 22000,
    hotel: 6500,
    attractions: [
      [`${name} city highlights`, `${name} city centre`, 1200],
      [`${name} heritage and culture tour`, `Historic ${name}`, 900],
      [`${name} nature and scenic experience`, `${name} region`, 700],
      [`${name} local market visit`, `Central ${name}`, 0],
      [`${name} family leisure day`, `${name} waterfront or park`, 500],
    ],
    restaurants: [
      [`${name} local kitchen`, 800],
      [`${name} family restaurant`, 1000],
    ],
    context: `Group nearby ${name} attractions on the same day and confirm local opening hours and travel times before visiting.`,
  };
}

function parseRequest(request) {
  const lower = request.toLowerCase();
  // Prefer the nearest `to <destination>` phrase. This accepts requests such
  // as "Plan a 5-day trip to Bangalore for 2 people".
  const destinationMatch = request.match(
    /\bto\s+([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:for|from|under|within|starting|on|with|budget|include|including)\b|[,.;]|$)/i,
  );
  const destinationName =
    destinationMatch?.[1]?.trim() ||
    Object.keys(destinationCatalog).find((destination) =>
      lower.includes(destination),
    ) ||
    "Dubai";
  const key = destinationName.toLowerCase();
  const days = Number(lower.match(/(\d+)\s*[- ]?day/)?.[1] || 5);
  const travelers = Number(
    lower.match(
      /(?:for|with)\s+(\d+)\s+(?:people|persons|travellers|travelers|adults)/,
    )?.[1] || 2,
  );
  const budgetText =
    request.match(/(?:₹|inr|rs\.?)\s*([\d,]+)/i)?.[1] || "150000";
  const departure =
    request
      .match(
        /\bfrom\s+([a-zA-Z ]+?)(?:\s+under|\s+for|,|\s+starting|\s+on|$)/i,
      )?.[1]
      ?.trim() || "Your city";
  const dateText = request.match(
    /(?:starting|start(?:ing)? on|on)\s+(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/i,
  );
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const start = dateText
    ? new Date(
        Number(dateText[3]),
        monthNames.indexOf(dateText[2].toLowerCase()),
        Number(dateText[1]),
      )
    : new Date(2026, 9, 15);
  return {
    key,
    destinationName,
    days,
    travelers,
    budget: Number(budgetText.replaceAll(",", "")),
    departure,
    start,
  };
}

function demoTrip(request) {
  const parsed = parseRequest(request);
  const destination =
    destinationCatalog[parsed.key] ||
    genericDestination(
      parsed.destinationName.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    );
  const attractions = Array.from(
    { length: parsed.days },
    (_, index) =>
      destination.attractions[index % destination.attractions.length],
  );
  const itinerary = attractions.map(([title, location, unitCost], index) => {
    const currentDate = new Date(parsed.start);
    currentDate.setDate(parsed.start.getDate() + index);
    const restaurant =
      destination.restaurants[index % destination.restaurants.length];
    const activityCost = unitCost * parsed.travelers;
    const mealCost = restaurant[1] * parsed.travelers;
    return {
      day: index + 1,
      date: currentDate.toLocaleDateString("en-CA"),
      theme: location,
      daily_cost: activityCost + mealCost + 900,
      items: [
        { time: "09:00", title, location, cost: activityCost },
        {
          time: "13:00",
          title: `Lunch at ${restaurant[0]}`,
          location,
          cost: mealCost,
        },
        {
          time: "17:00",
          title: "Flexible neighborhood exploration",
          location,
          cost: 0,
        },
      ],
    };
  });
  const nights = Math.max(parsed.days - 1, 1);
  const budget = {
    flight: destination.flight * parsed.travelers,
    hotel: destination.hotel * nights,
    food: 1500 * parsed.travelers * parsed.days,
    activities: attractions.reduce(
      (total, item) => total + item[2] * parsed.travelers,
      0,
    ),
    transport: 900 * parsed.days,
    other: Math.round(parsed.budget * 0.03),
  };
  budget.total = Object.values(budget).reduce(
    (total, value) => total + value,
    0,
  );
  budget.remaining = parsed.budget - budget.total;
  budget.currency = "INR";
  return {
    id: "local-demo",
    status: "planned",
    offline: true,
    requirements: {
      destination: destination.name,
      departure_city: parsed.departure,
      start_date: parsed.start.toLocaleDateString("en-CA"),
      duration_days: parsed.days,
      travelers: parsed.travelers,
      budget: parsed.budget,
    },
    plan: {
      itinerary,
      budget,
      flights: [
        {
          name: `${parsed.departure} to ${destination.name}`,
          location: destination.name,
          rating: 4.2,
          price: destination.flight,
          data_type: "estimated",
        },
      ],
      hotels: [
        {
          name: `${destination.name} family stay`,
          location: destination.name,
          rating: 4.3,
          price: destination.hotel,
          data_type: "estimated",
        },
      ],
      rag_context: [destination.context],
      request,
    },
  };
}

function Badge({ value }) {
  const colors = {
    estimated: "bg-orange-50 text-orange-700",
    cached: "bg-emerald-50 text-emerald-700",
    live: "bg-blue-50 text-blue-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${colors[value] || "bg-stone-100 text-stone-600"}`}
    >
      {value}
    </span>
  );
}

function App() {
  const [input, setInput] = useState(
    "Plan a 5-day trip to Dubai for 2 people from Chennai under ₹1,50,000, starting 15 October 2026.",
  );
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m the help assistant. I can explain how to use the planner, itinerary, budget, and navigation.",
    },
  ]);

  function helpReply(question) {
    const text = question.toLowerCase();
    if (text.includes("plan") || text.includes("trip")) return "Use the main Plan my trip box to enter your destination, dates, travellers, and budget. Click Plan my trip to see the output directly.";
    if (text.includes("budget")) return "The Budget card breaks down estimated flights, hotel, food, activities, transport, and other costs. It also shows the remaining amount.";
    if (text.includes("itinerary") || text.includes("day")) return "The itinerary is generated after you click Plan my trip. Use the Update trip button in the main planner to revise destination, duration, or traveller count.";
    return "I can help you use this app. Ask about planning a trip, updating an itinerary, or reading the budget.";
  }

  function sendHelp() {
    const question = chatInput.trim();
    if (!question) return;
    setMessages((history) => [...history, { role: "user", text: question }, { role: "assistant", text: helpReply(question) }]);
    setChatInput("");
  }

  function updateRequest(value) {
    setInput(value);
    // Once a plan exists, keep the visible result in sync with edits to the
    // main request box. The Update button remains available as a clear action.
    if (trip && value.trim()) setTrip(demoTrip(value));
  }

  function submit(message = input) {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    // The main planner shows results directly; chat remains optional for follow-ups.
    setChatOpen(false);
    // The POC is local-first: show the complete result immediately.
    const localPlan = demoTrip(message);
    setTrip(localPlan);
    setInput("");
    setChatInput("");
    setLoading(false);
    requestAnimationFrame(() => {
      window.history.replaceState(null, "", "#itinerary");
      document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const plan = trip?.plan;
  const requirements = trip?.requirements;
  const panel =
    "mb-6 rounded-[18px] border border-stone-300 bg-white p-6 shadow-[0_8px_30px_rgba(23,58,46,0.05)]";
  const goTo = (section) => (event) => {
    event.preventDefault();
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (section === "planner") target.querySelector("textarea")?.focus();
      return;
    }
    if (section === "itinerary" && input.trim()) {
      submit(input);
      return;
    }
    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="mx-auto max-w-[1240px] px-5 font-sans text-[#1b2b28] md:px-7">
      <nav className="site-nav">
        <div className="site-brand">
          <Sparkles className="text-[#d66e41]" size={22} /> Roamwise
        </div>
        <div className="site-links">
          <a className="nav-link" href="#planner" onClick={goTo("planner")}>Planner</a>
          <a className="nav-link" href="#itinerary" onClick={goTo("itinerary")}>Itinerary</a>
          <a className="nav-link" href="#chat" onClick={(event) => { event.preventDefault(); setChatOpen(true); }}>Help</a>
          <span>AI trip planner <b className="ml-1 rounded-full border border-stone-300 px-2 py-1">POC</b></span>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <div className="mobile-nav"><a href="#planner" onClick={(event) => { setMenuOpen(false); goTo("planner")(event); }}>Planner</a><a href="#itinerary" onClick={(event) => { setMenuOpen(false); goTo("itinerary")(event); }}>Itinerary</a><a href="#chat" onClick={(event) => { event.preventDefault(); setMenuOpen(false); setChatOpen(true); }}>Help</a></div>}
      </nav>

      <section className="pb-8 pt-16 text-center md:pt-20">
        <p className="mb-3 text-[11px] font-bold tracking-[.15em] text-[#b55d37]">
          DESIGNED AROUND YOUR BUDGET
        </p>
        <h1 className="text-4xl font-bold leading-[1.06] tracking-[-.04em] text-[#153f36] md:text-[54px]">
          From a sentence to a<br />
          <em className="font-display text-[#c7643c]">thoughtful journey.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-500">
          Tell us where, when, and how you like to travel. We’ll build a
          practical itinerary with transparent estimates.
        </p>
      </section>

      <section id="planner" className="mx-auto mb-14 flex max-w-3xl flex-col rounded-[18px] border border-stone-300 bg-white p-2.5 shadow-[0_16px_50px_rgba(23,58,46,0.08)] md:flex-row md:items-end">
        <textarea
          className="min-h-[78px] flex-1 resize-none border-0 p-4 leading-6 outline-0"
          value={input}
          onChange={(event) => updateRequest(event.target.value)}
          placeholder={trip ? "Ask for a change…" : "Describe your trip…"}
        />
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-[#174a3e] px-5 py-3.5 font-bold text-white disabled:opacity-50"
          onClick={submit}
          disabled={loading || !input.trim()}
        >
          {loading ? "Planning…" : trip ? "Update trip" : "Plan my trip"}{" "}
          <Send size={17} />
        </button>
      </section>

      {error && (
        <p className="mx-auto mb-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-800">
          {error}
        </p>
      )}
      {trip && !plan && (
        <section className="mx-auto mb-10 flex max-w-3xl gap-4 rounded-xl bg-orange-50 p-5">
          <CalendarDays />
          <div>
            <b>Travel dates needed</b>
            <p className="mt-1 text-stone-600">
              Enter a start date including the year so prices and weather are
              not invented.
            </p>
          </div>
        </section>
      )}

      {plan && (
        <div id="trip-output">
          <section className="mb-6 grid overflow-hidden rounded-[18px] bg-[#173f36] text-white sm:grid-cols-2 lg:grid-cols-4">
            {[
              [MapPin, "DESTINATION", requirements.destination],
              [
                CalendarDays,
                "DATES",
                `${requirements.start_date} · ${requirements.duration_days} days`,
              ],
              [Users, "TRAVELLERS", requirements.travelers],
              [IndianRupee, "BUDGET", money(requirements.budget)],
            ].map(([Icon, label, value]) => (
              <div
                className="border-b border-r border-white/10 p-5"
                key={label}
              >
                <span className="text-[10px] tracking-[.14em] text-[#b9cec8]">
                  {label}
                </span>
                <strong className="mt-2 flex items-center gap-2">
                  <Icon className="text-[#ef986f]" size={17} />
                  {value}
                </strong>
              </div>
            ))}
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
            <section id="itinerary" className={`${panel} itinerary`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-2 text-[11px] font-bold tracking-[.15em] text-[#b55d37]">
                    YOUR ROUTE
                  </p>
                  <h2 className="mb-6 text-2xl font-bold text-[#173f36]">
                    Day-by-day itinerary
                  </h2>
                </div>
                <Badge value="estimated" />
              </div>
              {plan.itinerary.map((day) => (
                <article
                  className="grid grid-cols-[55px_1fr] gap-5 border-t border-stone-200 py-6"
                  key={day.day}
                >
                  <div className="grid h-[55px] w-[55px] place-content-center rounded-full bg-[#e2ece7] text-center text-xl font-bold text-[#174a3e]">
                    <small className="text-[8px] tracking-widest">DAY</small>
                    {String(day.day).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#173f36]">{day.theme}</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {day.date} · est. ₹{money(day.daily_cost)}
                    </p>
                    {day.items.map((item) => (
                      <div
                        className="mt-4 grid grid-cols-[55px_1fr]"
                        key={item.time + item.title}
                      >
                        <time className="text-xs font-bold text-[#b55d37]">
                          {item.time}
                        </time>
                        <div className="flex flex-col gap-1">
                          <b>{item.title}</b>
                          <span className="text-xs text-stone-500">
                            {item.location} · ₹{money(item.cost)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </section>

            <aside>
              <section className={panel}>
                <p className="mb-2 text-[11px] font-bold tracking-[.15em] text-[#b55d37]">
                  COST OVERVIEW
                </p>
                <h2 className="mb-5 text-2xl font-bold text-[#173f36]">
                  Budget
                </h2>
                {Object.entries(plan.budget)
                  .filter(
                    ([key]) =>
                      !["currency", "total", "remaining"].includes(key),
                  )
                  .map(([key, value]) => (
                    <div
                      className="flex justify-between border-b border-stone-100 py-2.5 capitalize text-stone-600"
                      key={key}
                    >
                      <span>{key}</span>
                      <b>₹{money(value)}</b>
                    </div>
                  ))}
                <div className="flex justify-between pt-4 text-lg">
                  <span>Total estimate</span>
                  <b>₹{money(plan.budget.total)}</b>
                </div>
                <div
                  className={`mt-3 flex justify-between rounded-xl p-3 ${plan.budget.remaining >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
                >
                  <span>
                    {plan.budget.remaining >= 0 ? "Remaining" : "Over budget"}
                  </span>
                  <b>₹{money(Math.abs(plan.budget.remaining))}</b>
                </div>
              </section>
              <section className={panel}>
                <p className="mb-2 text-[11px] font-bold tracking-[.15em] text-[#b55d37]">
                  RECOMMENDED
                </p>
                <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-[#173f36]">
                  <Plane size={20} /> Travel picks
                </h2>
                {[plan.flights[0], plan.hotels[0]].map((item) => (
                  <div
                    className="flex justify-between gap-3 border-t border-stone-100 py-4"
                    key={item.name}
                  >
                    <div className="flex flex-col gap-1">
                      <b>{item.name}</b>
                      <span className="text-xs text-stone-500">
                        {item.location} · ★ {item.rating}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <b>₹{money(item.price)}</b>
                      <Badge value={item.data_type} />
                    </div>
                  </div>
                ))}
              </section>
              <section className={`${panel} bg-[#e6eee9]`}>
                <Badge value="cached" />
                <p className="mt-3 text-sm leading-6">{plan.rag_context[0]}</p>
              </section>
            </aside>
          </div>
        </div>
      )}
      <footer className="py-9 text-center text-xs text-stone-500">
        Estimates are planning aids, not booking quotes. Confirm live prices and
        availability with providers.
      </footer>
      <button className={`chat-toggle ${chatOpen ? "hidden" : ""}`} onClick={() => setChatOpen(true)} aria-label="Open help"><MessageCircle size={19} /> Help</button>
      <aside id="chat" className={`chat-drawer ${chatOpen ? "open" : ""}`} aria-label="AI assistant">
        <div className="chat-drawer-header"><div><p>ROAMWISE HELP</p><b>How can I help?</b></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><X size={18} /></button></div>
        <div className="chat-history" aria-live="polite">
          {messages.map((message, index) => <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>)}
        </div>
        <div className="chat-composer">
          <input className="chat-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendHelp(); }} placeholder="Ask how to use the app…" />
          <button className="chat-send" onClick={sendHelp} disabled={!chatInput.trim()} aria-label="Send help message"><Send size={16} /></button>
        </div>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
