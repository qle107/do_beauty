/**
 * Planity write-back — ISOLATED integration seam.
 * --------------------------------------------------------------------------
 * Planity exposes NO official public API to CREATE/UPDATE/CANCEL an appointment.
 * So a website booking cannot be pushed into Planity automatically today.
 *
 * This module is the SINGLE place where an official Planity booking API would
 * plug in later — WITHOUT touching the booking UI or the Google Calendar flow.
 * Until then `createPlanityBooking()` returns `{ status: 'unsupported' }` and the
 * booking relies on the staff notification (email + WhatsApp) fired by the POST
 * route: the front desk enters it in Planity. That entry then shows up in
 * Planity's public availability, which our read (lib/planity/public-availability)
 * picks up, so the slot is blocked everywhere.
 */

export type PlanityBookingInput = {
  clientName: string
  clientPhone: string
  date: string // "YYYY-MM-DD"
  timeSlot: string // "HH:MM"
  durationMinutes: number
  serviceNames: string[]
  planityServiceIds?: string[] // from Service.planityId, when mapped
  googleEventId?: string
}

export type PlanityBookingResult =
  | { status: 'unsupported'; reason: string }
  | { status: 'created'; reference: string }
  | { status: 'failed'; error: string }

/** Is an official Planity write integration configured? (Off by default.) */
export function planityWriteEnabled(): boolean {
  return process.env.PLANITY_WRITE_ENABLED === '1' && !!process.env.PLANITY_API_TOKEN
}

export async function createPlanityBooking(
  input: PlanityBookingInput,
): Promise<PlanityBookingResult> {
  if (!planityWriteEnabled()) {
    return {
      status: 'unsupported',
      reason:
        "Planity n'expose pas d'API publique de création de rendez-vous. La réservation est enregistrée dans Google Calendar et l'équipe est notifiée pour la reporter dans Planity.",
    }
  }

  // ── Future: official Planity partner/API booking plugs in HERE. ──────────
  // Map `input` to Planity's payload and POST to the OFFICIAL endpoint using
  // PLANITY_API_URL + PLANITY_API_TOKEN, then translate the response to
  // { status: 'created', reference } | { status: 'failed', error }.
  // Do NOT invent endpoints — wire this only when Planity grants official access.
  void input
  return { status: 'failed', error: 'Planity write integration not implemented.' }
}
