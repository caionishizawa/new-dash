import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LABELS } from '../../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary whitespace-nowrap">
                Bem-vindo, {user?.name || 'Cliente'}
              </h1>
              {user?.role === 'admin' && (
                <span className="text-xs text-accent font-medium">Painel Admin</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg">
              <User className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-primary font-medium">
                {user?.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-border transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{LABELS.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
