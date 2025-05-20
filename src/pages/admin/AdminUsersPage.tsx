
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '@/services/api';
import { User } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ShieldX, LockKeyhole, Edit, Key } from 'lucide-react';

const AdminUsersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await API.get('/users');
      return response.data;
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: 'admin' | 'client' }) => {
      return API.put(`/users/${userId}`, { role });
    },
    onSuccess: () => {
      toast({
        title: "Rôle mis à jour",
        description: `Le statut de l'utilisateur a été mis à jour avec succès`,
      });
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive"
      });
    }
  });

  const setTempPasswordMutation = useMutation({
    mutationFn: async ({ userId, passwordUnique }: { userId: string, passwordUnique: string }) => {
      return API.put(`/users/${userId}/temp-password`, { passwordUnique });
    },
    onSuccess: () => {
      toast({
        title: "Mot de passe temporaire défini",
        description: `Un mot de passe à usage unique a été défini pour l'utilisateur`,
      });
      setIsPasswordDialogOpen(false);
      setTempPassword('');
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de définir le mot de passe temporaire",
        variant: "destructive"
      });
    }
  });

  const handleRoleChange = (user: User) => {
    // Tous les admins peuvent modifier les rôles maintenant
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier les rôles",
        variant: "destructive"
      });
      return;
    }
    
    // Ne pas permettre la modification du compte Admin principal (id: "1")
    if (user.id === "1") {
      toast({
        title: "Action non autorisée",
        description: "L'administrateur principal ne peut pas être rétrogradé",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      const newRole = selectedUser.role === 'admin' ? 'client' : 'admin';
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    }
  };

  const handleSetTempPassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  const confirmTempPassword = () => {
    if (selectedUser && tempPassword) {
      setTempPasswordMutation.mutate({ 
        userId: selectedUser.id, 
        passwordUnique: tempPassword 
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un mot de passe temporaire",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead>Changer le mot de passe</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User & { password?: string, passwordUnique?: string }, index: number) => (
              <TableRow key={`user-${user.id}-${index}`}>
                <TableCell className="font-medium">{user.nom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? (
                      <><Shield className="h-3 w-3" /> Administrateur</>
                    ) : (
                      <><ShieldX className="h-3 w-3" /> Client</>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {user.password && (
                    <div className="flex items-center gap-1">
                      <LockKeyhole className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-mono">{user.password}</span>
                    </div>
                  )}
                  {user.passwordUnique && (
                    <div className="flex items-center gap-1 mt-1">
                      <Key className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-mono text-amber-600">{user.passwordUnique}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetTempPassword(user)}
                    className="flex gap-1 items-center"
                  >
                    <Edit className="h-4 w-4" /> Modifier
                  </Button>
                </TableCell>
                <TableCell>
                  {user.id !== "1" && (
                    <Button 
                      variant={user.role === 'admin' ? 'destructive' : 'default'}
                      size="sm" 
                      onClick={() => handleRoleChange(user)}
                      disabled={!currentUser || currentUser.role !== 'admin'}
                    >
                      {user.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Confirmation Dialog for Role Change */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le changement de rôle</DialogTitle>
            <DialogDescription>
              {selectedUser?.role === 'admin'
                ? `Êtes-vous sûr de vouloir rétrograder ${selectedUser?.nom} au rôle de client ?`
                : `Êtes-vous sûr de vouloir promouvoir ${selectedUser?.nom} au rôle d'administrateur ?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmRoleChange}
              variant={selectedUser?.role === 'admin' ? 'destructive' : 'default'}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Temporary Password */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Définir un mot de passe temporaire</DialogTitle>
            <DialogDescription>
              {`Créez un mot de passe à usage unique pour ${selectedUser?.nom}. L'utilisateur pourra l'utiliser pour réinitialiser son mot de passe.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Mot de passe à usage unique"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmTempPassword}
              disabled={!tempPassword}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsersPage;
