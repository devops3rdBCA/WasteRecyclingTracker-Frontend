import React, { useEffect, useMemo, useState } from 'react';
import {
  fetchAllEntries,
  updateEntryStatus,
  deleteEntry,
} from '../services/api';

const statuses = ['PENDING', 'PROCESSING', 'RECYCLED'];

const CenterDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadEntries = useMemo(() => async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchAllEntries();
      setEntries(data || []);
    } catch (err) {
      setError('Could not load submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleStatusChange = async (entryId, newStatus) => {
    try {
      await updateEntryStatus(entryId, newStatus);
      setEntries((prev) => {
        const updated = prev
          .map((item) => (item.id === entryId ? { ...item, status: newStatus } : item))
          .filter((item) => item.status !== 'RECYCLED');
        return updated;
      });
    } catch (err) {
      setError('Status update failed.');
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await deleteEntry(entryId);
      setEntries((prev) => prev.filter((item) => item.id !== entryId));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Recycling Center</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadEntries} type="button">
          Refresh
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Family</th>
                  <th>Waste Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td><strong>{entry.familyName}</strong></td>
                    <td>{entry.wasteType}</td>
                    <td>{entry.quantity}</td>
                    <td style={{ minWidth: 160 }}>
                      <select
                        className="form-select form-select-sm"
                        value={entry.status || 'PENDING'}
                        onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!entries.length && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      {loading ? 'Loading...' : 'No submissions yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDashboard;
