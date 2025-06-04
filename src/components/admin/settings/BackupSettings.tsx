
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, Mail, Database, Loader2 } from 'lucide-react';

interface BackupSettingsProps {
  onManualBackup: () => void;
  isCreatingBackup: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({
  onManualBackup,
  isCreatingBackup
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sauvegarde des Données
        </CardTitle>
        <CardDescription>
          Gérez les sauvegardes automatiques et manuelles de vos données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Sauvegarde automatique</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Activée</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Sauvegarde quotidienne à 23h58 avec envoi par email
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>Envoyée à: vianey.jean@ymail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Sauvegarde manuelle</h4>
            <p className="text-sm text-muted-foreground">
              Créez une sauvegarde immédiate de toutes les données de la base de données et téléchargez le fichier.
            </p>
            <Button 
              onClick={onManualBackup}
              disabled={isCreatingBackup}
              className="w-full"
            >
              {isCreatingBackup ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Créer une sauvegarde maintenant
                </>
              )}
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Contenu de la sauvegarde</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• Utilisateurs</div>
              <div>• Produits</div>
              <div>• Commandes</div>
              <div>• Catégories</div>
              <div>• Messages de contact</div>
              <div>• Avis clients</div>
              <div>• Paramètres du site</div>
              <div>• Favoris</div>
              <div>• Paniers</div>
              <div>• Codes promo</div>
              <div>• Remboursements</div>
              <div>• Ventes flash</div>
              <div>• Publicités</div>
              <div>• Conversations chat</div>
              <div>• Visiteurs</div>
              <div>• Notifications de vente</div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
            <p className="text-sm">
              <strong>Information importante:</strong> Les sauvegardes automatiques sont programmées 
              chaque jour à 23h58. En cas de panne du site, vous pourrez récupérer toutes vos données 
              grâce aux fichiers de sauvegarde envoyés par email.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupSettings;
