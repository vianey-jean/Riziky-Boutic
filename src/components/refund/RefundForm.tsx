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
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Upload, X } from 'lucide-react';
import { remboursementsAPI, RemboursementFormData } from '@/services/api';

interface RefundFormProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RefundForm: React.FC<RefundFormProps> = ({ 
  orderId, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<RemboursementFormData>({
    orderId,
    reason: '',
    customReason: '',
    photo: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const reasonOptions = [
    { value: 'mauvaise qualité', label: 'Mauvaise qualité' },
    { value: 'trompé produit', label: 'Produit trompeur' },
    { value: 'trompé taille', label: 'Taille incorrecte' },
    { value: 'manque produit', label: 'Produit manquant' }
  ];

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
        setPreviewImages([e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: undefined }));
    setPreviewImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Veuillez sélectionner une raison');
      return;
    }

    setIsSubmitting(true);

    try {
      await remboursementsAPI.create(formData);
      toast.success('Demande de remboursement créée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast.error('Erreur lors de la création de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      orderId,
      reason: '',
      customReason: '',
      photo: undefined
    });
    setPreviewImages([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demande de remboursement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Raison du remboursement *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customReason">Détails supplémentaires</Label>
            <Textarea
              id="customReason"
              placeholder="Décrivez plus en détail le problème..."
              value={formData.customReason || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo (optionnel)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formats acceptés: JPG, PNG, GIF (max 5MB)
            </p>
          </div>

          {previewImages.length > 0 && (
            <div>
              <Label>Aperçu de la photo</Label>
              <div className="mt-2">
                <div className="relative">
                  <img
                    src={previewImages[0]}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.reason}
              className="flex-1"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefundForm;
