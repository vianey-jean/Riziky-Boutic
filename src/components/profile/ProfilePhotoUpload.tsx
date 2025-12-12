import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Upload, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { authAPI } from '@/services/api';

interface ProfilePhotoUploadProps {
  onPhotoUpdated?: () => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ onPhotoUpdated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [selectedExisting, setSelectedExisting] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedExisting('');
    }
  };

  const handleExistingPhotoSelect = (photoUrl: string) => {
    setSelectedExisting(photoUrl);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleConfirmUpload = () => {
    setShowConfirmation(true);
  };

  // 🔥 Correction majeure : version complète corrigée
  const handleUpload = async () => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setUploading(true);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile-images/${user.id}/upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        await authAPI.updateProfile(user.id, { profileImage: result.profileImage });

      } else if (selectedExisting) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile-images/${user.id}/set-active`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ profileImagePath: selectedExisting }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
        }

        await authAPI.updateProfile(user.id, { profileImage: selectedExisting });
      }

      toast.success('Photo de profil mise à jour avec succès');

      // 🔥 Correction ici — fermeture propre du modal + refresh
      onPhotoUpdated?.();
      setIsOpen(false);
      setShowConfirmation(false);

      setSelectedFile(null);
      setPreviewUrl('');
      setSelectedExisting('');

    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de la photo de profil: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const loadExistingPhotos = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile-images/${user.id}/list`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.ok) {
        const photos = await response.json();
        setExistingPhotos(photos);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadExistingPhotos();
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changer la photo de profil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Ajouter une nouvelle photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {previewUrl && (
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            )}

            {existingPhotos.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Vos photos existantes ({existingPhotos.length})
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {existingPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => handleExistingPhotoSelect(photo)}
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        selectedExisting === photo ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${photo}`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                      {selectedExisting === photo && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleConfirmUpload}
              disabled={!selectedFile && !selectedExisting || uploading}
              className="w-full"
            >
              {uploading
                ? 'Enregistrement...'
                : selectedFile
                  ? 'Ajouter cette nouvelle photo'
                  : selectedExisting
                    ? 'Utiliser cette photo'
                    : 'Sélectionnez une photo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le changement</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedFile
                ? 'Voulez-vous ajouter cette nouvelle photo comme photo de profil ?'
                : 'Voulez-vous utiliser cette photo existante comme photo de profil ?'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Enregistrement...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfilePhotoUpload;
