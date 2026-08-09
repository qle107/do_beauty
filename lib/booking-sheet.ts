import { sheetsConfigured, SheetTable } from '@/lib/sheets'

/**
 * Booking → management-sheet auto-sync. On each successful booking we append a
 * row to the "Rendez-vous" tab (incl. the anti-fraud IP + device) and upsert the
 * client into the "Clients" tab (keyed on phone, matching how the app identifies
 * clients). Fire-and-forget, guarded by sheetsConfigured() — a Sheets hiccup must
 * never fail the booking itself.
 */

interface RdvRow {
  id: string
  date: string
  heure: string
  client: string
  telephone: string
  prestation: string
  duree: number
  prix: number
  statut: string
  source: string
  creeLe: string
  notes: string
  ip: string
  device: string
}

// Column headers MUST match the existing "Rendez-vous" tab, plus IP + Device.
const rdvSheet = new SheetTable<RdvRow>('Rendez-vous', [
  { header: 'ID', key: 'id' },
  { header: 'Date', key: 'date' },
  { header: 'Heure', key: 'heure' },
  { header: 'Client', key: 'client' },
  { header: 'Téléphone', key: 'telephone' },
  { header: 'Prestation', key: 'prestation' },
  { header: 'Durée (min)', key: 'duree', kind: 'number' },
  { header: 'Prix (€)', key: 'prix', kind: 'number' },
  { header: 'Statut', key: 'statut' },
  { header: 'Source', key: 'source' },
  { header: 'Créé le', key: 'creeLe' },
  { header: 'Notes', key: 'notes' },
  { header: 'IP', key: 'ip' },
  { header: 'Device', key: 'device' },
])

interface ClientRow {
  telephone: string
  nom: string
  email: string
  nbVisites: number
  premiereVisite: string
  derniereVisite: string
  totalDepense: number
  consentement: string
  notes: string
}

const clientSheet = new SheetTable<ClientRow>('Clients', [
  { header: 'Téléphone', key: 'telephone' },
  { header: 'Nom', key: 'nom' },
  { header: 'Email', key: 'email' },
  { header: 'Nb visites', key: 'nbVisites', kind: 'number' },
  { header: 'Première visite', key: 'premiereVisite' },
  { header: 'Dernière visite', key: 'derniereVisite' },
  { header: 'Total dépensé (€)', key: 'totalDepense', kind: 'number' },
  { header: 'Consentement RGPD', key: 'consentement' },
  { header: 'Notes / Préférences', key: 'notes' },
])

export interface BookingSyncInput {
  id: string
  date: string
  timeSlot: string
  clientName: string
  clientPhone: string
  serviceNames: string[]
  totalDuration: number
  totalPrice: number
  notes?: string
  clientIp?: string
  deviceId?: string
}

export async function syncBookingToSheet(b: BookingSyncInput): Promise<void> {
  if (!sheetsConfigured()) return
  const now = new Date().toISOString()

  await rdvSheet.append({
    id: b.id,
    date: b.date,
    heure: b.timeSlot,
    client: b.clientName,
    telephone: b.clientPhone,
    prestation: b.serviceNames.join(', '),
    duree: b.totalDuration,
    prix: b.totalPrice,
    statut: 'En attente',
    source: 'Site web',
    creeLe: now,
    notes: b.notes ?? '',
    ip: b.clientIp ?? '',
    device: b.deviceId ?? '',
  })

  // Upsert the client by phone.
  const all = await clientSheet.readAll()
  const idx = all.findIndex((c) => c.telephone === b.clientPhone)
  if (idx === -1) {
    all.push({
      telephone: b.clientPhone,
      nom: b.clientName,
      email: '',
      nbVisites: 1,
      premiereVisite: b.date,
      derniereVisite: b.date,
      totalDepense: b.totalPrice,
      consentement: '',
      notes: '',
    })
  } else {
    const c = all[idx]!
    all[idx] = {
      ...c,
      nom: b.clientName,
      nbVisites: (c.nbVisites || 0) + 1,
      derniereVisite: b.date,
      totalDepense: (c.totalDepense || 0) + b.totalPrice,
    }
  }
  await clientSheet.writeAll(all)
}
