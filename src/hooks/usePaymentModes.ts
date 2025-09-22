import { useState, useEffect } from 'react';
import { paymentModesAPI, PaymentModes } from '@/services/paymentModesAPI';
import { useToast } from '@/hooks/use-toast';

export const usePaymentModes = () => {
  const [paymentModes, setPaymentModes] = useState<PaymentModes | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadPaymentModes = async () => {
    try {
      setLoading(true);
      const data = await paymentModesAPI.getPaymentModes();
      setPaymentModes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des modes de paiement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modes de paiement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentModes = async (data: PaymentModes) => {
    try {
      setSaving(true);
      await paymentModesAPI.updatePaymentModes(data);
      setPaymentModes(data);
      
     toast({
  title: "Succès",
  description: "Modes de paiement sauvegardés avec succès",
  className: "bg-green-600 text-white", // 🔹 Fond vert + texte blanc
});

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modes de paiement",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPaymentModes();
  }, []);

  return {
    paymentModes,
    loading,
    saving,
    updatePaymentModes,
    reload: loadPaymentModes
  };
};