
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
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '@/services/api';
import { User } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Only the main admin (id: "1") can modify roles
  const isMainAdmin = currentUser?.id === "1";

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

  const handleRoleChange = (user: User) => {
    if (!isMainAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seul l'administrateur principal peut modifier les rôles",
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Client'}
                  </span>
                </TableCell>
                <TableCell>
                  {user.id !== currentUser?.id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRoleChange(user)}
                      disabled={!isMainAdmin || user.id === "1"}
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
      
      {/* Confirmation Dialog */}
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
    </AdminLayout>
  );
};

export default AdminUsersPage;
