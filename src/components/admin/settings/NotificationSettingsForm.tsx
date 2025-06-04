
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NotificationSettings } from '@/types/settings';
import { Loader2, Save, Mail, MessageCircle, Bell, Slack } from 'lucide-react';

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onUpdate: (settings: Partial<NotificationSettings>) => void;
  isLoading: boolean;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({
  settings,
  onUpdate,
  isLoading
}) => {
  const form = useForm({
    defaultValues: settings,
    values: settings
  });

  const onSubmit = (data: NotificationSettings) => {
    onUpdate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Paramètres de Notification
        </CardTitle>
        <CardDescription>
          Configurez les notifications pour votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="push">Push</TabsTrigger>
                <TabsTrigger value="slack">Slack</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notifications Email
                  </h4>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="emailNotifications.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvelle commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors d'une nouvelle commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.orderStatusChange"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Changement de statut de commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors du changement de statut d'une commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.newUser"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvel utilisateur</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors d'une nouvelle inscription
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.contactForm"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Formulaire de contact</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors d'un nouveau message de contact
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.lowStock"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Stock faible</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email quand un produit a un stock faible
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.newReview"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvel avis</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors d'un nouvel avis produit
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.refundRequest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Demande de remboursement</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email lors d'une demande de remboursement
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications.systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Alertes système</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un email pour les alertes système importantes
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Notifications SMS
                  </h4>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="smsNotifications.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvelle commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un SMS lors d'une nouvelle commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsNotifications.orderStatusChange"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Changement de statut de commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un SMS lors du changement de statut d'une commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsNotifications.systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Alertes système</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir un SMS pour les alertes système critiques
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="push" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications Push
                  </h4>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="pushNotifications.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvelle commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification push lors d'une nouvelle commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications.orderStatusChange"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Changement de statut de commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification push lors du changement de statut
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications.newUser"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvel utilisateur</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification push lors d'une nouvelle inscription
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications.newReview"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvel avis</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification push lors d'un nouvel avis
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications.systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Alertes système</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification push pour les alertes système
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="slack" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Slack className="h-4 w-4" />
                    Notifications Slack
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="slackNotifications.webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Webhook Slack</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://hooks.slack.com/services/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="slackNotifications.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvelle commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Slack lors d'une nouvelle commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slackNotifications.systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Alertes système</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Slack pour les alertes système
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slackNotifications.errorReports"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Rapports d'erreur</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Slack pour les erreurs
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="discord" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notifications Discord</h4>
                  
                  <FormField
                    control={form.control}
                    name="discordNotifications.webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Webhook Discord</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://discord.com/api/webhooks/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="discordNotifications.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Nouvelle commande</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Discord lors d'une nouvelle commande
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discordNotifications.systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Alertes système</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Discord pour les alertes système
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discordNotifications.errorReports"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Rapports d'erreur</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Envoyer une notification Discord pour les erreurs
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsForm;
