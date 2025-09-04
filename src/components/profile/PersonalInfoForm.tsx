import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UpdateProfileData } from '@/types/auth';
import { DeleteProfileModal } from './DeleteProfileModal';
import { Trash2 } from 'lucide-react';

interface PersonalInfoFormProps {
  profileData: UpdateProfileData & { id?: string };
  loading: boolean;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenreChange: (value: string) => void;
  handleProfileSubmit: (e: React.FormEvent) => Promise<void>;
}

const DeleteProfileButton: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Button 
        type="button"
        variant="destructive"
        onClick={() => setShowDeleteModal(true)}
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer le profil
      </Button>
      
      <DeleteProfileModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profileData,
  loading,
  handleProfileChange,
  handleGenreChange,
  handleProfileSubmit
}) => {
  return (
    <form onSubmit={handleProfileSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="nom"
            value={profileData.nom || ''}
            onChange={handleProfileChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            name="prenom"
            value={profileData.prenom || ''}
            onChange={handleProfileChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          name="telephone"
          value={profileData.telephone || ''}
          onChange={handleProfileChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Select 
          value={profileData.genre || ''} 
          onValueChange={handleGenreChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="homme">Homme</SelectItem>
            <SelectItem value="femme">Femme</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          name="adresse"
          value={profileData.adresse || ''}
          onChange={handleProfileChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input
            id="ville"
            name="ville"
            value={profileData.ville || ''}
            onChange={handleProfileChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codePostal">Code Postal</Label>
          <Input
            id="codePostal"
            name="codePostal"
            value={profileData.codePostal || ''}
            onChange={handleProfileChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pays">Pays</Label>
          <Input
            id="pays"
            name="pays"
            value={profileData.pays || ''}
            onChange={handleProfileChange}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          type="submit"
          className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
          disabled={loading}
        >
          Enregistrer les modifications
        </Button>

        
        <DeleteProfileButton />
      </div>
    </form>
  );
};

export default PersonalInfoForm;
