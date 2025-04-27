
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contact {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  objet: string;
  message: string;
  dateCreation: string;
  read: boolean;
}

const AdminMessagesPage = () => {
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await API.get('/contacts');
      return response.data;
    }
  });
  
  const updateReadStatusMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string, read: boolean }) => {
      return API.put(`/contacts/${id}`, { read });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark as read if not already
    if (!contact.read) {
      updateReadStatusMutation.mutate({ id: contact.id, read: true });
    }
  };
  
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Messages des clients</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Liste des messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[70vh]">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Aucun message
                </div>
              ) : (
                <div>
                  {contacts.map((contact: Contact) => (
                    <div key={contact.id}>
                      <button
                        className={cn(
                          "w-full text-left p-4 hover:bg-gray-100 transition-colors",
                          selectedContact?.id === contact.id && "bg-gray-100",
                          !contact.read && "border-l-4 border-red-800"
                        )}
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={cn(
                              "font-medium",
                              !contact.read && "font-bold text-red-800"
                            )}>
                              {contact.objet}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.prenom} {contact.nom}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(contact.dateCreation)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {contact.message}
                        </p>
                      </button>
                      <Separator />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Détails du message</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedContact ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Expéditeur</h3>
                    <p>{selectedContact.prenom} {selectedContact.nom}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p>{new Date(selectedContact.dateCreation).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p>{selectedContact.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Téléphone</h3>
                    <p>{selectedContact.telephone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                    <p>{selectedContact.adresse}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Objet</h3>
                  <p className="font-medium">{selectedContact.objet}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    className="text-sm text-red-800 hover:underline"
                    onClick={() => updateReadStatusMutation.mutate({ 
                      id: selectedContact.id, 
                      read: !selectedContact.read 
                    })}
                  >
                    Marquer comme {selectedContact.read ? 'non lu' : 'lu'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Sélectionnez un message pour voir les détails
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagesPage;
