
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const MentionsLegalesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800">Mentions Légales</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : Mai 2025</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Informations légales</h2>
              <p className="text-gray-700 mb-4">
                Le site Riziky Boutique est édité par :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li><strong>Dénomination sociale :</strong> Riziky Boutique SARL</li>
                <li><strong>Forme juridique :</strong> Société à responsabilité limitée</li>
                <li><strong>Capital social :</strong> 10 000 €</li>
                <li><strong>Siège social :</strong> 123 Avenue de la Mode, 75001 Paris, France</li>
                <li><strong>SIRET :</strong> 123 456 789 00012</li>
                <li><strong>Numéro de TVA intracommunautaire :</strong> FR 12 345678901</li>
                <li><strong>Numéro RCS :</strong> Paris B 123 456 789</li>
                <li><strong>Email :</strong> <a href="mailto:contact@rizikyboutique.fr" className="text-red-800 hover:underline">contact@rizikyboutique.fr</a></li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
              </ul>
              
              <p className="text-gray-700 mb-4">
                <strong>Directeur de la publication :</strong> Jean-Marie RABEMANALINA, en qualité de Gérant
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Hébergement</h2>
              <p className="text-gray-700 mb-4">
                Ce site est hébergé par :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li><strong>Nom :</strong> OVH SAS</li>
                <li><strong>Adresse :</strong> 2 rue Kellermann - 59100 Roubaix - France</li>
                <li><strong>Téléphone :</strong> +33 9 72 10 10 10</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                L'ensemble des éléments constituant le site Riziky Boutique (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
              </p>
              <p className="text-gray-700 mb-4">
                Ces éléments sont la propriété exclusive de Riziky Boutique SARL. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, y compris les applications informatiques, sans l'accord préalable et écrit de Riziky Boutique SARL, est strictement interdite.
              </p>
              <p className="text-gray-700">
                Le fait pour Riziky Boutique SARL de ne pas engager de procédure dès la prise de connaissance de ces utilisations non autorisées ne vaut pas acceptation desdites utilisations et renonciation aux poursuites.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Protection des données personnelles</h2>
              <p className="text-gray-700 mb-4">
                Riziky Boutique s'engage à respecter la confidentialité des données personnelles communiquées par l'utilisateur et à les traiter dans le respect de la loi Informatique et Libertés du 6 janvier 1978 modifiée et du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD).
              </p>
              <p className="text-gray-700 mb-4">
                Les informations collectées sont nécessaires à la gestion de votre commande et à nos relations commerciales. Elles peuvent être transmises aux sociétés qui contribuent à ces relations, telles que celles chargées de l'exécution des services et commandes pour leur gestion, exécution, traitement et paiement.
              </p>
              <p className="text-gray-700 mb-4">
                Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, de limitation, de portabilité, d'opposition et de suppression de vos données personnelles. Pour exercer ces droits, veuillez nous contacter par email à <a href="mailto:privacy@rizikyboutique.fr" className="text-red-800 hover:underline">privacy@rizikyboutique.fr</a> ou par courrier à l'adresse indiquée ci-dessus. Vous pouvez également consulter notre Politique de Confidentialité disponible sur notre site.
              </p>
              <p className="text-gray-700">
                Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL), www.cnil.fr.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Le site Riziky Boutique utilise des cookies pour améliorer l'expérience utilisateur. Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/politique-cookies" className="text-red-800 hover:underline">Politique de Cookies</a>.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Limitation de responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Riziky Boutique ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site www.rizikyboutique.fr, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              <p className="text-gray-700">
                Riziky Boutique ne pourra également être tenu responsable des dommages indirects (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site www.rizikyboutique.fr.
              </p>
            </section>

            <Separator className="my-6" />

            <section>
              <h2 className="text-xl font-bold mb-4">7. Droit applicable et juridiction compétente</h2>
              <p className="text-gray-700 mb-4">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront compétents.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MentionsLegalesPage;
