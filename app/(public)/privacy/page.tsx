import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Politique de confidentialité · Do Beauty',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Responsable du traitement</h2>
        <p>
          Le responsable du traitement de vos données est {site.legal.editorName} ({site.legal.legalForm},
          {' '}{site.legal.entrepreneur}), {site.address.street}, {site.address.city}. Pour toute
          question relative à vos données, écrivez-nous à {site.email} ou appelez le {site.phone.display}.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Données collectées</h2>
        <p>
          Lors d&apos;une réservation en ligne, nous collectons votre nom, numéro de téléphone et,
          le cas échéant, des remarques liées à votre rendez-vous. Vous pouvez également joindre,
          de façon facultative, une ou plusieurs photos d&apos;inspiration pour illustrer le modèle
          souhaité. Le formulaire de contact collecte votre nom, email, objet et message, ainsi que
          votre adresse IP à des fins de sécurité (lutte anti-spam).
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Finalité et base légale</h2>
        <p>
          Ces données servent uniquement à gérer vos rendez-vous, vous contacter en cas de besoin
          et répondre à vos demandes. Elles ne sont ni revendues ni cédées à des tiers à des fins
          commerciales.
        </p>
        <ul className="mt-3 list-disc pl-5 space-y-1">
          <li>
            <strong>Réservations et messages</strong> : exécution de votre demande (mesures
            précontractuelles / intérêt légitime à répondre).
          </li>
          <li>
            <strong>Adresse IP et identifiant d&apos;appareil</strong> : intérêt légitime à prévenir
            les abus, le spam et les absences répétées.
          </li>
          <li>
            <strong>Empreinte technique du navigateur</strong> : votre consentement, recueilli via le
            bandeau cookies et révocable à tout moment (elle n&apos;est calculée qu&apos;après votre
            acceptation).
          </li>
          <li>
            <strong>Mesure d&apos;audience (Google Tag Manager / Analytics)</strong> : votre
            consentement, recueilli via le bandeau cookies et révocable à tout moment.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Durées de conservation</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Rendez-vous et coordonnées clients : conservés pendant la durée de la relation, puis
            archivés au maximum 3 ans après le dernier contact.
          </li>
          <li>
            Messages de contact et adresse IP associée : jusqu&apos;à 1 an après traitement de la
            demande.
          </li>
          <li>
            Photos d&apos;inspiration : transmises par email à notre équipe et conservées
            temporairement sur nos serveurs, où elles sont supprimées automatiquement au plus tard
            30 jours après leur envoi.
          </li>
          <li>
            Données anti-abus (identifiant d&apos;appareil, empreinte, historique d&apos;absences) :
            au maximum 1 an après la dernière activité.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Destinataires et sous-traitants</h2>
        <p>
          Nous faisons appel aux sous-traitants suivants, encadrés par des engagements de
          confidentialité :
        </p>
        <ul className="mt-3 list-disc pl-5 space-y-1">
          <li>
            <strong>Google (Agenda &amp; Gmail)</strong> : gestion des rendez-vous et des emails.
          </li>
          <li>
            <strong>Cloudflare (Turnstile)</strong> : vérification anti-robot des formulaires
            (traite l&apos;adresse IP).
          </li>
          <li>
            <strong>{site.legal.host.name}</strong> : hébergement du site.
          </li>
        </ul>
        <p className="mt-3">
          Aucune donnée client identifiante n&apos;est transmise au service de notification WhatsApp.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Transfert de données hors UE</h2>
        <p>
          Certains de nos sous-traitants sont des sociétés américaines : Google (Agenda, Gmail et,
          si vous les acceptez, les statistiques Google Analytics) et Cloudflare (Turnstile). Les
          transferts de données vers les États-Unis qui en découlent sont encadrés par le
          « Data Privacy Framework », décision d&apos;adéquation de la Commission européenne à
          laquelle ces sociétés adhèrent. Les cookies de mesure d&apos;audience, eux, ne déclenchent
          aucun transfert tant que vous ne les avez pas acceptés ; vous pouvez les refuser à tout
          moment via le bandeau « Gérer les cookies ».
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation, d&apos;opposition et de portabilité de vos données. Vous
          pouvez exercer ces droits en nous écrivant à {site.email} ou en appelant le{' '}
          {site.phone.display}. Vous pouvez également retirer à tout moment votre consentement aux
          cookies de mesure d&apos;audience via le lien « Gérer les cookies » en bas de page.
        </p>
        <p className="mt-3">
          Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous
          pouvez introduire une réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-coral underline hover:text-coral-light"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl text-dark mb-2">Cookies et identifiant d&apos;appareil</h2>
        <p>
          Ce site utilise des cookies techniques nécessaires au fonctionnement (session admin,
          sécurité anti-spam), qui ne requièrent pas de consentement. Les cookies de mesure
          d&apos;audience ne sont déposés qu&apos;après votre acceptation via le bandeau cookies ;
          aucun cookie publicitaire n&apos;est déposé. Un identifiant technique est également
          conservé dans votre navigateur afin de prévenir les abus et les absences répétées lors des
          réservations en ligne. Il ne permet pas de vous identifier personnellement, n&apos;est
          utilisé qu&apos;à cette fin, et peut être supprimé à tout moment en effaçant les données de
          navigation de votre appareil.
        </p>
        <p className="mt-3">
          Sous réserve de votre consentement, et lorsque cet identifiant n&apos;est pas disponible
          (par exemple après effacement des données de navigation), nous pouvons calculer une
          « empreinte » technique à partir de la configuration de votre navigateur et de votre
          appareil (type et version du navigateur, langue, résolution d&apos;écran, rendu graphique,
          fuseau horaire). Cette empreinte sert exclusivement à détecter les abus et les absences
          répétées lors des réservations en ligne : elle ne permet pas de vous identifier
          personnellement et n&apos;est jamais utilisée à des fins publicitaires. Vous pouvez
          demander la suppression des données associées en nous écrivant à {site.email} ou en
          appelant le {site.phone.display}.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-charcoal-500 border-b border-dark/10">
                <th className="py-2 pr-4 font-sans font-medium">Traceur</th>
                <th className="py-2 pr-4 font-sans font-medium">Finalité</th>
                <th className="py-2 font-sans font-medium">Durée</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-dark/5">
                <td className="py-2 pr-4">dobeauty_consent</td>
                <td className="py-2 pr-4">Mémoriser votre choix sur les cookies (nécessaire)</td>
                <td className="py-2">6 mois</td>
              </tr>
              <tr className="border-b border-dark/5">
                <td className="py-2 pr-4">dobeauty_device_id</td>
                <td className="py-2 pr-4">Prévenir les abus de réservation (nécessaire)</td>
                <td className="py-2">Jusqu&apos;à effacement</td>
              </tr>
              <tr className="border-b border-dark/5">
                <td className="py-2 pr-4">Cloudflare Turnstile</td>
                <td className="py-2 pr-4">Vérification anti-robot des formulaires (nécessaire)</td>
                <td className="py-2">Session</td>
              </tr>
              <tr className="border-b border-dark/5">
                <td className="py-2 pr-4">Session administrateur</td>
                <td className="py-2 pr-4">Connexion à l&apos;espace de gestion (nécessaire)</td>
                <td className="py-2">Session</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Google Analytics (_ga)</td>
                <td className="py-2 pr-4">Mesure d&apos;audience - déposé uniquement avec votre consentement</td>
                <td className="py-2">Jusqu&apos;à 13 mois</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </LegalPage>
  )
}
