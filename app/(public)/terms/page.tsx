import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions légales · Do Beauty',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  const { legal } = site
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Éditeur du site</h2>
        <p>
          {legal.editorName} - {legal.legalForm}, {legal.entrepreneur}
          <br />
          {site.address.street}, {site.address.city}
          <br />
          Téléphone : {site.phone.display} - Email : {site.email}
          <br />
          SIREN : {legal.siren} - SIRET : {legal.siret}
          <br />
          {legal.registration}
          <br />
          Activité (APE) : {legal.ape}
          <br />
          {legal.vat}
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Directeur de la publication</h2>
        <p>{legal.publicationDirector}</p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Hébergement</h2>
        <p>
          Ce site est hébergé par {legal.host.name}.
          <br />
          {legal.host.address}
          <br />
          Téléphone : {legal.host.phone}
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus (textes, images, logo) est la propriété de {site.name}.
          Toute reproduction sans autorisation est interdite.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Responsabilité</h2>
        <p>
          Les informations et tarifs affichés sont donnés à titre indicatif. {site.name} s&apos;efforce
          de maintenir le site à jour mais ne peut garantir l&apos;absence d&apos;erreurs.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Données personnelles</h2>
        <p>
          Le traitement de vos données personnelles est détaillé dans notre{' '}
          <a href="/privacy" className="text-coral underline hover:text-coral-light">
            politique de confidentialité
          </a>
          .
        </p>
      </section>
    </LegalPage>
  )
}
