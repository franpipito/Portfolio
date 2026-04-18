function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function pickSubmissionData(eventPayload = {}) {
  const payload = eventPayload?.payload || {}
  const data = payload?.data || payload

  return {
    formName: payload?.form_name || payload?.formName || data?.["form-name"] || "contact",
    name: data?.name || "Sin nombre",
    email: data?.email || "",
    message: data?.message || "",
    siteName: eventPayload?.site?.name || "Portfolio",
    siteUrl: eventPayload?.site?.ssl_url || eventPayload?.site?.url || "",
  }
}

function buildHtmlTemplate({ name, email, message, formName, siteName, siteUrl }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>")
  const safeFormName = escapeHtml(formName)
  const safeSiteName = escapeHtml(siteName)
  const safeSiteUrl = escapeHtml(siteUrl)
  const submittedAt = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })

  return `
  <div style="margin:0;padding:24px;background:#0b1020;font-family:Segoe UI,Arial,sans-serif;color:#dbe7ff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#11182b;border:1px solid #25304d;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background:linear-gradient(90deg,#0ea5e9,#2563eb);color:#fff;">
          <h1 style="margin:0;font-size:20px;line-height:1.2;">Nuevo contacto desde tu portfolio</h1>
          <p style="margin:8px 0 0;font-size:13px;opacity:.95;">Formulario: ${safeFormName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:22px 24px;">
          <p style="margin:0 0 12px;font-size:14px;"><strong>Nombre:</strong> ${safeName}</p>
          <p style="margin:0 0 12px;font-size:14px;"><strong>Email:</strong> ${safeEmail || "No informado"}</p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Mensaje:</strong></p>
          <div style="margin:0 0 16px;padding:14px;border:1px solid #2b3a5c;border-radius:10px;background:#0f1527;font-size:14px;line-height:1.6;color:#e6eeff;">
            ${safeMessage || "Sin contenido"}
          </div>
          <p style="margin:0 0 8px;font-size:12px;color:#9fb0d9;">Sitio: ${safeSiteName}</p>
          <p style="margin:0 0 8px;font-size:12px;color:#9fb0d9;">URL: ${safeSiteUrl || "No disponible"}</p>
          <p style="margin:0;font-size:12px;color:#9fb0d9;">Fecha: ${escapeHtml(submittedAt)}</p>
        </td>
      </tr>
    </table>
  </div>`
}

async function sendEmailWithResend({ to, from, replyTo, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY")
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      reply_to: replyTo || undefined,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend API error (${response.status}): ${body}`)
  }

  return response.json()
}

function parseEventPayload(event = {}) {
  if (event?.body) {
    try {
      return JSON.parse(event.body)
    } catch {
      return {}
    }
  }

  if (event?.payload || event?.site) {
    return event
  }

  return {}
}

exports.handler = async (event) => {
  try {
    const eventPayload = parseEventPayload(event)
    const submission = pickSubmissionData(eventPayload)

    if (submission.formName !== "contact") {
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: true, reason: "non-contact-form" }),
      }
    }

    const to = process.env.CONTACT_TO_EMAIL || "franpipito7@gmail.com"
    const from = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>"
    const subject = `Nuevo contacto: ${submission.name}`
    const html = buildHtmlTemplate(submission)

    await sendEmailWithResend({
      to,
      from,
      replyTo: submission.email,
      subject,
      html,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    }
  } catch (error) {
    console.error("submission-created error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: String(error?.message || error) }),
    }
  }
}
