import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { remboursementsAPI, type RemboursementFormData } from '@/services/api';
import { Upload, X } from 'lucide-react';

interface RefundFormProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RefundForm: React.FC<RefundFormProps> = ({ orderId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RemboursementFormData>({
    orderId,
    reason: '',
    customReason: '',
    photo: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const refundReasons = [
    'mauvaise qualité',
    'trompé produit', 
    'trompé taille',
    'manque produit'
  ];

  const handleReasonChange = (value: string) => {
    setFormData(prev => ({ ...prev, reason: value }));
  };

  const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, customReason: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Le fichier ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont autorisées');
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      // Créer l'aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: undefined }));
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Veuillez sélectionner une raison de remboursement');
      return;
    }

    if (!formData.customReason.trim()) {
      toast.error('Veuillez préciser la raison de votre demande');
      return;
    }

    if (!formData.photo) {
      toast.error('Veuillez ajouter une photo justificative');
      return;
    }

    setIsSubmitting(true);

    try {
      await remboursementsAPI.create(formData);
      toast.success('Votre demande de remboursement a été envoyée avec succès');
      onSuccess();
    } catch (error: any) {
      console.error('Erreur lors de la création de la demande:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Demande de remboursement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Raison du remboursement</Label>
            <Select value={formData.reason} onValueChange={handleReasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                {refundReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason.charAt(0).toUpperCase() + reason.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customReason">Précisez votre demande</Label>
            <Textarea
              id="customReason"
              placeholder="Décrivez le problème en détail..."
              value={formData.customReason}
              onChange={handleCustomReasonChange}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo justificative</Label>
            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="photo" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Cliquez pour ajouter une photo
                    </span>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RefundForm;
