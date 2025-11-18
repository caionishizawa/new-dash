import React from 'react';
import { Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { LABELS } from '../../utils/constants';

const ClientList = ({ clients }) => {
  if (!clients || clients.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          {LABELS.clients}
        </h3>
        <p className="text-text-muted text-center py-8">{LABELS.noData}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        {LABELS.clients} ({clients.length})
      </h3>

      <div className="space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-border transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-text-primary">{client.name}</h4>
                {client.role === 'admin' && (
                  <span className="badge bg-accent/10 text-accent">Admin</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                <span>{client.email}</span>
                <span>•</span>
                <span>Entrada: {formatDate(client.entryDate)}</span>
              </div>
            </div>

            <Link
              to={`/dashboard/${client.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{LABELS.viewDashboard}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
