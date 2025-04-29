
import React from 'react';
import { Check, X } from 'lucide-react';

type PasswordStrengthIndicatorProps = {
  password: string;
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const requirements = [
    { label: 'Au moins 8 caractères', met: password.length >= 8 },
    { label: 'Au moins 1 majuscule', met: /[A-Z]/.test(password) },
    { label: 'Au moins 1 minuscule', met: /[a-z]/.test(password) },
    { label: 'Au moins 1 chiffre', met: /[0-9]/.test(password) },
    { label: 'Au moins 1 caractère spécial', met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2">
      <p className="text-sm font-medium mb-2">Le mot de passe doit contenir:</p>
      <ul className="space-y-1 text-sm">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            {req.met ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;