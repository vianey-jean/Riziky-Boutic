
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
import { Shield, ShieldX, LockKeyhole, Edit, Key, Users, Calendar, Mail } from 'lucide-react';

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
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier les rôles",
        variant: "destructive"
      });
      return;
    }
    
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

  const adminCount = users.filter((user: User) => user.role === 'admin').length;
  const clientCount = users.filter((user: User) => user.role === 'client').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Gestion des Utilisateurs
                </h1>
                <p className="text-blue-600 dark:text-blue-400">
                  Administration des comptes et permissions
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{adminCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clients</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{clientCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Liste des utilisateurs ({users.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Utilisateur</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Inscription</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Rôle</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center space-x-2">
                      <LockKeyhole className="h-4 w-4" />
                      <span>Mots de passe</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Modifier MDP</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User & { password?: string, passwordUnique?: string }, index: number) => (
                  <TableRow key={`user-${user.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}>
                          {user.nom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user.nom}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900 dark:to-blue-800 dark:text-blue-200'
                      }`}>
                        {user.role === 'admin' ? (
                          <><Shield className="h-3 w-3" /> Administrateur</>
                        ) : (
                          <><ShieldX className="h-3 w-3" /> Client</>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {user.password && (
                          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <LockKeyhole className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{user.password}</span>
                          </div>
                        )}
                        {user.passwordUnique && (
                          <div className="flex items-center gap-2 p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                            <Key className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-mono text-amber-700 dark:text-amber-400">{user.passwordUnique}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetTempPassword(user)}
                        className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="h-4 w-4 mr-1" /> 
                        Modifier
                      </Button>
                    </TableCell>
                    <TableCell>
                      {user.id !== "1" && (
                        <Button 
                          variant={user.role === 'admin' ? 'destructive' : 'default'}
                          size="sm" 
                          onClick={() => handleRoleChange(user)}
                          disabled={!currentUser || currentUser.role !== 'admin'}
                          className="shadow-lg hover:shadow-xl transition-shadow"
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
        </div>
      </div>
      
      {/* Confirmation Dialog for Role Change */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirmer le changement de rôle</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
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
              className="shadow-lg"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Temporary Password */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Définir un mot de passe temporaire</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {`Créez un mot de passe à usage unique pour ${selectedUser?.nom}. L'utilisateur pourra l'utiliser pour réinitialiser son mot de passe.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Mot de passe à usage unique"
              className="w-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmTempPassword}
              disabled={!tempPassword}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
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
