import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/modules/auth.service';
import { toast } from '@/components/ui/sonner';

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const [step, setStep] = useState<'warning' | 'password' | 'final-confirmation'>('warning');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetModal = () => {
    setStep('warning');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleFirstConfirmation = () => {
    setStep('password');
    setError('');
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Vérifier le mot de passe
      const response = await authService.verifyPassword(user.id, password);
      
      if (response.data.valid) {
        setStep('final-confirmation');
      } else {
        setError('Mot de passe incorrect');
      }
    } catch (error: any) {
      console.error('Erreur de vérification du mot de passe:', error);
      setError('Erreur lors de la vérification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalDelete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Supprimer le profil
      await authService.deleteProfile(user.id, password);
      toast.success('Votre profil a été supprimé avec succès');
      logout(); // Déconnexion automatique
    } catch (error: any) {
      console.error('Erreur lors de la suppression du profil:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression du profil';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (step === 'password') {
      setStep('warning');
      setPassword('');
      setError('');
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl rounded-2xl shadow-2xl border border-gray-100 bg-white p-6">

        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full shadow-inner">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-red-800">
              Supprimer le profil
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Étape 1 : Avertissement */}
        {step === "warning" && (
          <div className="space-y-5">
            <Alert className="border-red-200 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                <strong>Attention !</strong> Cette action est irréversible.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-gray-700 space-y-2">
              <p>
                La suppression de votre profil entraînera la suppression
                définitive de :
              </p>
              <ul className="list-disc list-inside ml-3 space-y-1">
                <li>Vos informations personnelles</li>
                <li>Tous vos commentaires et avis</li>
                <li>Vos produits favoris</li>
                <li>Votre panier</li>
                <li>Votre historique de commandes</li>
                <li>Vos préférences</li>
                <li>Toutes les autres données associées à votre compte</li>
              </ul>
            </div>

           <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-4 whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              onClick={handleFirstConfirmation}
              className="bg-red-600 hover:bg-red-700 text-white px-5"
            >
              Continuer
            </Button>
          </div>

          </div>
        )}

        {/* Étape 2 : Confirmation par mot de passe */}
        {step === "password" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Veuillez confirmer votre identité en saisissant votre mot de
                passe
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-password">Mot de passe</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Saisissez votre mot de passe"
                onKeyPress={(e) =>
                  e.key === "Enter" && handlePasswordSubmit()
                }
                className="rounded-lg"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

           <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-4 whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
              >
                Retour
              </Button>

              <Button
                onClick={handlePasswordSubmit}
                disabled={loading || !password.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-5"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
            </div>

          </div>
        )}

        {/* Étape 3 : Confirmation finale */}
        {step === "final-confirmation" && (
          <div className="space-y-5">
            <Alert className="border-red-200 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Dernière chance !</strong> Êtes-vous absolument certain
                de vouloir supprimer votre profil ?
              </AlertDescription>
            </Alert>

            <p className="text-sm text-gray-700 leading-relaxed">
              Cette action supprimera définitivement toutes vos données et ne
              peut pas être annulée.
            </p>

            <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-4 whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
            >
              Non, garder mon profil
            </Button>

            <Button
              variant="destructive"
              onClick={handleFinalDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-5 whitespace-nowrap"
            >
              {loading ? "Suppression..." : "Oui, supprimer définitivement"}
            </Button>
          </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};