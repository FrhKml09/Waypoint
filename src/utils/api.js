async function post(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    let message = `Request failed (${response.status})`
    try {
      const data = JSON.parse(text)
      message = data.error || message
    } catch {
      message = text || message
    }
    throw new Error(message)
  }

  const data = await response.json()
  return data.data
}

export function extractFromMessage(message, author, trip) {
  return post('/api/extract', { message, author, trip })
}

export function replanTrip(trip, reason, day) {
  return post('/api/replan', { trip, reason, day })
}

export function askAssistant(situation, question) {
  return post('/api/assistant', { situation, question })
}

export function extractForPlanner(message, author, trip, catalog) {
  return post('/api/plan-extract', { message, author, trip, catalog })
}

export function replanActivities(trip, activities, reason) {
  return post('/api/plan-replan', { trip, activities, reason })
}

export function askPlanAssistant(trip, itinerary, disrupted, question) {
  return post('/api/plan-ask', { trip, itinerary, disrupted, question })
}
