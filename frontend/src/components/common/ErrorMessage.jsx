import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="p-4 rounded-full bg-danger/10">
        <AlertCircle className="w-12 h-12 text-danger" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Erro ao carregar dados
        </h3>
        <p className="text-text-secondary text-sm max-w-md">
          {message || 'Ocorreu um erro ao carregar os dados. Tente novamente.'}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
