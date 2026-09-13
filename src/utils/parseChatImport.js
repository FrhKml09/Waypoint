// Parses pasted chat exports from WhatsApp or Telegram into {author, text} messages.
// WhatsApp: "12/09/2026, 14:32 - Alex: message" or "[12/09/2026, 2:32:11 PM] Alex: message"
// Telegram (desktop copy/export): "Alex, [12.09.2026 14:32]" on its own line, followed by the message text.

const WHATSAPP_LINE = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM|am|pm)?)\]?\s*-?\s*([^:]{1,40}):\s(.*)$/
const TELEGRAM_HEADER = /^(.{1,40}?),?\s*\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}[,]?\s+\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM|am|pm)?)\]\s*$/

export function parseChatExport(raw) {
  const lines = raw.split('\n').map((l) => l.replace(/\r$/, ''))
  const messages = []
  let pendingAuthor = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const waMatch = trimmed.match(WHATSAPP_LINE)
    if (waMatch) {
      const [, , , author, text] = waMatch
      if (/media omitted|missed voice call|missed video call/i.test(text)) continue
      messages.push({ author: author.trim(), text: text.trim() })
      pendingAuthor = null
      continue
    }

    const tgMatch = trimmed.match(TELEGRAM_HEADER)
    if (tgMatch) {
      pendingAuthor = tgMatch[1].trim()
      continue
    }

    if (pendingAuthor) {
      messages.push({ author: pendingAuthor, text: trimmed })
      pendingAuthor = null
      continue
    }

    if (messages.length > 0) {
      messages[messages.length - 1].text += ` ${trimmed}`
    } else {
      messages.push({ author: 'Imported', text: trimmed })
    }
  }

  return messages.filter((m) => m.text && m.text.length > 0)
}
