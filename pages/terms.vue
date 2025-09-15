<template>
  <main>
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Conditions</span> Générales d'Utilisation
        </h1>
        <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
          En utilisant les Services de PRO GESTION SOFT (PGS), vous acceptez les présentes Conditions d’utilisation.
        </p>

        <p class="mt-2 text-sm text-gray-500">Dernière mise à jour : 1er septembre 2025</p>
        <!-- Fichier PDF -->
        <div class="mt-6">
          <button @click.prevent="downloadPdf" download="PGS_Mentions_Legales.pdf"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
            <IconDownload class="h-5 w-5 mr-2" />
            Télécharger les CGU (PDF)
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

        <section id="terms-content"
          class="lg:col-span-3 bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16 animate-fade-in-delay">

          <div class="space-y-10">
            <p class="text-base sm:text-lg leading-relaxed mb-4">
              En utilisant les Services de PRO GESTION SOFT (PGS), vous acceptez les présentes Conditions d’utilisation.
              Si vous n’acceptez pas ces conditions, ne vous inscrivez pas et ne vous abonnez pas, n’accédez pas et
              n’utilisez pas les Services PGS.
            </p>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">0. DEFINITION DES THEMES</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Dans les Conditions et Règles d’Utilisation, les mots ou expressions définies à la présente section
                auront la signification suivante, que ces derniers soient utilisés au singulier ou au pluriel :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li><strong>Activité malveillante :</strong> et pouvant affecter la plateforme, ses services et/ou tout
                  utilisateur de la plateforme et qui violent les règles et lois en vigueur.</li>
                <li><strong>Compte :</strong> Il s’agit de l’espace privé qui est attribué à tout utilisateur qui
                  s’enregistre dans le but d’utiliser nos outils pour gérer une affaire.</li>
                <li><strong>Conditions :</strong> C’est l’ensemble des règles à observer pour une meilleure utilisation
                  de la plateforme et ne pas entrer en violation à celle-ci.</li>
                <li><strong>Contenu :</strong> Il s’agit des textes, des données, des informations, des photos, des
                  images, des fichiers multimédias, des logos ou tout autre contenu que publie, importe, téléverse,
                  stocke, affiche ou transmet un utilisateur. Ces informations restent internes et privées et ne sont
                  partagés qu’avec des co-utilisateurs.</li>
                <li><strong>Contenu exporté :</strong> C’est un contenu tel qu’une offre de candidature, et partagé avec
                  des utilisateurs externes.</li>
                <li><strong>Co-utilisateur :</strong> C’est un coadministrateur qu’ajoute un utilisateur dans le cadre
                  de gérer avec l’utilisateur son compte.</li>
                <li><strong>DPA :</strong> Abréviation de « Data Processing Addendum », thème anglais désignant Addenda
                  de Traitement des Données.</li>
                <li><strong>LPD :</strong> Abréviation de « La Protections des Données ».</li>
                <li><strong>Obligations :</strong> Il s’agit des engagements auxquels est tenu tout utilisateur.</li>
                <li><strong>Plateforme :</strong> Il désigne le compte, l’espace et les services auxquels accèdent un
                  utilisateur.</li>
                <li><strong>Service :</strong> Il désigne l’ensemble des services de gestion avancée, du support, des
                  outils, de l’application web, du logiciel de bureau et du site web mis à dispositions des utilisateurs
                  dans le cadre gérer leur compte y compris le forum.</li>
                <li><strong>Services de tiers :</strong> Il s’agit des services qui peuvent afficher, permettre l’accès
                  ou l’utilisation, installer ou incorporer des contenus, des promotions, des sites web, des
                  applications, des logiciels, des services et des ressources de tiers qui ne sont pas sous notre
                  contrôle.</li>
                <li><strong>Soumission :</strong> Elle désigne des questions, des commentaires, suggestions et idées sur
                  les Services et sont non confidentielles à moins que nous n’indiquions le contraire.</li>
                <li><strong>Souscription :</strong> Il désigne des formules d’abonnement proposées par PGS à
                  l’Utilisateur donnant accès, selon les conditions spécifiées dans l’offre d’Abonnement, à certains
                  Services à des tarifs préférentiels</li>
                <li><strong>Sous-processeur :</strong> Machine de traitement des données d’un sous-traitant.</li>
                <li><strong>Tarif :</strong> C’est le prix que coût un service non gratuit et exprimé généralement en
                  francs CFA</li>
                <li><strong>Utilisateur :</strong> Il s’agit d’une personne ou organisation qui accède ou utilise les
                  Services.</li>
                <li><strong>Utilisateur externe :</strong> C’est une personne tierce tel qu’un candidat, un abonné, etc.
                  qui accèdent aux données publiques fournies par un compte.</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">1. INTRODUCTION</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. PRO GESTION SOFT SARL (ci-après, « PRO GESTION SOFT », « PGS », « nous » ou « notre ») fournit des
                services de gestion avancée et un support via notre application web, notre logiciel de bureau et notre
                site web.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Les personnes ou organisations qui accèdent ou utilisent les services sont désignées dans le présent
                contrat par les termes « utilisateur », « vous » ou « votre ».
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Les présentes conditions de service, ainsi que notre l’addenda de traitement des données (DPA)
                constituent un accord juridique contraignant entre PRO GESTION SOFT et Vous.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. Vous déclarez, garantissez et acceptez que vous avez le plein pouvoir et l’autorité pour saisir et
                exécuter le Contrat et former un contrat contraignant en votre nom ou au nom de la personne, de
                l’organisation, de l’entité ou du groupe que vous représentez.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                5. Nous nous réservons le droit d’apporter des modifications à ces Conditions à tout moment et à notre
                seule discrétion. Si nous apportons des modifications aux présentes conditions, nous vous en aviserons
                en révisant la date de mise à jour et/ou « peut-être » vous le notifier par notification ou mail. Votre
                utilisation continue de nos Services après modification des changements constituera votre acceptation de
                ces changements. Veuillez consulter périodiquement ces conditions et vérifier s’il y a des mises à jour.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">2. COMPTE ET ELIGIBILITE</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Afin d’accéder aux Services (et le cas échéant souscrire, lorsqu’ils sont payants), il vous sera
                nécessaire d’enregistrer un compte auprès de PRO GESTION SOFT. L’utilisateur qui crée initialement un
                Compte peut accorder différents niveaux d’accès et de permission à des co-utilisateurs. Tous les
                co-utilisateurs, quel que soit le niveau d’accès ou de permission qui leur sont accordé, acceptent
                d’être liés par les présentes Conditions.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Vous acceptez que l’adresse e-mail ainsi que le numéro de téléphone que vous fournissez quand vous
                créez votre compte soit utilisée à des fins de notification officielle liée à ce compte et aux services.
                Vous acceptez de vérifier que les e-mails envoyés atteignent bien la boîte de réception associée à votre
                adresse e-mail et de mettre à jour ces coordonnées quand cela est nécessaire. Vous acceptez que si vous
                ne lisez pas les e-mails que nous vous envoyons, si vous ne vous connectez pas régulièrement à votre
                compte pour lire les notifications affichées et si vous ne prenez pas les mesures correspondantes, la
                performance des Services peut être affectée négativement.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Vous devez obligatoirement disposez ou représentez une structure enregistrée légalement en République
                du Bénin ou dans l’un des pays dans lequel l’outil est disponible.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. Un compte est actif sur un et un seul terminal à la fois. C’est-à-dire que si vous essayez de vous
                connecter à un autre ordinateur pendant que votre compte est actif sur un autre, il sera déconnecté
                automatiquement de l’ancien ordinateur pour permettre au nouveau de le garder actif.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                5. En utilisant les Services ou en créant un Compte, vous acceptez de :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(a) fournir des informations exactes, véridiques, actuelles et complète ;</li>
                <li>(b) maintenir et mettre à jour rapidement les informations de votre Compte en cas de changement ;
                </li>
                <li>(c) maintenir la sécurité de votre Compte en protégeant votre mot de passe et en limitant l’accès à
                  votre Compte et à votre plan de Service ;</li>
                <li>(d) notifier rapidement PGS si vous découvrez ou suspectez toute violation de la sécurité ou tout
                  accès non autorisé lié à votre compte ou aux services ;</li>
                <li>(e) assumer la responsabilité de toutes les activités qui se produisent sous votre compte et
                  accepter tous les risques de tout accès autorisé ou non à votre compte ;</li>
                <li>(f) ne pas ouvrir plusieurs comptes afin de contourner les restrictions ou les frais que nous avons
                  configurés.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                6. En cas de différend quant à la propriété d’un compte, nous nous réservons le droit d’enquêter et de
                déterminer la propriété du compte en fonction de notre jugement raisonnable.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">3. TARIFS ET PAIEMENT</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. La plateforme est gratuite. Cependant, certains services restent payants (se référer aux Tarifs à
                l’adresse <a href="https://progestionsoft.com/tarif" target="_blank" rel="noopener noreferrer"
                  class="text-primary hover:underline">https://progestionsoft.com/tarif</a>). Leurs souscriptions se
                fera par un intermédiaire de paiement. Vous reconnaissez et acceptez que :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(a) les frais d’abonnement seront prépayés, ce qui signifie que ces frais seront payés avant que le
                  service ne vous soit débloqué ;</li>
                <li>(b) mensuellement ou annuellement, votre abonnement peut s’expirer et vous devrez le réactiver
                  manuellement ;</li>
                <li>(c) au cas où vous aurez souscrire au mauvais plan, aucun remboursement ne pourra être fait ;</li>
                <li>(d) Si votre compte est restreint pour une activité suspecte et que vous avez un abonnement en
                  cours, il n’y aura pas de remboursement.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Les frais sont exprimés en francs CFA (monnaie béninoise). Nous nous réservons le droit de modifier
                ses frais en tout temps, sur préavis ou à notre propre discrétion. Si vous n’acceptez pas un changement
                de frais, vous pouvez arrêter l’utilisation de tous services payants sans encourir les frais modifiés,
                mais aucun remboursement ne sera payable pour les frais que vous avez déjà payés.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Si vous avez bénéficié d’un tarif promotionnel ou d’un essai gratuit, à l’expiration de cette période
                de promotion ou d’essai gratuit et en cas d’abonnement, vous serez facturé au tarif standard
                (c’est-à-dire non promotionnel).
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">4. CONTENU DU L’UTILISATEUR</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Nous pouvons vous activer, ainsi que les co-utilisateurs, pour publier, importer, téléverser,
                stocker, partager, envoyer, afficher ou transmettre de toute autre manière du texte, des données, des
                informations, des photos, des images, des fichiers multimédias, des logos ou tout autre contenu vers ou
                par le biais des services dans le but de gérer votre compte.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Nous ne prévenons pas, ne pourront pas prévenir ou remédier à tous les incidents de sécurité, y
                compris les activités malveillantes, en rapport avec les Services ou le contenu.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Vous conservez tous les droits et la propriété de votre contenu. Vous fournirez à PGS le contenu
                exporté sous une forme ne nécessitant aucun traitement ou modification par nous. Vous êtes également
                tenu de fournir toutes les notifications à toute personne, y compris les utilisateurs externes,
                d’obtenir et de conserver tous les consentements de ces personnes, comme l’exige la loi ou la
                réglementation applicable du code du numérique.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. Vous êtes seul et entièrement responsable du contenu exporté telles que les offres de candidatures,
                des commentaires et des publications dans les forums.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                5. Afin de fournir les services, Nous pouvons accéder aux contenus exportés et l’utiliser de diverses
                manières en votre nom. Pour cette raison, dans le but unique et limité de vous fournir nos services,
                vous nous accordez par la présente une licence non exclusive, transférable, sous-licenciable, globale et
                libre de redevances pour accéder, utiliser, copier, modifier, afficher publiquement, exécuter
                publiquement, reproduire, traduire, créer des œuvres dérivées et distribuer le contenu, en tout ou en
                partie.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                6. Vous déclarez, garantissez et convenez que votre contenu exporté ne doit pas :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(a) enfreindre, détourner ou violer tout brevet, droit d’auteur, marque de commerce, secret
                  commercial, confidentialité, droit moral ou droit à la vie privée, ou tout autre droit de propriété ou
                  de propriété intellectuelle ;</li>
                <li>(b) violer ou promouvoir la violation de toute loi ;</li>
                <li>(c) être diffamatoire, frauduleux, faux ou trompeur ;</li>
                <li>(d) constituer, consister ou activer des spams volontaires, des tentatives d’hameçonnage, des
                  systèmes pyramidaux ou d’autres activités malveillantes ;</li>
                <li>(e) inclure de la nudité ou des produits, services ou autres matériels à thème sexuel, être
                  pornographique, vulgaire, exploiter les enfants ou être autrement obscène ;</li>
                <li>(f) promouvoir la violence, la discrimination, le sectarisme, le racisme, la haine, le harcèlement
                  ou le préjudice à l’encontre de tout individu ou groupe.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                7. La détermination de la violation des présentes conditions par le contenu exporté est à notre seule
                discrétion.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                8. Nous n’avons aucune obligation de surveiller, de valider, de corriger ou de mettre à jour vos
                Contenus de quelque façon que ce soit. Cependant, nous pouvons, à notre seule discrétion, supprimer ou
                refuser d’afficher tout Contenu en violation des présentes Conditions.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">5. SOUMISSIONS DES UTILISATEURS</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Si vous fournissez une Soumission, que ce soit par courriel ou autrement, vous acceptez qu’elle soit
                non confidentielle (à moins que nous n’indiquions le contraire par écrit) et devienne la propriété
                exclusive de PGS.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. PGS possède des droits exclusifs, y compris tous les droits de propriété intellectuelle, et a droit à
                l’utilisation et à la diffusion sans restriction des Soumissions, ainsi qu’à tous les changements,
                modifications ou mises à niveau que nous apportons aux Services sur la base de la Soumission, à toute
                fin, commerciale ou autre. Vous convenez que nous ne sommes pas obligées de vous fournir une
                reconnaissance ou une compensation en échange des soumissions.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">6. OBLIGATIONS DE L’UTILISATEUR ET UTILISATION ACCEPTABLE
              </h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Soyez décent. Ne transmettez aucune information à PGS, aux autres utilisateurs, co-utilisateurs ou
                utilisateurs externes, ou à leur sujet, qui est considérée, selon notre seule décision, comme étant
                dégradante, harcelante, blessante, injurieuse, abusive, désobligeante, insultante, diffamatoire, fausse,
                trompeuse ou autrement insultante.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Vous acceptez d’utiliser nos Services en conformité avec les lois et réglementations locales,
                étatiques, nationales et internationales applicables. Vous ne pouvez pas utiliser les Services pour ou
                au nom d’une personne ou d’une organisation soumise à des embargos, des sanctions ou autrement désignée
                sur une liste de parties interdites, tenues par le gouvernement Bénin ou ses États membres, ou toute
                autre autorité gouvernementale applicable. Vous acceptez de coopérer avec PGS en fournissant les
                informations raisonnablement demandées par PGS, afin de garantir sa conformité aux lois applicables dans
                le cadre de votre utilisation des Services.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Vous êtes responsable et devez tout fournir, les documents, le téléphone, l’ordinateur, le matériel
                informatique, les connexions Internet, et tout autre équipement et service nécessaire pour accéder aux
                Services.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. Vous vous engagez à ne pas vous livrer, tenter de vous livrer, encourager ou aider d’autres personnes
                à se livrer à une quelconque activité malveillante lorsque vous accédez aux Services ou les utilisez.
                Par « Activité malveillante », on entend l’un des éléments suivants, seul ou en combinaison :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(i) utiliser, afficher, mettre en miroir ou encadrer les Services ou tout élément individuel des
                  Services ;</li>
                <li>(ii) accéder ou modifier des zones non publiques des Services ;</li>
                <li>(iii) tester la vulnérabilité des Systèmes PGS ou violer toute mesure de sécurité ou
                  d’authentification ;</li>
                <li>(iv) contourner toute mesure prise par PGS ou un tiers pour protéger les Services ;</li>
                <li>(v) interrompre, endommager, détruire ou limiter la fonctionnalité des Services ;</li>
                <li>(vi) télécharger ou transmettre de toute autre manière des données malveillantes, des virus ou tout
                  activité malveillante.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                5. Les utilisateurs doivent coopérer avec PGS pour isoler, atténuer et éliminer rapidement toute
                activité malveillante et prendre les mesures correctives appropriées.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                6. Si nous déterminons qu’une activité malveillante s’est produite involontairement dans le cadre d’un
                enregistrement ou importation de données par l’utilisateur, ce dernier aura la possibilité d’éliminer
                rapidement cette activité. S’il ne l’élimine pas rapidement selon nos instructions, nous pourrons
                éliminer l’activité malveillante et l’utilisateur peut encourir à des sanctions juridiques.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                7. Vous acceptez de coopérer avec nous pour vous assurer que l’utilisation des ressources est mesurée
                avec précision. Ne surchargez pas les Services et n’imposez pas de charges excessives aux processeurs,
                serveurs ou autres ressources utilisés en rapport avec les Services.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                8. Si votre utilisation des Services entraîne une activité nuisible aux performances des ressources
                d’espace disque, telle que la l’importation de fichiers volumineux, nous pouvons prendre des mesures
                correctives et/ou limiter votre utilisation des Services si nécessaire pour protéger la stabilité des
                Services. Vous acceptez de coopérer avec nous afin de vous assurer que votre utilisation des Services ne
                porte pas atteinte aux performances des ressources d’espace disque.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                9. Si l’espace disque du plan de service auquel vous aviez souscrit est arrivée à expiration, vous devez
                renouveler cet abonnement ou mettre votre plan à niveau pour continuer à consulter vos fichiers sur
                votre espace non gratuite.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                10. N’utilisez pas les Services pour des activités gourmandes en bande passante, y compris l’importation
                de fichiers vidéo ou audio compressés et de toutes autres ressources numériques téléchargeables.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">7. LA PROPRIETE DE PRO GESTION SOFT ET VOS DROITS DE
                LICENCE</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. À l’exception des services tiers, les services sont la propriété unique et exclusive de PRO GESTION
                SOFT et non de l’utilisateur. Sans limiter la généralité de ce qui précède, tous les droits, titres et
                intérêts dans et sur les Services, y compris tous les logiciels, sites Web, serveurs, graphiques,
                images, audio, vidéo et autres médias, designs, animations, interfaces, documentation, l’apparence,
                algorithmes, données, caractéristiques, outils et méthodes de publicité et d’acquisition, inventions,
                secrets commerciaux, logos, marques commerciales, marques de service, noms commerciaux et autres
                identificateurs propriétaires, qu’ils soient ou non enregistrés et/ou susceptibles d’être enregistrés,
                et toutes leurs dérivations sont la propriété de et/ou sous licence de PRO GESTION SOFT.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Sous réserve de votre respect des présentes conditions, il vous est accordé une licence limitée, non
                exclusive, non transférable, non susceptible de sous-licence et entièrement révocable pour accéder et
                utiliser les services dans le seul but de gérer votre structure ou une structure que vous représentez.
                Vous ne devez pas louer, donner en location, concéder sous licence, vendre, distribuer ou transférer de
                toute autre manière les services à des tiers, sauf si cela est autorisé par les présentes conditions ou
                autrement autorisé par PGS par écrit. Aucune licence ou droit ne vous est accordé par implication ou
                autrement en vertu des droits de propriété intellectuelle détenus ou contrôlés par PGS ou ses concédants
                de licence, sauf pour les licences et droits expressément accordés. À la résiliation de ces conditions
                ou des Services, vous n’aurez plus aucun droit ou licence sur les Services, et vous devez immédiatement
                cesser d’utiliser les Services et détruire toutes les copies en votre possession si possible.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Nous pouvons, à notre discrétion et sans engager notre responsabilité envers vous, avec ou sans
                préavis et à tout moment, modifier ou interrompre, temporairement ou définitivement, toute partie de nos
                Services.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">8. DROIT D’AUTEUR ET POLITIQUE EN MATIERE DE CONTREFAÇON
              </h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Conformément aux lois du droit d’auteur et des voisins, au code du numérique, aux dispositions de
                l’Agence Nationale de la Sécurité des Systèmes d’Information (ANSSI) et à toute autre loi applicable,
                PRO GESTION SOFT a adopté une politique de résiliation, dans des circonstances appropriées et à sa seule
                discrétion, des utilisateurs qui sont considérés comme des contrefacteurs répétés de la propriété
                protégée d’autrui. PRO GESTION SOFT peut également, à sa seule discrétion, limiter l’accès aux Services
                et/ou résilier les Comptes de tout utilisateur qui, selon nous, pourrait enfreindre les droits de
                propriété intellectuelle d’autrui, qu’il y ait ou non violation répétée.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Si vous pensez qu’un élément des Services porte atteinte à un droit d’auteur que vous possédez ou
                contrôlez, vous pouvez en aviser l’équipe PGS chargé de cela de la manière indiquée ci-dessous :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>PRO GESTION SOFT SARL</li>
                <li>Attn.: Service des Données et de la Confidentialité</li>
                <li>Adjarra, Malanhoui, Tanmè (République du Bénin)</li>
                <li>(229) 52 53 53 80</li>
                <li>legal@progestionsoft.com</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Vous devez noter que si vous faites sciemment de fausses déclarations dans votre notification que le
                matériel ou l’activité enfreint, vous serez responsable de tout dommage, y compris si possible les coûts
                et les honoraires d’avocat, encourus par nous ou le contrefacteur présumé à la suite de notre
                utilisation de ces fausses déclarations pour retirer ou désactiver l’accès au matériel ou à l’activité
                qui prétend être en infraction.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. La reproduction ou représentation, intégrale ou partielle, des pages, des données et de tout autre
                éléments constitutifs des services, par quelque procédé ou support que ce soit, est interdite et
                constitue, sans autorisation de l’éditeur, une contrefaçon
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">9. SERVICES DE TIERS</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Les services peuvent afficher, permettre l’accès ou l’utilisation, installer ou incorporer des
                contenus, des promotions, des sites web, des applications, des logiciels, des services et des ressources
                de tiers qui ne sont pas sous notre contrôle. Les services de tiers ne sont disponibles que pour votre
                commodité, et nous ne sommes pas responsables des produits, services ou autre contenu qui sont
                disponibles à partir des services de tiers. Vous reconnaissez que tous les services de tiers que vous
                utilisez en relation avec les services ne sont pas contrôlés par PGS, et vous prenez la seule
                responsabilité et assumez tous les risques découlant de votre interaction avec ou de l’utilisation de
                tout service de tiers.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Vous êtes responsable de la lecture, de la compréhension et du respect de la licence, des conditions
                générales et de la politique de confidentialité qui s’appliquent à votre utilisation de tout service de
                tiers. La référence à ou l’utilisation de tout service de tiers par PGS ne constitue ou n’implique pas
                nécessairement l’approbation, le parrainage ou la recommandation de ces services par PGS.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">10. RESILIATION</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Si vous enfreignez ces Conditions ou toute autre politique, condition ou accord que PRO GESTION SOFT
                a mis en place, au fil du temps, nous pouvons, immédiatement et à notre discrétion, résilier cet Accord
                et/ou résilier ou suspendre votre accès aux Services et votre Compte. Lors d'une telle résiliation ou
                suspension, vous n'êtes pas autorisé à vous inscrire à un autre compte ou à accéder aux services sans
                notre autorisation écrite préalable.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Les services et les présentes conditions peuvent être résiliés par l’une ou l’autre partie pour des
                raisons de commodité.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">11. RENONCIATION DE GARANTIES</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Sauf indication contraire dans les présentes conditions, tous les services sont fournis « tels quels
                » et « tels que disponibles » et PGS décline par la présente toutes les garanties, qu’elles soient
                expresses, implicites, statutaires ou autres, y compris toutes les garanties implicites de qualité
                marchande, d’adéquation à un usage particulier, de titre et d’absence de contrefaçon, ainsi que toutes
                les garanties découlant du cours des affaires, de l’usage ou des pratiques commerciales.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Sans limiter la portée de ce qui précède, PGS ne donne aucune garantie de quelque nature que ce soit
                que les services, ou tout produit ou résultat de leur utilisation, répondront aux exigences de
                l’utilisateur ou de toute autre personne, fonctionneront sans interruption.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">12. LIMITATION DE RESPONSABILITÉ</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Ni PGS, ses propriétaires, ses dirigeants, son directeur, ses employés, ses agents, ses
                sous-traitants, ses partenaires ou ses concédants de licence, ni aucune autre partie impliquée dans la
                création, la production ou la prestation des services ne seront responsables de tout dommage indirect,
                accessoire, spécial, exemplaire ou consécutif, notamment la perte de profits, la perte de clientèle,
                l’interruption de service, les dommages informatiques, la panne du système, le vol ou la destruction de
                données ou du contenu, ou le coût des services de remplacement découlant de ou dans le cadre de l’accord
                ou de l’utilisation ou de l’incapacité d’utiliser les services, que ce soit sur la base d’une garantie,
                d’un contrat, d’un délit (y compris la négligence) ou de toute autre théorie juridique, et que nous
                ayons été informé ou non de la possibilité de tels dommages, et même si un recours limité configuré dans
                l’accord s’avère ne pas avoir atteint son objectif essentiel.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Les exclusions et limitations de responsabilité et les dommages configurés dans ces Conditions sont
                des éléments fondamentaux de la base du contrat entre vous et nous.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Certaines juridictions n’autorisent pas l’exclusion de certaines garanties ou la limitation ou
                l’exclusion de la responsabilité pour les dommages accessoires ou indirects. En conséquence, les
                limitations des articles 11 et 12 s’appliqueront à vous dans toute la mesure permise par la loi.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">13. INDEMNITE</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Vous acceptez de défendre, d’indemniser et de dégager PGS (et chacun de nos propriétaires,
                dirigeants, directeur, employés, agents, entrepreneurs, concédants de licence et affiliés) de toute
                responsabilité pour toute perte, coût, dépense, dommage, blessure et/ou responsabilité de toute sorte, y
                compris les frais d’avocat, qu’un bénéficiaire de l’indemnité peut encourir ou subir en raison de toute
                réclamation, poursuite, procédure ou investigation revendiquée ou engagée par un tiers, qui découle ou
                est liée de quelque manière que ce soit à :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(a) votre accès ou utilisation de nos services ou votre conduite en relation avec ceux-ci ;</li>
                <li>(b) le contenu ou les soumissions des utilisateurs ;</li>
                <li>(c) votre violation ou prétendue violation de l’accord ;</li>
                <li>(d) votre violation de toute loi ou des droits d’un tiers.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Nous nous réservons le droit, à notre seule discrétion, de contrôler toute action ou procédure, y
                compris la sélection des avocats, et de déterminer si nous souhaitons la régler et, le cas échéant, à
                quelles conditions, auquel cas vous coopérerez avec nous pour faire valoir toute défense disponible.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">14. REGLEMENT DES DIFFERENDS</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Nous voulons répondre à vos préoccupations sans avoir recours à une action en justice officielle.
                Avant de déposer une plainte formelle contre nous, veuillez nous contacter à legal@progestionsoft.com.
                Nous tenterons de résoudre le différend et de répondre à vos préoccupations. Si un différend n’est pas
                résolu dans les 25 jours suivant sa soumission, vous ou PGS pouvez intenter une procédure formale tel
                que stipulé dans cette section.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Tout litige, controverse ou réclamation découlant de ou lié aux Services ou à l’Accord, ou à la
                violation de celui-ci, sera exclusivement réglé par arbitrage administré par (à préciser plus tard)
                conformément à ses règles d’arbitrage commercial, et le jugement sur la sentence rendue par l’arbitre
                peut être saisi dans tout tribunal compétent. Toutefois, vous et PGS ne soyez pas nécessaires pour
                arbitrer tout litige dans lequel l’une des parties cherche à obtenir un redressement équitable ou une
                injonction pour l’utilisation illégale présumée de droits d’auteur, de marques, de noms commerciaux, de
                logos, de secrets commerciaux, de brevets ou d’autres informations confidentielles ou de propriété
                intellectuelle.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Si, pour quelque raison que ce soit, la présente convention d’arbitrage ne s’applique pas au litige,
                vous et PGS convenez que toute procédure judiciaire, y compris tout appel d’une sentence arbitrale, sera
                portée exclusivement devant les tribunaux compétentes.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">15. CERTIFICATION</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. Cette section s’applique uniquement dans la mesure où PRO GESTION SOFT reçoit et traite les
                renseignements personnels de l’utilisateur externe pour ou au nom de l’utilisateur et la règle sur la
                collecte des données personnels des personnes s’applique à ces renseignements personnels de
                l’utilisateur externe.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. PGS certifie, comprend et accepte ce qui suit :
              </p>
              <ul class="list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed">
                <li>(i) PGS est un fournisseur de services en ce qui concerne les renseignements personnels de
                  l’utilisateur externe.</li>
                <li>(ii) PGS ne vendra pas les renseignements personnels de l’utilisateur externe.</li>
                <li>(iii) PGS ne conservera pas, n’utilisera pas et ne divulguera pas les informations personnelles de
                  l’utilisateur externe à des fins autres que l’objectif spécifique de l’exécution des Services en vertu
                  de l’accord, ou tel qu’autrement autorisé par la loi sur la collecte des données personnels des
                  personnes.</li>
              </ul>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Tous les termes non définis dans le présent article ont le sens qui leur est donné dans par la loi
                sur la collecte des données personnels des personnes.
              </p>
            </div>

            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-4">16. DIVERS</h2>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                1. L’Accord constitue l’intégralité de l’entente et de l’accord des parties.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                2. Vous ne pouvez céder aucun de vos droits ou obligations en vertu du contrat sans le consentement
                écrit préalable de PGS. Nous pouvons céder tout ou partie de ses droits en vertu du contrat, en totalité
                ou en partie, sans obtenir votre consentement ou votre approbation.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                3. Le fait que nous n’ayons pas exercé ou que nous ayons tardé à exercer un droit, un pouvoir ou un
                privilège en vertu du contrat ne constitue pas une renonciation à ce droit, ce pouvoir ou ce privilège.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                4. L’invalidité ou l’inapplicabilité de toute disposition de l’Accord n’affectera pas la validité ou
                l’applicabilité de toute autre disposition de l’Accord, qui resteront toutes en vigueur et de plein
                effet.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { IconList } from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles'

const sharedFiles = useSharedFiles()
const tableOfContents = ref<{ id: string; text: string }[]>([]);
const activeSectionId = ref('');
const showMobileToc = ref(false);

// Slug
const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Scroll
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleScroll = () => {
  const scrollY = window.scrollY;
  const sections = tableOfContents.value.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

  let currentActiveId = '';
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.offsetTop <= scrollY + 100) {
      currentActiveId = section.id;
      break;
    }
  }
  activeSectionId.value = currentActiveId;
};

// Téléchargement
const downloadPdf = async () => {
  const pdfUrl = sharedFiles.paths.pdf.legal;
  const fileName = 'PGS_CGU.pdf';

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    alert('Impossible de télécharger le fichier. Veuillez réessayer plus tard.');
  }
};

onMounted(() => {
  // Generer TOC
  nextTick(() => {
    const contentContainer = document.getElementById('terms-content');
    if (contentContainer) {
      const headings = contentContainer.querySelectorAll('h2');
      headings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = slugify(text);
        heading.id = id;
        tableOfContents.value.push({ id, text });
      });
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

useHead({
  title: 'Conditions Générales d\'Utilisation',
  meta: [
    { name: 'description', content: 'Consultez les conditions générales d\'utilisation des services de PRO GESTION SOFT (PGS).' }
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
