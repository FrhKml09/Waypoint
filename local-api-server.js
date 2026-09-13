import http from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { EXTRACT_PROMPT, buildExtractUserPrompt } from './api/_prompts/extract.js'
import { REPLAN_PROMPT, buildReplanUserPrompt } from './api/_prompts/replan.js'
import { ASSISTANT_PROMPT, buildAssistantUserPrompt } from './api/_prompts/assistant.js'
import { PLAN_EXTRACT_PROMPT, buildPlanExtractUserPrompt } from './api/_prompts/planExtract.js'
import { PLAN_REPLAN_PROMPT, buildPlanReplanUserPrompt } from './api/_prompts/planReplan.js'
import { PLAN_ASK_PROMPT, buildPlanAskUserPrompt } from './api/_prompts/planAsk.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = join(__dirname, '.env.local')
    const content = readFileSync(envPath, 'utf8')
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '')
      }
    }
  } catch {
    // .env.local may not exist
  }
}

loadEnv()

const API_KEY = process.env.OPENAI_API_KEY
const BASE_URL = process.env.OPENAI_BASE_URL
const MODEL = process.env.OPENAI_MODEL

if (!API_KEY || !BASE_URL || !MODEL) {
  console.error('Missing OPENAI_API_KEY, OPENAI_BASE_URL, or OPENAI_MODEL in .env.local')
  process.exit(1)
}

const PORT = 3002

async function callAI(systemPrompt, userPrompt) {
  const url = `${BASE_URL.replace(/\/+$/, '')}/chat/completions`

  const aiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!aiRes.ok) {
    const errorText = await aiRes.text()
    console.error('AI provider error:', errorText)
    throw new Error(`AI provider error: ${aiRes.status}`)
  }

  const data = await aiRes.json()
  const text = data?.choices?.[0]?.message?.content || ''
  return JSON.parse(text)
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(404)
    res.end(JSON.stringify({ success: false, error: 'Not found' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    try {
      const parsedBody = JSON.parse(body)

      if (req.url === '/api/extract') {
        const { message, author, trip } = parsedBody
        if (!message || !trip) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing message or trip' }))
          return
        }
        const result = await callAI(EXTRACT_PROMPT, buildExtractUserPrompt(message, author, trip))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/replan') {
        const { trip, reason, day } = parsedBody
        if (!trip || !reason) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing trip or reason' }))
          return
        }
        const result = await callAI(REPLAN_PROMPT, buildReplanUserPrompt(trip, reason, day))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/assistant') {
        const { situation, question } = parsedBody
        if (!situation || !question) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing situation or question' }))
          return
        }
        const result = await callAI(ASSISTANT_PROMPT, buildAssistantUserPrompt(situation, question))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/plan-extract') {
        const { message, author, trip, catalog } = parsedBody
        if (!message || !trip || !catalog) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing message, trip, or catalog' }))
          return
        }
        const result = await callAI(PLAN_EXTRACT_PROMPT, buildPlanExtractUserPrompt(message, author, trip, catalog))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/plan-replan') {
        const { trip, activities, reason } = parsedBody
        if (!trip || !activities || !reason) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing trip, activities, or reason' }))
          return
        }
        const result = await callAI(PLAN_REPLAN_PROMPT, buildPlanReplanUserPrompt(trip, activities, reason))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/plan-ask') {
        const { trip, itinerary, disrupted, question } = parsedBody
        if (!trip || !itinerary || !question) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing trip, itinerary, or question' }))
          return
        }
        const result = await callAI(PLAN_ASK_PROMPT, buildPlanAskUserPrompt(trip, itinerary, disrupted, question))
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      res.writeHead(404)
      res.end(JSON.stringify({ success: false, error: 'Not found' }))
    } catch (err) {
      console.error('Network error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ success: false, error: 'Network error calling AI provider' }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`Local API server running at http://localhost:${PORT}`)
})
