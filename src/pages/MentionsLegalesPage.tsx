import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Scale, Building, Shield, Copyright, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

const MentionsLegalesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-slate-700 via-gray-800 to-blue-900 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Mentions Légales</h1>
                <p className="text-slate-200 text-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Dernière mise à jour : Mai 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <div className="p-8 md:p-12">
              <div className="prose max-w-none">
                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">1. Informations légales</h2>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500 mb-6">
                    <p className="text-gray-700 mb-4 font-medium">
                      Le site Riziky Boutique est édité par :
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-blue-600">Dénomination sociale :</strong>
                          <p className="text-gray-700 mt-1">Riziky Boutique SARL</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-green-600">Forme juridique :</strong>
                          <p className="text-gray-700 mt-1">Société à responsabilité limitée</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-purple-600">Capital social :</strong>
                          <p className="text-gray-700 mt-1">10 000 €</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-orange-600">Siège social :</strong>
                          <p className="text-gray-700 mt-1">123 Avenue de la Mode, 75001 Paris, France</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-red-600">SIRET :</strong>
                          <p className="text-gray-700 mt-1">123 456 789 00012</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-teal-600">TVA intracommunautaire :</strong>
                          <p className="text-gray-700 mt-1">FR 12 345678901</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <strong className="text-indigo-600">Numéro RCS :</strong>
                          <p className="text-gray-700 mt-1">Paris B 123 456 789</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                          <Mail className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <div>
                            <strong className="text-blue-600">Email :</strong>
                            <a href="mailto:contact@rizikyboutique.fr" className="text-blue-600 hover:text-blue-700 underline ml-2">contact@rizikyboutique.fr</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <strong className="text-gray-800">Directeur de la publication :</strong>
                      <p className="text-gray-700 mt-1">Jean-Marie RABEMANALINA, en qualité de Gérant</p>
                    </div>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl mr-4">
                      <ExternalLink className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">2. Hébergement</h2>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <p className="text-gray-700 mb-4 font-medium">
                      Ce site est hébergé par :
                    </p>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <div className="space-y-2">
                        <div><strong className="text-green-600">Nom :</strong> <span className="text-gray-700">OVH SAS</span></div>
                        <div><strong className="text-green-600">Adresse :</strong> <span className="text-gray-700">2 rue Kellermann - 59100 Roubaix - France</span></div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-green-500 mr-2" />
                          <strong className="text-green-600">Téléphone :</strong> 
                          <span className="text-gray-700 ml-2">+33 9 72 10 10 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl mr-4">
                      <Copyright className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">3. Propriété intellectuelle</h2>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      L'ensemble des éléments constituant le site Riziky Boutique (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Ces éléments sont la propriété exclusive de Riziky Boutique SARL. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, y compris les applications informatiques, sans l'accord préalable et écrit de Riziky Boutique SARL, est strictement interdite.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Le fait pour Riziky Boutique SARL de ne pas engager de procédure dès la prise de connaissance de ces utilisations non autorisées ne vaut pas acceptation desdites utilisations et renonciation aux poursuites.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-xl mr-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">4. Protection des données personnelles</h2>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200 space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Riziky Boutique s'engage à respecter la confidentialité des données personnelles communiquées par l'utilisateur et à les traiter dans le respect de la loi Informatique et Libertés du 6 janvier 1978 modifiée et du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD).
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-red-600 mb-2">Collecte des données</h4>
                        <p className="text-sm text-gray-700">Les informations collectées sont nécessaires à la gestion de votre commande et à nos relations commerciales.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-orange-600 mb-2">Vos droits</h4>
                        <p className="text-sm text-gray-700">Vous disposez d'un droit d'accès, de rectification, de limitation, de portabilité, d'opposition et de suppression.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        Pour exercer ces droits, contactez-nous par email à 
                        <a href="mailto:privacy@rizikyboutique.fr" className="text-red-600 hover:text-red-700 underline mx-1">privacy@rizikyboutique.fr</a>
                        ou par courrier à l'adresse indiquée ci-dessus. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
                      </p>
                    </div>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl mr-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">5. Cookies</h2>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                    <p className="text-gray-700 leading-relaxed">
                      Le site Riziky Boutique utilise des cookies pour améliorer l'expérience utilisateur. Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre 
                      <a href="/politique-cookies" className="text-teal-600 hover:text-teal-700 underline mx-1 font-medium">Politique de Cookies</a>.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl mr-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">6. Limitation de responsabilité</h2>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Riziky Boutique ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site www.rizikyboutique.fr, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Riziky Boutique ne pourra également être tenu responsable des dommages indirects (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site www.rizikyboutique.fr.
                    </p>
                  </div>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                <section>
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">7. Droit applicable et juridiction compétente</h2>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                    <p className="text-gray-700 leading-relaxed">
                      Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront compétents.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MentionsLegalesPage;
