
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageCircle, Mail, Phone, MapPin, Calendar, User, MessageSquare } from 'lucide-react';

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
    
    if (!contact.read) {
      updateReadStatusMutation.mutate({ id: contact.id, read: true });
    }
  };
  
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const unreadCount = contacts.filter((contact: Contact) => !contact.read).length;
  const totalMessages = contacts.length;
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                  Messages des Clients
                </h1>
                <p className="text-purple-600 dark:text-purple-400">
                  Gestion et suivi des demandes clients
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{totalMessages}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-red-200 dark:border-red-700">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Non lus</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300">{unreadCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-300px)]">
          {/* Messages List */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Liste des messages ({contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-420px)]">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl w-fit mx-auto mb-4">
                      <MessageCircle className="h-12 w-12 text-gray-500 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Aucun message</h3>
                    <p className="text-gray-600 dark:text-gray-400">Les nouveaux messages apparaîtront ici.</p>
                  </div>
                ) : (
                  <div>
                    {contacts.map((contact: Contact) => (
                      <div key={contact.id}>
                        <button
                          className={cn(
                            "w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200",
                            selectedContact?.id === contact.id && "bg-purple-50 dark:bg-purple-900/20 border-r-4 border-purple-500",
                            !contact.read && "bg-red-50 dark:bg-red-900/20"
                          )}
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                                !contact.read ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-purple-500 to-purple-600"
                              )}>
                                {contact.prenom.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className={cn(
                                  "font-medium text-sm",
                                  !contact.read && "font-bold text-red-800 dark:text-red-300"
                                )}>
                                  {contact.objet}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {contact.prenom} {contact.nom}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(contact.dateCreation)}
                              </span>
                              {!contact.read && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-1 ml-auto"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
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
          
          {/* Message Details */}
          <Card className="lg:col-span-3 shadow-xl border-0 bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                {selectedContact ? 'Détails du message' : 'Sélectionnez un message'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedContact ? (
                <div className="space-y-6">
                  {/* Contact Info Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Expéditeur</h3>
                        </div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {selectedContact.prenom} {selectedContact.nom}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Mail className="h-5 w-5 text-green-600" />
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Email</h3>
                        </div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          {selectedContact.email}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Phone className="h-5 w-5 text-orange-600" />
                          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">Téléphone</h3>
                        </div>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">
                          {selectedContact.telephone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Date</h3>
                        </div>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">
                          {new Date(selectedContact.dateCreation).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-5 w-5 text-indigo-600" />
                          <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Adresse</h3>
                        </div>
                        <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                          {selectedContact.adresse}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Objet</h3>
                    <p className="text-yellow-900 dark:text-yellow-100 font-medium">
                      {selectedContact.objet}
                    </p>
                  </div>
                  
                  {/* Message */}
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Message</h3>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg transition-all duration-200"
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
                <div className="text-center py-16">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl w-fit mx-auto mb-6">
                    <MessageCircle className="h-16 w-16 text-gray-500 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Sélectionnez un message
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choisissez un message dans la liste pour voir les détails
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagesPage;
