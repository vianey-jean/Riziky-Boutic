
import React from 'react';
import { Check, X, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PasswordStrengthIndicatorProps = {
  password: string;
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const requirements = [
    { 
      label: 'Au moins 8 caractères', 
      met: password.length >= 8,
      icon: Lock
    },
    { 
      label: 'Au moins 1 majuscule', 
      met: /[A-Z]/.test(password),
      icon: Shield
    },
    { 
      label: 'Au moins 1 minuscule', 
      met: /[a-z]/.test(password),
      icon: Shield
    },
    { 
      label: 'Au moins 1 chiffre', 
      met: /[0-9]/.test(password),
      icon: Shield
    },
    { 
      label: 'Au moins 1 caractère spécial', 
      met: /[^A-Za-z0-9]/.test(password),
      icon: Shield
    },
  ];

  const strengthScore = requirements.filter(req => req.met).length;
  const strengthPercentage = (strengthScore / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthScore <= 2) return 'from-red-500 to-red-600';
    if (strengthScore <= 4) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-green-600';
  };

  const getStrengthLabel = () => {
    if (strengthScore <= 2) return 'Faible';
    if (strengthScore <= 4) return 'Moyen';
    return 'Fort';
  };

  return (
    <motion.div 
      className="mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Force du mot de passe
            </h4>
          </div>
          <motion.span 
            className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getStrengthColor()} text-white shadow-sm`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {getStrengthLabel()}
          </motion.span>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getStrengthColor()} shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${strengthPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>{strengthPercentage.toFixed(0)}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
            Critères de sécurité :
          </p>
          <ul className="space-y-2">
            <AnimatePresence>
              {requirements.map((req, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      req.met 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-sm' 
                        : 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {req.met ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                    )}
                  </motion.div>
                  <span className={`text-xs transition-colors duration-200 ${
                    req.met 
                      ? 'text-green-700 dark:text-green-400 font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {req.label}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {/* Message de conseil */}
        {strengthScore < 5 && (
          <motion.div 
            className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 Un mot de passe fort protège mieux votre compte
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PasswordStrengthIndicator;