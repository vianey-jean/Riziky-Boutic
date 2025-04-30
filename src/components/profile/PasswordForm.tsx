
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormProps {
  loading: boolean;
  onPasswordChange: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ loading, onPasswordChange }) => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{text: string, type: 'success' | 'error' | null}>({
    text: '', 
    type: null
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'currentPassword' && value.length > 0) {
      setIsVerifying(true);
      // Wait a bit before verifying to avoid too many requests while typing
      const timeoutId = setTimeout(async () => {
        try {
          if (!user?.id) {
            setVerificationMessage({
              text: 'Utilisateur non identifié',
              type: 'error'
            });
            setIsCurrentPasswordVerified(false);
            setIsVerifying(false);
            return;
          }

          const response = await authAPI.verifyPassword(user.id, value);
          setIsCurrentPasswordVerified(response.data.valid);
          
          if (response.data.valid) {
            setVerificationMessage({
              text: 'Mot de passe correct, vous pouvez procéder au changement',
              type: 'success'
            });
          } else {
            setVerificationMessage({
              text: 'Mot de passe actuel incorrect',
              type: 'error'
            });
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du mot de passe:", error);
          setVerificationMessage({
            text: 'Erreur lors de la vérification du mot de passe',
            type: 'error'
          });
          setIsCurrentPasswordVerified(false);
        } finally {
          setIsVerifying(false);
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les deux mots de passe ne correspondent pas');
      return;
    }
    
    if (!isCurrentPasswordVerified) {
      toast.error('Mot de passe actuel incorrect');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Le nouveau mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    // Vérifier si le nouveau mot de passe est différent de l'ancien
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }
    
    try {
      if (!user?.id) {
        toast.error('Utilisateur non identifié');
        return;
      }
      
      await authAPI.updatePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setVerificationMessage({ text: '', type: null });
      toast.success('Mot de passe mis à jour avec succès');
      onPasswordChange();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    }
  };

  useEffect(() => {
    // Minimum 8 chars with at least one uppercase, one lowercase, one number and one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordRegex.test(passwordData.newPassword));
  }, [passwordData.newPassword]);

  const passwordMatchesOld = passwordData.currentPassword === passwordData.newPassword;
  const passwordMatchesConfirmation = passwordData.newPassword === passwordData.confirmPassword;

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />
        {verificationMessage.text && (
          <Alert className={`mt-2 ${verificationMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <AlertDescription>{verificationMessage.text}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          disabled={!isCurrentPasswordVerified}
        />
        {passwordData.newPassword && (
          <PasswordStrengthIndicator password={passwordData.newPassword} />
        )}
        {passwordData.newPassword && passwordMatchesOld && isCurrentPasswordVerified && (
          <Alert className="mt-2 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>Le nouveau mot de passe doit être différent de l'ancien</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          disabled={!isCurrentPasswordVerified}
        />
        {passwordData.confirmPassword && passwordData.newPassword && !passwordMatchesConfirmation && (
          <Alert className="mt-2 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>Les mots de passe ne correspondent pas</AlertDescription>
          </Alert>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={
          loading || 
          !isCurrentPasswordVerified || 
          !isPasswordValid || 
          !passwordMatchesConfirmation ||
          passwordMatchesOld
        }
      >
        Mettre à jour le mot de passe
      </Button>
    </form>
  );
};

export default PasswordForm;
