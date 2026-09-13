import { useState, useEffect } from 'react'
import './App.css'
import { extractForPlanner, replanActivities, askPlanAssistant } from './utils/api'
import { parseChatExport } from './utils/parseChatImport'

const destinations = {
  'Barcelona, Spain': {
    weather: '24°C',
    weatherText: 'Mostly sunny',
    image:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Breakfast at Brunch & Cake',
        location: 'Eixample',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Sagrada Família',
        location: 'Carrer de Mallorca',
        type: 'Culture',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1583779457094-ab6f6a2c1a3f?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'Gothic Quarter',
        location: 'Barcelona Old Town',
        type: 'Explore',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1539035104074-dee8f3d7c3b8?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Barceloneta Beach',
        location: 'Barcelona Coast',
        type: 'Outdoor',
        interest: 'Beaches',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'Tapas Dinner',
        location: 'El Born',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },

  'Paris, France': {
    weather: '22°C',
    weatherText: 'Partly cloudy',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Café Breakfast',
        location: 'Saint-Germain',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Eiffel Tower',
        location: 'Champ de Mars',
        type: 'Culture',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'Louvre Museum',
        location: 'Rue de Rivoli',
        type: 'Art',
        interest: 'Art',
        image:
          'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Montmartre Walk',
        location: 'Montmartre',
        type: 'Explore',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'French Dinner',
        location: 'Le Marais',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },

  'Rome, Italy': {
    weather: '26°C',
    weatherText: 'Sunny',
    image:
      'https://images.unsplash.com/photo-1529260830199-42c71b1b13d1?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Italian Breakfast',
        location: 'Centro Storico',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Colosseum',
        location: 'Piazza del Colosseo',
        type: 'Culture',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1529260830199-42c71b1b13d1?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'Vatican Museums',
        location: 'Vatican City',
        type: 'Art',
        interest: 'Art',
        image:
          'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Trevi Fountain',
        location: 'Trevi',
        type: 'Explore',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1529260830199-42c71b1b13d1?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'Roman Dinner',
        location: 'Trastevere',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },

  'Tokyo, Japan': {
    weather: '25°C',
    weatherText: 'Clear skies',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Japanese Breakfast',
        location: 'Shibuya',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Meiji Shrine',
        location: 'Shibuya',
        type: 'Culture',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'teamLab Borderless',
        location: 'Azabudai Hills',
        type: 'Art',
        interest: 'Art',
        image:
          'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Shibuya Crossing',
        location: 'Shibuya',
        type: 'Explore',
        interest: 'Shopping',
        image:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'Izakaya Dinner',
        location: 'Shinjuku',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },

  'Dubai, UAE': {
    weather: '31°C',
    weatherText: 'Sunny',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Arabian Breakfast',
        location: 'Downtown Dubai',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Burj Khalifa',
        location: 'Downtown Dubai',
        type: 'Explore',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'Dubai Mall',
        location: 'Downtown Dubai',
        type: 'Shopping',
        interest: 'Shopping',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Jumeirah Beach',
        location: 'Jumeirah',
        type: 'Outdoor',
        interest: 'Beaches',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'Dubai Dinner',
        location: 'Dubai Marina',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },

  'Istanbul, Türkiye': {
    weather: '23°C',
    weatherText: 'Mostly sunny',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        time: '09:00',
        title: 'Turkish Breakfast',
        location: 'Sultanahmet',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '11:00',
        title: 'Hagia Sophia',
        location: 'Sultanahmet',
        type: 'Culture',
        interest: 'Culture',
        image:
          'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '14:00',
        title: 'Grand Bazaar',
        location: 'Beyazıt',
        type: 'Shopping',
        interest: 'Shopping',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '17:00',
        title: 'Bosphorus Walk',
        location: 'Ortaköy',
        type: 'Outdoor',
        interest: 'Nature',
        image:
          'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
      },
      {
        time: '20:00',
        title: 'Turkish Dinner',
        location: 'Karaköy',
        type: 'Food',
        interest: 'Food',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
}

const interests = [
  {
    name: 'Culture',
    image:
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Food',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Beaches',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Art',
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Shopping',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Nature',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80',
  },
]

const DISRUPTION_REASONS = [
  "It's raining",
  "We're running late",
  'We have less money',
  'Our flight is delayed',
  'An activity is closed',
]

function Navbar({ onHome, onPlan }) {
  return (
    <nav className="navbar">
      <button className="logo-button" onClick={onHome}>
        <span className="logo-mark">✦</span>
        Travel<span>Mind</span>
      </button>

      <div className="nav-links">
        <a href="#features">How it works</a>
        <a href="#about">About</a>

        <button className="nav-demo" onClick={onPlan}>
          Plan a Trip
        </button>
      </div>
    </nav>
  )
}

function LandingPage({ onStart }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span>✦</span> AI-POWERED TRAVEL PLANNING
          </div>

          <h1>
            Your trip.
            <br />
            <span>Thinking ahead.</span>
          </h1>

          <p className="hero-description">
            TravelMind creates intelligent itineraries around your
            interests and priorities — then adapts when reality
            changes. Just talk to it, or drop in your group chat.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              Start Planning
              <span>→</span>
            </button>

            <button className="secondary-button" onClick={onStart}>
              Build Your Itinerary
            </button>
          </div>

          <div className="trust-row">
            <div>
              <strong>94%</strong>
              <span>Trip health</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Adaptability</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Smart companion</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card weather-card">
            <span className="weather-icon">☀️</span>

            <div>
              <strong>Barcelona</strong>
              <small>24°C · Perfect day</small>
            </div>
          </div>

          <div className="phone-mockup">
            <div className="phone-top">
              <span>TravelMind</span>
              <span>•••</span>
            </div>

            <div className="mini-heading">
              <small>YOUR TRIP</small>
              <h3>Barcelona</h3>
              <p>10 — 17 September</p>
            </div>

            <div className="mini-health">
              <div>
                <span>Trip Health</span>
                <strong>94</strong>
              </div>

              <div className="health-bar">
                <div></div>
              </div>

              <small>Everything looks great</small>
            </div>

            <div className="mini-item">
              <span>09:00</span>
              <div>☕</div>
              <p>Breakfast</p>
            </div>

            <div className="mini-item">
              <span>11:00</span>
              <div>🏛️</div>
              <p>Sagrada Família</p>
            </div>

            <div className="mini-item">
              <span>14:00</span>
              <div>🗺️</div>
              <p>Gothic Quarter</p>
            </div>
          </div>

          <div className="floating-card smart-card">
            <span>✦</span>

            <div>
              <strong>TravelMind is thinking</strong>
              <small>Your plans can adapt.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <span>WHY TRAVELMIND?</span>
          <h2>A trip that thinks ahead.</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Chat → Plan</h3>
            <p>
              Describe your group trip naturally, or import your real
              WhatsApp/Telegram export. TravelMind's AI extracts
              destinations, budgets, interests and priorities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Dynamic Planning</h3>
            <p>
              Build personalised itineraries around what matters most,
              not just a list of popular places.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Budget-Aware</h3>
            <p>
              Track estimated spending and keep recommendations aligned
              with the group's available budget.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Smart Replanning</h3>
            <p>
              When reality changes, TravelMind's AI reasons through
              feasible recovery options while protecting important plans.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Trip Health</h3>
            <p>
              See how well your itinerary is holding together and where
              attention is needed.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Preference Intelligence</h3>
            <p>
              High, low and sacrifice priorities guide every replanning
              decision instead of treating every activity equally.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div>
          <span className="eyebrow dark">ABOUT TRAVELMIND</span>

          <h2>
            Travel planning that
            <span> thinks ahead.</span>
          </h2>
        </div>

        <div>
          <p>
            TravelMind is designed to move beyond static travel
            itineraries. Instead of simply telling you where to go,
            it understands what matters most to you and helps protect
            those plans when circumstances change.
          </p>

          <div className="core-sequence">
            <span>Chat</span>
            <b>→</b>
            <span>Understand</span>
            <b>→</b>
            <span>Structure</span>
            <b>→</b>
            <span>Plan</span>
            <b>→</b>
            <span>Reality changes</span>
            <b>→</b>
            <span>Replan</span>
          </div>
        </div>
      </section>
    </main>
  )
}

function InterestCard({ interest, selected, onClick }) {
  return (
    <button
      type="button"
      className={`interest-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img src={interest.image} alt={interest.name} />

      <span>{interest.name}</span>

      {selected && <div className="interest-check">✓</div>}
    </button>
  )
}

function getActivityCost(activity) {
  const costByType = {
    Food: 38,
    Culture: 32,
    Art: 30,
    Shopping: 55,
    Outdoor: 18,
    Explore: 22,
  }

  return costByType[activity.type] || 25
}

function getActivityDescription(activity) {
  const descriptions = {
    'Sagrada Família':
      'A landmark architecture stop that fits a culture-focused itinerary.',
    'Gothic Quarter':
      'A flexible walking and exploration block that can be moved when timing changes.',
    'Barceloneta Beach':
      'An outdoor activity that is intentionally flexible because it depends on weather.',
    'Eiffel Tower':
      'A high-priority sightseeing stop with a strong fit for a first-time Paris itinerary.',
    'Louvre Museum':
      'An art-focused museum visit that can be shortened or moved when needed.',
    Colosseum:
      'A major historical stop that anchors a culture-focused day in Rome.',
    'Vatican Museums':
      'An art and history experience that works well as a structured timed visit.',
    'Meiji Shrine':
      'A cultural stop that provides a calmer contrast to Tokyo’s busy districts.',
    'teamLab Borderless':
      'An immersive digital-art experience selected for an art-focused itinerary.',
    'Burj Khalifa':
      'A landmark experience that gives the itinerary a strong destination anchor.',
    'Dubai Mall':
      'A flexible shopping block that can absorb changes in timing or budget.',
    'Hagia Sophia':
      'A major cultural landmark that anchors a history-focused Istanbul itinerary.',
    'Grand Bazaar':
      'A flexible shopping and exploration activity that can be moved if plans change.',
  }

  return (
    descriptions[activity.title] ||
    'A personalised activity selected to fit your trip preferences.'
  )
}

// Takes the trip's current state plus one AI-extracted detection and
// returns the next trip state. Kept pure so both live chat and batch
// import can thread it without racing React's async state updates.
function computeNextTrip(current, detected) {
  let { destination, budget, interests: currentInterests, priorities } = current

  if (
    detected.destination &&
    destinations[detected.destination] &&
    detected.destination !== destination
  ) {
    destination = detected.destination
    const activities = destinations[destination].activities
    priorities = {
      high: activities[1]?.title || activities[0]?.title,
      low: activities[2]?.title || activities[0]?.title,
      sacrifice: activities[3]?.title || activities[0]?.title,
    }
  }

  if (typeof detected.budget === 'number' && detected.budget > 0) {
    budget = String(detected.budget)
  }

  if (Array.isArray(detected.interests) && detected.interests.length > 0) {
    currentInterests = [...new Set([...currentInterests, ...detected.interests])]
  }

  const validTitles = destinations[destination].activities.map((a) => a.title)
  priorities = {
    high: detected.priorityHigh && validTitles.includes(detected.priorityHigh) ? detected.priorityHigh : priorities.high,
    low: detected.priorityLow && validTitles.includes(detected.priorityLow) ? detected.priorityLow : priorities.low,
    sacrifice:
      detected.prioritySacrifice && validTitles.includes(detected.prioritySacrifice)
        ? detected.prioritySacrifice
        : priorities.sacrifice,
  }

  return { destination, budget, interests: currentInterests, priorities }
}

function ImportChatModal({ onClose, onImport, importing, progress }) {
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState(null)

  function handleParse() {
    setParsed(parseChatExport(raw))
  }

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-modal" onClick={(event) => event.stopPropagation()}>
        <div className="import-modal-header">
          <div>
            <span>IMPORT CHAT</span>
            <h2>Bring in your export</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {!parsed && (
          <>
            <p className="import-hint">
              Paste a Telegram export (open the chat → ⋮ menu → Export chat history) or a
              WhatsApp export (Export Chat → Without Media). TravelMind reads it the same way it
              reads live chat — no bot setup needed.
            </p>
            <textarea
              className="import-textarea"
              rows={8}
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              placeholder={
                '12/09/2026, 14:32 - Alex: We are going to Barcelona with a €1500 budget\n12/09/2026, 14:33 - Sam: Sagrada Família is a must for me'
              }
            />
            <button type="button" className="import-parse-btn" onClick={handleParse} disabled={!raw.trim()}>
              Preview messages
            </button>
          </>
        )}

        {parsed && !importing && (
          <>
            <div className="import-preview-count">
              {parsed.length} message{parsed.length === 1 ? '' : 's'} found
            </div>
            <div className="import-preview-list">
              {parsed.slice(0, 30).map((message, idx) => (
                <div key={idx} className="import-preview-row">
                  <span className="import-preview-author">{message.author}</span>
                  <span className="import-preview-text">{message.text}</span>
                </div>
              ))}
              {parsed.length > 30 && <div className="import-preview-more">+{parsed.length - 30} more</div>}
            </div>
            <div className="import-actions">
              <button type="button" className="import-back-btn" onClick={() => setParsed(null)}>
                Back
              </button>
              <button
                type="button"
                className="import-apply-btn"
                onClick={() => onImport(parsed)}
                disabled={parsed.length === 0}
              >
                Import {parsed.length} messages
              </button>
            </div>
          </>
        )}

        {importing && (
          <div className="import-progress">
            ✦ Reading message {progress.current} of {progress.total}…
          </div>
        )}
      </div>
    </div>
  )
}

function ChatPlanner({
  destination,
  dates,
  budget,
  selectedInterests,
  priorities,
  setDestination,
  setDates,
  setBudget,
  setSelectedInterests,
  setPriorities,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Tell me about your group trip naturally, or import a real chat export. I’ll turn it into a structured trip plan.',
    },
  ])

  const [input, setInput] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 })

  function currentSnapshot() {
    return { destination, budget, interests: selectedInterests, priorities }
  }

  function catalogFor() {
    // Send every destination's activity titles (they're all globally unique), not just the
    // current one — so a message that both names a new destination and assigns a priority
    // within it (e.g. "let's go to Tokyo, teamLab Borderless is a must") resolves correctly
    // in one pass instead of falling back to defaults because the old destination's activity
    // list didn't contain the new title.
    return {
      validDestinations: Object.keys(destinations),
      validInterests: interests.map((it) => it.name),
      activityTitles: Object.values(destinations).flatMap((d) => d.activities.map((a) => a.title)),
    }
  }

  function applyNext(next) {
    setDestination(next.destination)
    setBudget(next.budget)
    setSelectedInterests(next.interests)
    setPriorities(next.priorities)
  }

  async function sendMessage(text = input, author = 'You') {
    const cleanText = text.trim()
    if (!cleanText) return

    setMessages((current) => [...current, { role: 'user', author, text: cleanText }])
    setInput('')
    setExtracting(true)

    try {
      const snapshot = currentSnapshot()
      const detected = await extractForPlanner(cleanText, author, snapshot, catalogFor())
      applyNext(computeNextTrip(snapshot, detected))
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: detected.summary || 'Got it — updated the trip brief below.' },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: "Couldn't reach the planning AI just now — try again in a moment." },
      ])
    } finally {
      setExtracting(false)
    }
  }

  async function handleImport(parsedMessages) {
    setImporting(true)
    setImportProgress({ current: 0, total: parsedMessages.length })

    let working = currentSnapshot()

    for (let i = 0; i < parsedMessages.length; i++) {
      const { author, text } = parsedMessages[i]
      setMessages((current) => [...current, { role: 'user', author, text }])
      setImportProgress({ current: i + 1, total: parsedMessages.length })

      try {
        const detected = await extractForPlanner(text, author, working, catalogFor())
        working = computeNextTrip(working, detected)
        applyNext(working)
      } catch {
        // skip this message and continue with the rest of the import
      }
    }

    setMessages((current) => [
      ...current,
      { role: 'assistant', text: `Imported ${parsedMessages.length} messages and updated the trip brief.` },
    ])
    setImporting(false)
    setImportOpen(false)
  }

  return (
    <section className="chat-planner-card">
      <div className="chat-planner-header">
        <div>
          <span className="chat-kicker">TRAVELMIND ASSISTANT</span>
          <h2>Plan by talking.</h2>
          <p>
            Start with a normal group message, or import a real chat export. TravelMind's AI
            extracts the details and turns them into a shared trip brief.
          </p>
        </div>

        <div className="chat-header-actions">
          <button type="button" className="import-chat-button" onClick={() => setImportOpen(true)}>
            📥 Import chat
          </button>
          <div className="chat-status">
            <span></span>
            Listening
          </div>
        </div>
      </div>

      <div className="chat-layout">
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                <span className="chat-avatar">
                  {message.role === 'assistant' ? '✦' : (message.author || 'You').slice(0, 3).toUpperCase()}
                </span>

                <div>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              </div>
            ))}

            {extracting && (
              <div className="chat-message">
                <span className="chat-avatar">✦</span>
                <div className="chat-bubble">Reading that…</div>
              </div>
            )}
          </div>

          <div className="chat-quick-actions">
            <button
              type="button"
              onClick={() =>
                sendMessage('We are going to Barcelona with a €1500 budget and we love food, culture and art.')
              }
            >
              Barcelona + €1500
            </button>

            <button
              type="button"
              onClick={() => sendMessage('Sagrada Família is high priority and Barceloneta Beach can be sacrificed.')}
            >
              Set priorities
            </button>
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessage()
                }
              }}
              placeholder="Tell TravelMind about your trip..."
              disabled={extracting}
            />

            <button type="button" onClick={() => sendMessage()} aria-label="Send message" disabled={extracting || !input.trim()}>
              →
            </button>
          </div>
        </div>

        <div className="trip-brief">
          <div className="brief-heading">
            <span>TRIP UNDERSTOOD</span>
            <strong>✓</strong>
          </div>

          <div className="brief-item">
            <small>DESTINATION</small>
            <strong>{destination.split(',')[0]}</strong>
          </div>

          <div className="brief-item">
            <small>DATES</small>
            <strong>{dates}</strong>
          </div>

          <div className="brief-item">
            <small>BUDGET</small>
            <strong>€{budget || '0'}</strong>
          </div>

          <div className="brief-item">
            <small>INTERESTS</small>
            <div className="brief-tags">
              {selectedInterests.length > 0 ? (
                selectedInterests.map((interest) => <span key={interest}>{interest}</span>)
              ) : (
                <em>None selected</em>
              )}
            </div>
          </div>

          <div className="brief-priority">
            <small>PRIORITIES</small>
            <p>
              <b>★</b> {priorities.high}
            </p>
            <p>
              <b>↗</b> {priorities.low}
            </p>
            <p>
              <b>×</b> {priorities.sacrifice}
            </p>
          </div>
        </div>
      </div>

      {importOpen && (
        <ImportChatModal
          onClose={() => setImportOpen(false)}
          onImport={handleImport}
          importing={importing}
          progress={importProgress}
        />
      )}
    </section>
  )
}

function Planner({ onGenerate }) {
  const [destination, setDestination] = useState('Barcelona, Spain')
  const [dates, setDates] = useState('10 — 17 September')
  const [budget, setBudget] = useState('1500')

  const [selectedInterests, setSelectedInterests] = useState(['Culture', 'Food', 'Art'])

  const [priorities, setPriorities] = useState({
    high: 'Sagrada Família',
    low: 'Gothic Quarter',
    sacrifice: 'Barceloneta Beach',
  })

  const availableActivities = destinations[destination].activities

  function toggleInterest(name) {
    setSelectedInterests((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }

  function updatePriority(type, value) {
    setPriorities((current) => ({ ...current, [type]: value }))
  }

  function handleDestinationChange(event) {
    const newDestination = event.target.value
    setDestination(newDestination)

    const activities = destinations[newDestination].activities
    setPriorities({
      high: activities[1]?.title || activities[0]?.title,
      low: activities[2]?.title || activities[0]?.title,
      sacrifice: activities[3]?.title || activities[0]?.title,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onGenerate({ destination, dates, budget, interests: selectedInterests, priorities })
  }

  return (
    <main className="planner-page">
      <div className="planner-header">
        <span className="eyebrow dark">LET'S BUILD YOUR TRIP</span>
        <h1>Where are you going?</h1>
        <p>Start with a conversation or fine-tune the structured plan below.</p>
      </div>

      <ChatPlanner
        destination={destination}
        dates={dates}
        budget={budget}
        selectedInterests={selectedInterests}
        priorities={priorities}
        setDestination={setDestination}
        setDates={setDates}
        setBudget={setBudget}
        setSelectedInterests={setSelectedInterests}
        setPriorities={setPriorities}
      />

      <form className="planner-card" onSubmit={handleSubmit}>
        <div className="planner-form-heading">
          <span>STRUCTURED TRIP DETAILS</span>
          <p>Fine-tune anything TravelMind understood from your chat.</p>
        </div>

        <div className="form-group">
          <label>Destination</label>
          <div className="input-wrapper">
            <span>📍</span>
            <select value={destination} onChange={handleDestinationChange}>
              {Object.keys(destinations).map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Travel dates</label>
            <div className="input-wrapper">
              <span>📅</span>
              <input value={dates} onChange={(event) => setDates(event.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Budget (€)</label>
            <div className="input-wrapper">
              <span>💰</span>
              <input type="number" min="0" value={budget} onChange={(event) => setBudget(event.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>What are you interested in?</label>
          <div className="interest-grid">
            {interests.map((interest) => (
              <InterestCard
                key={interest.name}
                interest={interest}
                selected={selectedInterests.includes(interest.name)}
                onClick={() => toggleInterest(interest.name)}
              />
            ))}
          </div>
        </div>

        <div className="priority-section">
          <div className="priority-heading">
            <span>✦</span>
            <div>
              <label>YOUR TRIP PRIORITIES</label>
              <p>Tell TravelMind what should never be missed and what can be sacrificed if plans change.</p>
            </div>
          </div>

          <div className="priority-row">
            <div className="priority-icon high">★</div>
            <div className="priority-text">
              <strong>High Priority</strong>
              <span>Must be included in your trip</span>
            </div>
            <select value={priorities.high} onChange={(event) => updatePriority('high', event.target.value)}>
              {availableActivities.map((activity) => (
                <option key={activity.title} value={activity.title}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>

          <div className="priority-row">
            <div className="priority-icon low">↗</div>
            <div className="priority-text">
              <strong>Low Priority</strong>
              <span>Nice to have, but can be moved</span>
            </div>
            <select value={priorities.low} onChange={(event) => updatePriority('low', event.target.value)}>
              {availableActivities.map((activity) => (
                <option key={activity.title} value={activity.title}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>

          <div className="priority-row">
            <div className="priority-icon sacrifice">×</div>
            <div className="priority-text">
              <strong>Can Be Sacrificed</strong>
              <span>Remove this first if disruption occurs</span>
            </div>
            <select value={priorities.sacrifice} onChange={(event) => updatePriority('sacrifice', event.target.value)}>
              {availableActivities.map((activity) => (
                <option key={activity.title} value={activity.title}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="generate-button" type="submit">
          Build My Trip <span>✦</span>
        </button>
      </form>
    </main>
  )
}

function ItineraryCard({ activity, onMore, isProtected }) {
  return (
    <div className="itinerary-card">
      <div className="activity-time">{activity.time}</div>

      <div className="activity-icon">
        <img src={activity.image} alt="" />
      </div>

      <div className="activity-info">
        <span>{activity.type}</span>
        <h3>{activity.title}</h3>
        <p>📍 {activity.location}</p>

        {isProtected && <small className="protected-label">★ Protected by your priority</small>}
      </div>

      <button
        type="button"
        className="more-button"
        onClick={() => onMore(activity)}
        aria-label={`More information about ${activity.title}`}
      >
        •••
      </button>
    </div>
  )
}

function ActivityModal({ activity, onClose }) {
  if (!activity) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="activity-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <img src={activity.image} alt={activity.title} />

        <div className="modal-content">
          <span>{activity.type}</span>
          <h2>{activity.title}</h2>
          <p className="modal-location">📍 {activity.location}</p>
          <p>{getActivityDescription(activity)}</p>

          <div className="modal-time">
            <strong>Scheduled time</strong>
            <span>{activity.time}</span>
          </div>

          <div className="modal-time">
            <strong>Estimated cost</strong>
            <span>€{getActivityCost(activity)}</span>
          </div>

          <button type="button" className="modal-action" onClick={onClose}>
            Keep in itinerary
          </button>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ trip, disruption, onApplyDisruption, onResetDisruption }) {
  const destinationData = destinations[trip.destination]

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [replanLoading, setReplanLoading] = useState(false)

  const [assistantReply, setAssistantReply] = useState(
    'I have your live trip context. Ask me about your itinerary, budget, priorities, or what happens when plans change.',
  )
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)

  const removedTitles = disruption?.removedTitles || []

  let itinerary = destinationData.activities
  if (removedTitles.length > 0) {
    itinerary = itinerary.filter((activity) => !removedTitles.includes(activity.title))
  }

  const currentDailyCost = itinerary.reduce((sum, activity) => sum + getActivityCost(activity), 0)
  const estimatedTripCost = currentDailyCost * 7
  const budgetValue = Number(trip.budget) || 0
  const remainingBudget = Math.max(budgetValue - estimatedTripCost, 0)
  const budgetPercent = budgetValue > 0 ? Math.min(Math.round((estimatedTripCost / budgetValue) * 100), 100) : 0

  const health = disruption ? 91 : pickerOpen ? 61 : 94

  async function handlePickReason(reason) {
    setReplanLoading(true)
    try {
      const activities = destinationData.activities
      const result = await replanActivities(trip, activities, reason)
      onApplyDisruption({ note: result.note, removedTitles: result.removedTitles || [], reason })
    } catch {
      onApplyDisruption({
        note: "Couldn't reach the planning AI, so nothing was changed — your plan stays as-is.",
        removedTitles: [],
        reason,
      })
    } finally {
      setReplanLoading(false)
      setPickerOpen(false)
    }
  }

  async function askAssistantReal(question) {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return
    setAssistantLoading(true)
    try {
      const result = await askPlanAssistant(trip, itinerary, !!disruption, cleanQuestion)
      setAssistantReply(result.reply)
    } catch {
      setAssistantReply("Couldn't reach the planning AI just now — try again in a moment.")
    } finally {
      setAssistantLoading(false)
    }
  }

  return (
    <main className="dashboard">
      <div className="dashboard-top">
        <div>
          <span className="eyebrow dark">YOUR TRIP</span>
          <h1>{trip.destination}</h1>
          <p>
            {trip.dates} · €{trip.budget} budget
          </p>
        </div>

        <div className="trip-health">
          <div className="health-number">
            <span>TRIP HEALTH</span>
            <strong>{health}</strong>
          </div>

          <div className="health-bar large">
            <div className={pickerOpen && !disruption ? 'warning-health' : ''} style={{ width: `${health}%` }}></div>
          </div>

          <small>
            {disruption ? 'Your trip is back on track' : pickerOpen ? 'Attention needed' : 'Everything looks great'}
          </small>
        </div>
      </div>

      {pickerOpen && !disruption && (
        <div className="disruption-alert">
          <div className="alert-icon">⚡</div>

          <div className="alert-content">
            <span>WHAT CHANGED?</span>
            <h3>Tell TravelMind what happened.</h3>
            <p>The AI will decide what to cut, protecting your high-priority activity.</p>

            <div className="recovery-options">
              <span>PICK A REASON</span>
              {DISRUPTION_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  className="reason-chip-btn"
                  onClick={() => handlePickReason(reason)}
                  disabled={replanLoading}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="adapt-button" onClick={() => setPickerOpen(false)} disabled={replanLoading}>
            {replanLoading ? 'Thinking…' : 'Cancel'}
          </button>
        </div>
      )}

      {disruption && (
        <div className="success-alert">
          <div className="alert-icon">✦</div>

          <div className="alert-content">
            <span>TRIP ADAPTED — {disruption.reason?.toUpperCase()}</span>
            <h3>{disruption.note}</h3>

            <div className="adaptation-pills">
              <span>✓ {trip.priorities.high} protected</span>
              {removedTitles.length > 0 ? (
                removedTitles.map((title) => <span key={title}>× {title} removed</span>)
              ) : (
                <span>↻ No activities needed to change</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="adapt-button"
            onClick={() => {
              onResetDisruption()
              setPickerOpen(true)
            }}
          >
            Try another disruption →
          </button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="itinerary-section">
          <div className="section-title">
            <div>
              <span>YOUR PERSONALISED ITINERARY</span>
              <h2>Your itinerary</h2>
            </div>

            <div className="dashboard-actions">
              <button type="button" className="preference-button" onClick={() => setShowPreferences(!showPreferences)}>
                Preferences
              </button>

              <button type="button" className="chat-dashboard-button" onClick={() => setShowChat(true)}>
                💬 Ask TravelMind
              </button>

              {!disruption && !pickerOpen && (
                <button type="button" className="simulate-button" onClick={() => setPickerOpen(true)}>
                  Simulate Disruption
                </button>
              )}
            </div>
          </div>

          {showPreferences && (
            <div className="preference-summary">
              <div>
                <span>HIGH PRIORITY</span>
                <strong>{trip.priorities.high}</strong>
              </div>

              <div>
                <span>LOW PRIORITY</span>
                <strong>{trip.priorities.low}</strong>
              </div>

              <div>
                <span>CAN BE SACRIFICED</span>
                <strong>{trip.priorities.sacrifice}</strong>
              </div>
            </div>
          )}

          <div className="timeline">
            {itinerary.map((activity) => (
              <ItineraryCard
                key={activity.title}
                activity={activity}
                isProtected={activity.title === trip.priorities.high}
                onMore={setSelectedActivity}
              />
            ))}
          </div>

          {disruption && removedTitles.length > 0 && (
            <div className="adaptation-note">
              <strong>Why did TravelMind change this?</strong>
              <p>{disruption.note}</p>
            </div>
          )}
        </div>

        <aside className="side-panel">
          <div className="side-card budget-card">
            <span className="card-label">BUDGET HEALTH</span>

            <div className="budget-topline">
              <strong>€{remainingBudget}</strong>
              <span>remaining</span>
            </div>

            <div className="budget-bar">
              <div style={{ width: `${budgetPercent}%` }}></div>
            </div>

            <div className="budget-details">
              <span>Estimated · €{estimatedTripCost}</span>
              <span>Budget · €{budgetValue}</span>
            </div>

            <small>Based on current itinerary estimates across 7 days.</small>
          </div>

          <div className="side-card">
            <span className="card-label">TODAY'S WEATHER</span>

            <div className="big-weather">
              <span>☀️</span>
              <strong>{destinationData.weather}</strong>
            </div>

            <p>
              {trip.destination.split(',')[0]} · {destinationData.weatherText}
            </p>
          </div>

          <div className="side-card">
            <span className="card-label">YOUR PREFERENCES</span>

            <div className="tag-container">
              {trip.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
          </div>

          <div className="side-card">
            <span className="card-label">TRIP PRIORITIES</span>

            <div className="dashboard-priorities">
              <div>
                <span>★</span>
                <p>
                  <small>Must keep</small>
                  {trip.priorities.high}
                </p>
              </div>

              <div>
                <span>↗</span>
                <p>
                  <small>Flexible</small>
                  {trip.priorities.low}
                </p>
              </div>

              <div>
                <span>×</span>
                <p>
                  <small>Sacrifice first</small>
                  {trip.priorities.sacrifice}
                </p>
              </div>
            </div>
          </div>

          <div className="ai-card">
            <div className="ai-symbol">✦</div>
            <span>TRAVELMIND AI</span>
            <h3>Always thinking one step ahead.</h3>
            <p>Your priorities remain at the centre of every decision.</p>

            <button type="button" className="ai-chat-button" onClick={() => setShowChat(true)}>
              Open Assistant →
            </button>
          </div>
        </aside>
      </div>

      <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />

      {showChat && (
        <div className="assistant-overlay" onClick={() => setShowChat(false)}>
          <div className="assistant-modal" onClick={(event) => event.stopPropagation()}>
            <div className="assistant-modal-header">
              <div>
                <span>TRAVELMIND ASSISTANT</span>
                <h2>Ask about your trip.</h2>
              </div>

              <button type="button" onClick={() => setShowChat(false)}>
                ×
              </button>
            </div>

            <div className="assistant-context">
              <span>LIVE TRIP CONTEXT</span>
              <p>
                {trip.destination.split(',')[0]} · €{trip.budget} · {trip.interests.join(', ')}
              </p>
            </div>

            <div className="assistant-reply">
              <span>TRAVELMIND</span>
              <p>{assistantReply}</p>
            </div>

            {assistantLoading && <div className="assistant-loading">✦ Thinking…</div>}

            <div className="assistant-suggestions">
              <button type="button" onClick={() => askAssistantReal('Why was this activity chosen?')} disabled={assistantLoading}>
                Why was this activity chosen?
              </button>

              <button type="button" onClick={() => askAssistantReal('What happens if it rains?')} disabled={assistantLoading}>
                What happens if it rains?
              </button>

              <button type="button" onClick={() => askAssistantReal('How can we save money?')} disabled={assistantLoading}>
                How can we save money?
              </button>
            </div>

            <div className="assistant-input">
              <input
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                placeholder="Ask TravelMind about your itinerary..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && assistantInput.trim()) {
                    askAssistantReal(assistantInput)
                    setAssistantInput('')
                  }
                }}
                disabled={assistantLoading}
              />

              <button
                type="button"
                onClick={() => {
                  if (!assistantInput.trim()) return
                  askAssistantReal(assistantInput)
                  setAssistantInput('')
                }}
                disabled={assistantLoading || !assistantInput.trim()}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

const DEFAULT_TRIP = {
  destination: 'Barcelona, Spain',
  dates: '10 — 17 September',
  budget: '1500',
  interests: ['Culture', 'Food', 'Art'],
  priorities: {
    high: 'Sagrada Família',
    low: 'Gothic Quarter',
    sacrifice: 'Barceloneta Beach',
  },
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return fallback
}

function App() {
  const [page, setPage] = useState(() => localStorage.getItem('travelmind_page') || 'home')
  const [trip, setTrip] = useState(() => loadJSON('travelmind_trip', DEFAULT_TRIP))
  const [disruption, setDisruption] = useState(() => loadJSON('travelmind_disruption', null))

  useEffect(() => localStorage.setItem('travelmind_page', page), [page])
  useEffect(() => localStorage.setItem('travelmind_trip', JSON.stringify(trip)), [trip])
  useEffect(() => {
    if (disruption) localStorage.setItem('travelmind_disruption', JSON.stringify(disruption))
    else localStorage.removeItem('travelmind_disruption')
  }, [disruption])

  function startPlanning() {
    setPage('planner')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function generateTrip(newTrip) {
    setTrip(newTrip)
    setDisruption(null)
    setPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Navbar onHome={goHome} onPlan={startPlanning} />

      {page === 'home' && <LandingPage onStart={startPlanning} />}

      {page === 'planner' && <Planner onGenerate={generateTrip} />}

      {page === 'dashboard' && (
        <Dashboard
          trip={trip}
          disruption={disruption}
          onApplyDisruption={setDisruption}
          onResetDisruption={() => setDisruption(null)}
        />
      )}
    </div>
  )
}

export default App
