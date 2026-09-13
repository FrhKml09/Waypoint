import { PLAN_REPLAN_PROMPT, buildPlanReplanUserPrompt } from './_prompts/planReplan.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { trip, activities, reason } = req.body || {}

  if (!trip || !activities || !reason) {
    return res.status(400).json({ success: false, error: 'Missing trip, activities, or reason' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const baseURL = process.env.OPENAI_BASE_URL
  const model = process.env.OPENAI_MODEL

  if (!apiKey || !baseURL || !model) {
    return res.status(500).json({ success: false, error: 'Server misconfigured: missing API configuration' })
  }

  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`

  try {
    const aiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: PLAN_REPLAN_PROMPT },
          { role: 'user', content: buildPlanReplanUserPrompt(trip, activities, reason) },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (!aiRes.ok) {
      const errorText = await aiRes.text()
      console.error('AI provider error:', errorText)
      return res.status(500).json({ success: false, error: `AI provider error: ${aiRes.status}` })
    }

    const data = await aiRes.json()
    const text = data?.choices?.[0]?.message?.content || ''

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      console.error('Invalid AI response:', text)
      return res.status(500).json({ success: false, error: 'Invalid response from AI' })
    }

    return res.status(200).json({ success: true, data: parsed })
  } catch (err) {
    console.error('Network error:', err)
    return res.status(500).json({ success: false, error: 'Network error calling AI provider' })
  }
}
