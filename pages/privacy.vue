<template>
  <main>
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Politique de Protection</span> des Données Personnelles
        </h1>
        <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
          Comprenez comment PRO GESTION SOFT (PGS) recueille, utilise et protège vos données personnelles.
        </p>

        <p class="mt-2 text-sm text-gray-500">Dernière mise à jour : 1er septembre 2025</p>
        <!-- Fichier PDF -->
        <div class="mt-6">
          <button @click.prevent="handleDownload" download="PGS_RGPD"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
            <IconDownload class="h-5 w-5 mr-2" />
            Télécharger la Politique de Protection (PDF)
          </button>
        </div>
      </header>

      <div class="lg:hidden mb-6">
        <button @click="showMobileToc = !showMobileToc"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          <IconList class="h-5 w-5 mr-2" />
          Table des matières
        </button>
        <div v-if="showMobileToc" class="mt-4 bg-white rounded-lg shadow-md p-4">
          <nav>
            <ul class="space-y-2">
              <li v-for="item in tableOfContents" :key="item.id">
                <a :href="`#${item.id}`" @click="scrollToSection(item.id); showMobileToc = false"
                  :class="['block text-gray-700 hover:text-primary transition-colors', { 'font-bold text-primary': activeSectionId === item.id }]">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
        <aside class="hidden lg:block lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">Table des matières</h2>
            <nav>
              <ul class="space-y-2">
                <li v-for="item in tableOfContents" :key="item.id">
                  <a :href="`#${item.id}`" @click="scrollToSection(item.id)"
                    :class="['block text-gray-700 hover:text-primary transition-colors', { 'font-bold text-primary': activeSectionId === item.id }]">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <section id="privacy-content"
          class="lg:col-span-3 bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16 animate-fade-in-delay">

          <div class="space-y-10">
            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-primary mb-4">
                1. POLITIQUE DE CONFIDENTIALITE
              </h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Si vous utilisez nos services de quelque manière que ce soit, veuillez lire nos conditions de service
                pour
                obtenir des informations détaillées sur vos obligations légales.
              </p>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  1. INTRODUCTION
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. La présente politique de confidentialité fournit des informations sur <span class="text-primary">la
                    manière dont nous recueillons, traitons et partageons les données personnelles</span> (également
                  appelées informations personnelles) des personnes extérieures à notre organisation, y compris, mais
                  sans s’y limiter, les candidats, les utilisateurs, les potentiels utilisateurs, les affiliés, les
                  visiteurs du site web, les prestataires
                  de services et les partenaires ainsi que chacun de leurs représentants respectifs appelés « vous » ou
                  «
                  votre » dans la présente politique.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Pour éviter tout doute, cette politique de confidentialité ne s’applique pas aux données
                  recueillies
                  par nos Utilisateurs qui utilisent nos services pour gérer leur compte. Si vos données sont collectées
                  et
                  traitées par un utilisateur ou son compte, l’utilisateur contrôle vos données. Veuillez communiquer
                  directement avec le propriétaire ou l’exploitant du compte pour obtenir des renseignements sur sa
                  politique de confidentialité et sur la façon dont il traite vos données personnelles.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  3. Après avoir lu cette politique, si vous avez d’autres questions ou si vous désirez obtenir de plus
                  amples renseignements, veuillez communiquer avec nous à <a href="mailto:legal@progestionsoft.com"
                    class="text-primary hover:underline">legal@progestionsoft.com</a>.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  4. Nous nous réservons le droit d’apporter des modifications au présent DPA à tout moment et à notre
                  seule discrétion. Si nous modifions cette politique de confidentialité, nous publierons la version
                  mise
                  à
                  jour via nos Services. Il est de votre responsabilité de revoir périodiquement la présente politique
                  et
                  vous êtes lié par toute modification apportée à celle-ci en utilisant nos services ou en continuant à
                  vous
                  affilier à nous après que ces modifications ont été affichées.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  2. DONNEES PERSONNELLES QUE NOUS RECUEILLONS ET COMMENT NOUS LES UTILISONS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Comme expliqué plus en détail ci-dessous, nous ne recueillons et ne traitons des données à
                  caractère
                  personnel que pour des raisons légitimes, par exemple quand le traitement est nécessaire à l’exécution
                  d’un contrat, comme les conditions de service, et à nos intérêts commerciaux légitimes, comme
                  l’amélioration, la personnalisation, la commercialisation et le développement des services, la
                  promotion
                  de la sûreté et de la sécurité, et le recrutement et l’évaluation des candidats.
                </p>

                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Informations que vous nous fournissez
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>
                    <strong>(a) Données de compte :</strong> Si vous créez un compte PGS par le biais de nos Services ou
                    si
                    vous vous engagez d’une autre manière avec nous, vous fournissez des informations de base de contact
                    et
                    de création de compte telles que votre le n° d’immatriculation Fiscal Unique, la Raison social, le
                    statut Juridique, l’email, le numéro de téléphone, le n° d’immatriculation au RCCM de votre société
                    ou
                    celle représentée ainsi qu’un mot de passe. Dans une certaine mesure, nous pouvons vous demander de
                    fournir les informations du gérant de votre compte.
                  </li>
                  <li>
                    <strong>(b) Donnée de paiement :</strong> Si vous souhaitez effectuer une souscription, vous
                    fournissez
                    les informations de votre carte de crédit, l’identité du propriétaire de cette carte, votre numéro
                    de
                    téléphone, le mail associé à ces informations. Veuillez noter que nous ne conservons pas vos
                    informations de paiement, mais que les tiers chargés du traitement des paiements que nous engageons
                    peuvent conserver vos informations de paiement conformément à leurs propres politiques et conditions
                    de
                    confidentialité.
                  </li>
                  <li>
                    <strong>(c) Commentaires et messages sur le site Web :</strong> Lorsque vous laissez un commentaire,
                    postez un message sur le forum ou contribuez à un article sur notre site Web, vous avez la
                    possibilité
                    de fournir une image de profil (ou Gravatar), un nom d’affichage, un site Web (URL), et tout autre
                    contenu ou information à votre choix. Veuillez noter que toute information que vous affichez sur
                    notre
                    site Web sera accessible au public.
                  </li>
                  <li>
                    <strong>(d) Demandes de renseignements et autres données :</strong> Lorsque vous nous contactez par
                    le
                    biais du bouton « assistance » de la plateforme, du formulaire de contact en ligne, par courriel ou
                    par
                    tout autre moyen de communication, vous nous fournissez généralement votre nom, votre courriel,
                    l’objet
                    de votre demande et toute autre information que vous choisissez de nous fournir à votre gré.
                  </li>
                  <li>
                    <strong>(e) Données relatives au candidat :</strong> Si vous postulez pour un emploi chez nous, vous
                    devez fournir toutes les informations figurant sur votre CV ou sur les documents de candidature,
                    telles
                    que vos coordonnées, votre date de naissance, votre photo, vos études, votre emploi et vos
                    antécédents
                    professionnels, vos qualifications, vos compétences et vos licences professionnelles. Vous pouvez
                    également fournir d’autres données personnelles lors d’un entretien en personne ou par vidéo.
                  </li>
                  <li>
                    <strong>(f) Aucune information sensible :</strong> Veuillez ne pas fournir de données personnelles
                    hautement sensibles lorsque vous utilisez les Services ou communiquez avec nous – telles que les
                    numéros de sécurité sociale, les informations médicales ou de santé, l’origine raciale ou ethnique,
                    les
                    opinions politiques, les croyances religieuses ou philosophiques, l’appartenance syndicale ou les
                    données concernant la vie sexuelle ou l’orientation sexuelle d’une personne. Nous ne traitons pas
                    intentionnellement des données personnelles très sensibles et nous nous réservons le droit de les
                    refuser ou de les supprimer.
                  </li>
                </ul>

                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  3. Comment nous utilisons les données que vous nous fournissez :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>
                    <strong>(a) Fournir, améliorer et maintenir les services :</strong> Nous utilisons les données que
                    vous
                    nous fournissez pour créer votre compte, fournir les Services, recevoir ou effectuer des paiements,
                    et
                    communiquer avec vous au sujet de votre compte et des Services.
                  </li>
                  <li>
                    <strong>(b) Commercialiser les services :</strong> Nous pouvons utiliser vos informations pour
                    commercialiser et promouvoir nos Services. Vous pouvez vous désabonner des communications marketing
                    à
                    tout moment en nous contactant à <a href="mailto:support@progestionsoft.com"
                      class="text-primary hover:underline">support@progestionsoft.com</a> ou en cliquant sur le bouton «
                    Se
                    désabonner » dans la communication applicable.
                  </li>
                  <li>
                    <strong>(c) Vous protéger ainsi que les Services :</strong> Nous utilisons les informations que nous
                    recueillons pour promouvoir la sécurité et la sûreté des Services, de nos utilisateurs et d’autres
                    parties. Par exemple, nous pouvons utiliser vos informations pour authentifier les utilisateurs,
                    faciliter les paiements sécurisés, protéger contre la fraude et les abus, répondre à une demande ou
                    une
                    réclamation légale, effectuer des audits ou appliquer nos Conditions d’utilisation ou d’autres
                    termes
                    et politiques qui peuvent être en vigueur.
                  </li>
                  <li>
                    <strong>(d) Recruter et embaucher :</strong> Nous utilisons les données des candidats décrites
                    ci-dessus pour recruter et évaluer les candidats susceptibles de rejoindre notre équipe.
                  </li>
                </ul>

                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  4. Informations que nous recueillons automatiquement :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>
                    <strong>(a)</strong> Nous pouvons recueillir certaines informations via des cookies et des moyens
                    automatisés similaires quand vous utilisez les Services, dont certaines peuvent être des données
                    personnelles. Les informations collectées par les cookies et autres moyens automatisés concernent
                    généralement vos appareils et vos activités sur vos appareils, comme l’historique des recherches,
                    l’adresse IP, le navigateur utilisé, le système et les réglages d’exploitation, les temps d’accès,
                    les
                    ouvertures, les clics et les téléchargements de nos e-mails, ainsi que l’URL de référence. Si vous
                    utilisez un appareil mobile, nous pouvons également recueillir des données qui identifient votre
                    appareil, vos réglages et votre fréquence d’utilisation. Ces données peuvent être collectées par ou
                    partagées avec nos partenaires tiers d’analyse, de publicité et de lutte contre le spam. Nous
                    obtiendrons votre consentement avant de collecter automatiquement des données.
                  </li>
                  <li>
                    <strong>(b)</strong> Les cookies et les technologies similaires ne recueillent pas vos données
                    personnelles uniques, comme votre nom, votre date de naissance, votre sexe ou votre e-mail.
                  </li>
                  <li>
                    <strong>(c)</strong> PGS et ses fournisseurs de services utilisent les données collectées
                    automatiquement décrites ci-dessus pour fournir, faire de la publicité et améliorer les Services, y
                    compris pour suivre vos préférences et les informations de votre profil, personnaliser les services
                    et
                    le contenu, mesurer l’efficacité des promotions et des communications numériques, effectuer des
                    analyses, placer nos publicités sur d’autres sites web, estimer votre emplacement général et votre
                    fuseau
                    horaire, vous protéger contre les activités malveillantes et le spam, et sécuriser vos comptes.
                  </li>
                </ul>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  5. De temps à autre, nous pouvons recueillir des informations personnelles auprès de tiers, tels que
                  des
                  sites publics, des réseaux sociaux, des partenaires marketing et des bases de données de recrutement.
                  Ces
                  informations peuvent inclure des noms, des coordonnées, des e-mails, des informations professionnelles
                  ou
                  d’emploi, et d’autres informations accessibles au public. Nous pouvons utiliser les informations
                  recueillies auprès de tiers à nos propres fins de promotion ou de marketing, comme l’envoi d’e-mails à
                  des potentiels utilisateurs sur nos Services, ou pour le recrutement et l’évaluation des candidats.
                  Vous
                  pouvez à tout moment vous désabonner des communications relatives au marketing ou au recrutement en
                  nous
                  contactant à l’adresse <a href="mailto:support@progestionsoft.com"
                    class="text-primary hover:underline">support@progestionsoft.com</a> ou en suivant les instructions
                  de
                  « désabonnement » figurant dans la communication concernée.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  3. COMMENT PARTAGEONS-NOUS VOS INFORMATIONS ?
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. À l’exception de ce qui est indiqué ci-dessous, PGS ne vend pas, ne loue pas et ne donne pas en
                  location vos données personnelles à des tiers. Nous ne partageons vos données personnelles qu’avec les
                  types de fournisseurs de services suivants, aux fins énoncées dans la présente politique :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>(i) Fournisseurs de services informatiques pour stocker et sécuriser vos données personnelles</li>
                  <li>(ii) Les processeurs de courrier électronique et de communication afin que nous puissions
                    communiquer
                    avec vous au sujet des Services</li>
                  <li>(iii) Les processeurs de paiement pour percevoir vos frais et traiter vos paiements</li>
                  <li>(iv) Partenaires d’analyse et de mesure pour nous aider à améliorer les Services</li>
                  <li>(v) Partenaires publicitaires pour placer nos annonces sur d’autres sites Web que vous visitez et
                    gérer nos campagnes publicitaires sur le Web</li>
                  <li>(vi) Partenaires commerciaux pour vous envoyer des communications marketing et promotionnelles sur
                    nos
                    services.</li>
                  <li>(vii) Partenaires de recrutement et d’acquisition de talents pour recruter et évaluer les
                    personnes
                    susceptibles de rejoindre notre équipe.</li>
                </ul>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Nous pouvons également partager vos informations conformément à la loi, pour enquêter sur
                  d’éventuelles
                  activités illégales ou violations de nos Conditions d’utilisation ou d’autres accords, pour protéger
                  la
                  sécurité de nos Services et de nos utilisateurs, ou à la suite d’une fusion, acquisition ou cession à
                  un
                  tiers.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. Si vous participez à l’un de nos événements sponsorisés, nous pouvons partager votre nom et votre
                  e-mail avec le sponsor à des fins commerciales et de marketing. Nous pourrons obtenir votre
                  consentement
                  avant de partager vos données avec nos sponsors à leurs propres fins.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  4. CONTROLE DE VOTRE COMPTE ET DE VOS DROITS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Pour soumettre une question ou une préoccupation sur la façon de contrôler, modifier ou supprimer
                  votre
                  compte ou vos données, contactez-nous à <a href="mailto:legal@progestionsoft.com"
                    class="text-primary hover:underline">legal@progestionsoft.com</a>. Les instructions pour annuler
                  votre
                  compte se trouvent ici.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Selon l’endroit où vous vous trouvez, vous pouvez avoir certains droits légaux concernant vos
                  données
                  personnelles, notamment :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>(i) Vous pouvez demander l’accès à vos données personnelles et obtenir des informations sur notre
                    traitement de vos données personnelles, avec qui nous partageons vos données personnelles, et vos
                    droits.</li>
                  <li>(ii) Vous pouvez nous demander de limiter le traitement de vos données personnelles.</li>
                  <li>(iii) Vous pouvez vous opposer au traitement de vos données personnelles.</li>
                  <li>(iv) Lorsque nous traitons des données personnelles sur la base de votre consentement, vous pouvez
                    retirer votre consentement.</li>
                  <li>(v) Vous pouvez corriger des données personnelles inexactes ou incomplètes.</li>
                  <li>(vi) Vous pouvez nous demander de supprimer vos données personnelles ou de vous en fournir une
                    copie.
                  </li>
                </ul>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. Nous ne ferons pas de discrimination à votre encontre pour avoir exercé l’un de vos droits. Nous
                  pouvons demander une preuve de votre identité avant d’agir sur demande. Pour soumettre une question ou
                  une préoccupation au sujet de vos droits, veuillez communiquer avec nous à <a
                    href="mailto:legal@progestionsoft.com"
                    class="text-primary hover:underline">legal@progestionsoft.com</a>.
                  Si vous résidez dans l’espace UEMOA et que vous n’êtes pas satisfait de notre réponse, vous avez le
                  droit
                  de déposer une plainte concernant vos données personnelles auprès d’une autorité de contrôle
                  compétente.
                </p>
              </div>

              <div>


                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  5. COMMENT NOUS PROTEGEONS ET CONSERVONS VOS RENSEIGNEMENTS PERSONNELS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Nous maintenons des mesures de protection administratives, techniques et organisationnelles
                  raisonnables conçues pour vous protéger contre la perte, l’utilisation abusive ou l’accès, la
                  divulgation, la modification ou la destruction non autorisés des données personnelles que nous
                  recueillons
                  de vous. Nous limitons l’accès aux données personnelles recueillies à votre sujet à nos employés, à
                  nos
                  sous-traitants et à certains fournisseurs de services tiers, tel que mentionné ci-dessus. Veuillez
                  noter,
                  toutefois, qu’aucun site ou mécanisme de stockage, y compris les services, ne peut garantir une
                  sécurité
                  à 100%.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. En général, nous conservons vos données personnelles aussi longtemps que nécessaire pour vous
                  fournir
                  les Services, et lorsque vous annulez votre compte, nous prenons des mesures raisonnables pour
                  supprimer
                  vos données personnelles dans un délai raisonnable. Parfois, nous pouvons conserver vos renseignements
                  pendant un certain temps après l’annulation de votre compte pour vous permettre de rétablir
                  efficacement
                  votre compte, si vous le désirez. Nous pouvons également conserver certaines données personnelles
                  après
                  que vous ayez annulé votre compte dans la mesure nécessaire pour nous conformer à nos obligations
                  légales
                  et réglementaires, à des fins de surveillance, de détection et de prévention de la fraude, et pour nos
                  obligations fiscales, comptables et financières. Lorsque nous conservons des données, nous le faisons
                  conformément aux délais de prescription et aux obligations de conservation des dossiers qui nous sont
                  imposées par la loi applicable.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  6. ENFANTS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  Nos services s’adressent aux personnes morales, donc gérée par des adultes de 18 ans et plus. Nous ne
                  collectons pas sciemment de données personnelles auprès d’enfants de moins de 15 ans, ou de tout autre
                  âge
                  minimum plus élevé dans la juridiction où l’enfant réside. Si nous apprenons que nous avons recueilli
                  des
                  informations personnelles auprès d’un enfant n’ayant pas atteint l’âge minimum applicable, nous
                  prendrons
                  des mesures raisonnables pour supprimer ces informations. Les parents ou tuteurs qui croient que leur
                  enfant nous a fourni des renseignements personnels et qui aimeraient les faire supprimer doivent
                  communiquer avec nous à <a href="mailto:legal@progestionsoft.com"
                    class="text-primary hover:underline">legal@progestionsoft.com</a>.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  7. TRANSFERTS INTERNATIONAUX
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Les données personnelles que nous recueillons dans votre pays peuvent être transférées en dehors de
                  votre pays à PGS ou à ses sous-traitants ou fournisseurs de services tiers (mentionnés ci-dessus) pour
                  les
                  raisons décrites dans cette politique de confidentialité, et quand vous nous fournissez vos données
                  personnelles, vous consentez à de tels transferts. Comme prérequis par la loi, nous nous appuyons sur
                  des
                  décisions d’adéquation, des garanties appropriées ou des dérogations quand nous transférons des
                  données
                  personnelles à travers des frontières internationales.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. Si vous résidez dans l’Espace UEMOA, vous pouvez demander des informations sur la manière dont nous
                  protégeons vos données personnelles lorsque nous les transférons au-delà des frontières en nous
                  contactant
                  à <a href="mailto:legal@progestionsoft.com"
                    class="text-primary hover:underline">legal@progestionsoft.com</a>.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  8. LIENS VERS D’AUTRES SITES WEB
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  Nous pouvons fournir des liens vers d’autres sites Web à titre de service à votre intention ou afin de
                  vous fournir d’autres lieux où vous pouvez profiter ou partager les possibilités des Services.
                  Veuillez
                  noter que nous n’avons aucune affiliation avec ces autres parties et que nous ne pouvons pas contrôler
                  et
                  ne sommes pas responsables de leurs pratiques de collecte, d’utilisation et de divulgation des
                  informations. Veuillez examiner et comprendre leurs pratiques et politiques de confidentialité, le cas
                  échéant, avant de leur fournir des données personnelles ou d’utiliser l’un de leurs services. Nous ne
                  sommes pas responsables du contenu ou de l’information de ces sites tiers, des produits ou services
                  qui
                  peuvent être offerts par leur entremise, ou de toute autre utilisation des sites.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  9. CONTACTEZ-NOUS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Si vous avez des questions, des commentaires ou des préoccupations concernant cette politique ou
                  nos
                  pratiques, n’hésitez pas à nous écrire à l’adresse suivante :
                </p>
                <ul class="list-disc pl-5 space-y-1 text-base sm:text-lg leading-relaxed mb-4">
                  <li>PRO GESTION SOFT SARL</li>
                  <li>Attn.: Service des Données et de la Confidentialité</li>
                  <li>Adjarra, Malanhoui, Tanmè (République du Bénin)</li>
                  <li>(229) 52 53 53 80</li>
                  <li><a href="mailto:legal@progestionsoft.com"
                      class="text-primary hover:underline">legal@progestionsoft.com</a></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-primary mb-4 mt-10">
                2. POLITIQUE DE TRAITEMENT DES DONNEES
              </h2>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  1. INTRODUCTION ET PORTEE
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Le présent avenant relatif au traitement des données est un avenant aux Conditions de service.
                  Toutes
                  les dispositions des Conditions s’appliquent et sont intégrées au présent DPA, mais en cas de conflit
                  entre le présent DPA et toute disposition des Conditions, les dispositions du présent DPA prévaudront.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Le présent DPA ne s’applique aux utilisateurs que si et dans la mesure où PGS traite les Données
                  personnelles de l’utilisateur pour ou au nom de l’utilisateur conformément au Contrat et où les Lois
                  sur
                  la protection des données s’appliquent à ces Données personnelles de l’utilisateur.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. Nous nous réservons le droit d’apporter des modifications au présent DPA à tout moment et à notre
                  seule discrétion. Si nous apportons des modifications au présent DPA, nous vous notifierons ces
                  modifications en modifiant la date de mise à jour figurante dans ce DPA et/ou « peut-être » vous le
                  notifier par notification et mail. Si vous continuez à utiliser nos services après modification du
                  DPA,
                  cela signifie que vous acceptez ces modifications. Veuillez évaluer régulièrement le présent DPA et
                  vérifier s’il a été mis à jour.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  2. DEFINITIONS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  Les termes en majuscules qui ne sont pas définis dans le présent DPA ont leur signification donnée
                  ailleurs dans l’accord. En outre, les termes définis ci-après ne s’appliquent qu’à la présente LPD.
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>
                    1. Les termes « responsable du traitement », « sous-traitant », « personne concernée », « traitement
                    »,
                    « données à caractère personnel » et « violation des données à caractère personnel » ont le sens qui
                    leur est attribué dans la législation sur la protection des données.
                  </li>
                  <li>
                    2. « Données personnelles de l’utilisateur » désigne toute donnée personnelle de l’utilisateur
                    soumise
                    aux lois sur la protection des données que l’utilisateur fournit, transfère ou rend accessible à PGS
                    dans le cadre des services.
                  </li>
                  <li>
                    3. Les lois n° 2009-09 du 22 mai 2009 portant protection des données à caractère personnel et n°
                    2017-20
                    du 20 avril 2018 portant code du numérique en République du Bénin, et toute législation
                    d’application
                    similaire ou connexe adoptée par des États membres du Benin ou de l’Espace UEMOA.
                  </li>
                </ul>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  3. ROLES DES PARTIES
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. L’Utilisateur est le responsable du traitement et PGS est le responsable du traitement en ce qui
                  concerne les données personnelles de l’utilisateur. PGS ne traitera les données personnelles
                  d’utilisateur
                  que conformément aux instructions documentées de l’utilisateur, qui comprennent les dispositions du
                  Contrat, à moins qu’il n’en soit autrement requis pour se conformer à toute Loi sur la protection des
                  données. Nous vous informerons si, à notre avis, vos instructions enfreignent les lois sur la
                  protection
                  des données.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. L’utilisateur et PGS se conformeront aux lois sur la protection des données. L’utilisateur doit
                  obtenir toutes les autorisations, consentements, libérations ou permissions nécessaires, et fournir
                  tous
                  les avis de confidentialité requis, concernant ses Données personnelles. Afin d’éviter tout doute,
                  l’utilisateur est seul responsable de l’exactitude, de la qualité et de la légalité de toutes ses
                  Données
                  personnelles et des bases sur lesquelles elles sont collectées auprès de la personne concernée.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  4. NATURE, FINALITE ET DUREE DU TRAITEMENT
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. PGS traitera les Données personnelles de l’utilisateur dans la mesure où cela est nécessaire pour
                  exécuter les Services – ce qui se limite généralement à l’enregistrement d’un compte et au support lié
                  –
                  ou pour protéger ses droits légaux, pendant la durée du Contrat, sauf accord contraire par écrit.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. Le transfert par l’utilisateur de ses données personnelles vers notre plateforme dans le cadre des
                  services est déterminé et contrôlé par l’utilisateur à sa seule discrétion.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. PGS peut traiter les catégories suivantes de Données personnelles de l’utilisateur : toutes Données
                  personnelles collectées, utilisées ou autrement traitées à partir des Données de l’utilisateur externe
                  en
                  rapport avec le compte du l’utilisateur. Il peut traiter les données personnelles des utilisateurs à
                  partir des catégories suivantes de sujets de données : Utilisateurs externes des comptes.
                </p>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  5. TRANSFERTS TRANSFRONTALIERS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  Vous choisissez le(s) centre(s) de données RAID 10 SSD de AA Hébergement où votre compte sera hébergé
                  et
                  vos données seront stockées. Vous reconnaissez, acceptez et comprenez que toutes vos Données
                  personnelles
                  seront automatiquement transférées et stockées dans ce centre de données et les Données personnelles
                  peuvent être transférées de ce centre vers tout autre centre à notre seule discrétion.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  6. SOUS-PROCESSEURS
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. PGS peut engager des sous-traitants tiers qui traiteront les données personnelles des utilisateurs
                  dans
                  le but de fournir les Services. L’utilisateur autorise PGS à engager ces Sous-processeurs dans le but
                  de
                  fournir les Services.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. PGS peut mettre à jour la liste des Sous-traitants de temps à autre, et ces mises à jour seront le
                  seul
                  moyen de fournir une notification des changements de Sous-traitants à l’utilisateur. L’utilisateur est
                  responsable de la vérification et de l’évaluation régulières de la liste des Sous-traitants. Le fait
                  que
                  l’utilisateur ne s’oppose pas par écrit à un nouveau Sous-traitant affiché par PGS sur la liste des
                  Sous-traitants constitue l’autorisation par le l’utilisateur du nouveau Sous-traitant.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  3. Si PGS détermine, à sa seule discrétion, qu’elle ne peut raisonnablement pas donner suite à
                  l’objection
                  opportune de l’utilisateur à l’encontre d’un Sous-processeur, l’utilisateur peut choisir de résilier
                  le
                  Contrat conformément aux dispositions de résiliation des Conditions de service, qui constituent le
                  seul
                  et
                  unique recours d e l’utilisateur.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  4. PGS imposera à ses sous-traitants des obligations identiques ou substantiellement équivalentes à
                  celles énoncées dans la présente LPD par voie de contrat écrit. PGS sera responsable envers
                  l’utilisateur
                  de l’exécution par les Sous-traitants de leurs obligations en matière de protection des données
                  relatives
                  aux Données Personnelles de l’utilisateur.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  7. ÉVALUATIONS DE SECURITE ET D’IMPACT
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. PGS s’assurera que son personnel est soumis à des obligations de confidentialité contraignantes en
                  ce
                  qui concerne les données personnelles des utilisateurs.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. En tenant compte de l’état de la technique, des coûts de mise en œuvre et de la nature, de la
                  portée,
                  du contexte et des finalités du traitement, ainsi que du risque de probabilité et de gravité variables
                  pour les droits et libertés des personnes concernées, PGS mettra en œuvre les mesures techniques et
                  organisationnelles appropriées pour assurer un niveau de sécurité adapté au risque.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. Compte tenu de la nature du Traitement et des informations dont dispose PGS, nous aiderons
                  l’utilisateur
                  à s’assurer du respect des obligations d’utilisateur en vertu des Lois sur la protection des données
                  en
                  ce
                  qui concerne la sécurité, les évaluations d’impact et les consultations avec les autorités de contrôle
                  ou
                  de régulation.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  8. ATTEINTE A LA PROTECTION DES DONNEES PERSONNELLES
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Compte tenu de la nature du Traitement et des informations dont dispose PGS, nous aiderons
                  l’utilisateur
                  à s’assurer du respect des obligations d’utilisateur en vertu des Lois sur la protection des données
                  en
                  ce
                  qui concerne une violation des données personnelles.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  2. En cas de découverte d’une violation des données personnelles, PGS informera rapidement les
                  contacts
                  techniques et de compte en utilisant les moyens établis pour les communications de routine liées au
                  compte.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  3. Notre avis doit comprendre les renseignements suivants dans la mesure où ils sont raisonnablement
                  accessibles à PGS au moment de l’avis, et PGS doit mettre à jour son avis à mesure que des
                  renseignements
                  supplémentaires deviennent raisonnablement accessibles :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>(a) les dates et les heures de l’atteinte à la protection des données personnelles ;</li>
                  <li>(b) les faits fondamentaux qui sous-tendent la découverte de l’atteinte à la protection des
                    données
                    personnelles ou la décision d’entreprendre une enquête sur une atteinte présumée à la protection des
                    données personnelles, selon le cas ;</li>
                  <li>(c) une description des données personnelles de l’utilisateur impliquées dans cette atteinte, soit
                    spécifiquement, soit par référence aux données ;</li>
                  <li>(d) et les mesures prévues ou en cours pour corriger ou atténuer cette vulnérabilité qui donne
                    naissance à cette atteinte aux données personnelles.</li>
                </ul>
              </div>

              <div>


                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  9. DEMANDES DES PERSONNES CONCERNEES
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Compte tenu de la nature du Traitement, PGS assistera l’utilisateur par des mesures techniques et
                  organisationnelles appropriées, dans la mesure du possible, pour l’accomplissement de l’obligation de
                  l’utilisateur de répondre aux demandes d’exercice des droits de la Personne concernée en vertu des
                  lois
                  sur la protection des données.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. PGS informera promptement l’utilisateur si nous recevons une demande d’une Personne Personnelle de
                  Données d’invoquer ses droits à l’égard des Données Personnelles d’utilisateur, sauf interdiction
                  contraire par la loi applicable ; et, sauf dans la mesure requise par la loi applicable, nous ne
                  prendrons
                  aucune action indépendante en réponse à une demande d’une Personne Personnelle sans instruction écrite
                  préalable de l’utilisateur.
                </p>
              </div>

              <div>

                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  10. VERIFICATION ET INSPECTION
                </h3>
                <p class="text-base sm:text-lg leading-relaxed mb-2">
                  1. Sous réserve d’une entente écrite de non-divulgation, PGS fournira à l’utilisateur les
                  renseignements
                  raisonnablement nécessaires pour démontrer le respect des obligations énoncées dans la présente LPD.
                </p>
                <p class="text-base sm:text-lg leading-relaxed mb-4">
                  2. Toute vérification sur place doit :
                </p>
                <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed mb-4">
                  <li>(i) être assujettie à un préavis écrit d’au moins soixante (60) jours à PGS ;</li>
                  <li>(ii) être assujettie à une entente écrite de non-divulgation et à un plan de vérification écrit
                    détaillé examiné et pré-approuvé par PGS ;</li>
                  <li>(iii) être aux frais et dépens uniques de l’utilisateur ;</li>
                  <li>(iv) être limité dans sa portée et son but d’évaluer un manquement présumé de PGS aux dispositions
                    de
                    la présente LPD et seulement après que l’utilisateur a épuisé tous les autres moyens raisonnables
                    déterminés par PGS ;</li>
                  <li>(v) être en présence d’un représentant de PGS a sans perturber de façon déraisonnable les
                    activités
                    commerciales de PGS.</li>
                </ul>
              </div>

              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  11. SUPPRESSION OU RETOUR DES DONNEES PERSONNELLES DE L’UTILISATEUR
                </h3>
                <p class="text-base sm:text-lg leading-relaxed">
                  1. En cas de résiliation en bonne et due forme du Contrat et sur instruction écrite de l’utilisateur,
                  PGS
                  prendra des mesures raisonnables pour supprimer les Données personnelles de l’utilisateur ou retourner
                  peut-être à l’utilisateur ses Données personnelles et leurs copies, sous réserve des lois applicables
                  exigeant que PGS continue à stocker les Données personnelles de l’utilisateur.
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconList, IconDownload } from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles'
import { useToc } from '~/composables/useToc';
import { downloadFile, scrollToSection } from '~/utils/legalFn';

const sharedFiles = useSharedFiles()
const { tableOfContents, activeSectionId } = useToc('privacy-content');
const showMobileToc = ref(false);

const handleDownload = () => {
  const url = sharedFiles.paths.pdf.legal;
  const fileName = 'PGS_RGPD.pdf';
  downloadFile(url, fileName);
};

// SEO
useHead({
  title: 'Politique de Confidentialité',
  meta: [
    { name: 'description', content: 'Découvrez la politique de confidentialité de PRO GESTION SOFT (PGS) concernant la collecte, le traitement et le partage des données personnelles.' }
  ]
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.4s;
}

h2[id], h3[id] {
  scroll-margin-top: 100px;
}
</style>
