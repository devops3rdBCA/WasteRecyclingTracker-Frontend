import React, { useEffect, useMemo, useState } from 'react';
import {
  fetchFamilyEntries,
  createFamilyEntry,
  updateFamilyEntry,
  deleteFamilyEntry,
} from '../services/api';

const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronics'];

const FamilyDashboard = ({ familyName }) => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: 'Plastic', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadEntries = useMemo(() => async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchFamilyEntries(familyName);
      const sorted = (data || []).sort((a, b) => b.id - a.id);
      setEntries(sorted);
    } catch (err) {
      setError('Could not load entries.');
    } finally {
      setLoading(false);
    }
  }, [familyName]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const resetForm = () => {
    setForm({ type: 'Plastic', quantity: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantity) return;
    setError('');

    const payload = {
      familyName,
      wasteType: form.type,
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        const { data } = await updateFamilyEntry(editingId, payload);
        setEntries((prev) => prev.map((item) => (item.id === editingId ? data : item)));
      } else {
        const { data } = await createFamilyEntry(payload);
        setEntries((prev) => [data, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError('Save failed. Try again.');
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ type: entry.wasteType, quantity: entry.quantity });
  };

  const handleDelete = async (id) => {
    try {
      await deleteFamilyEntry(id);
      setEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Welcome, {familyName}</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadEntries} type="button">
          Refresh
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit Entry' : 'Add New Waste Entry'}</h5>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label">Waste Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  {wasteTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Quantity</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-3 d-grid gap-2 d-md-flex">
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update' : 'Submit'}
                </button>
                {editingId && (
                  <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Your Waste Entries</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Family Name</th>
                  <th>Waste Type</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.familyName}</td>
                    <td>{entry.wasteType}</td>
                    <td className="text-center">{entry.quantity}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        type="button"
                        onClick={() => handleEdit(entry)}
                      >
                        Edit
                      </button>
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
                    <td colSpan={4} className="text-center py-4">
                      {loading ? 'Loading...' : 'No entries yet.'}
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

export default FamilyDashboard;
