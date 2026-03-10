import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select';

const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronics'];
const statuses = ['Pending', 'Processing', 'Recycled'];

const FieldTable = ({ role = 'view', familyName = '' }) => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: 'Plastic', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadAllEntries = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('family-') && k !== 'family-users');
    const allEntries = [];
    keys.forEach((key) => {
      const familyEntries = JSON.parse(localStorage.getItem(key) || '[]');
      allEntries.push(...familyEntries);
    });
    allEntries.sort((a, b) => {
      if (a.familyName !== b.familyName) {
        return a.familyName.localeCompare(b.familyName);
      }
      return b.id - a.id;
    });
    setEntries(allEntries);
  };

  useEffect(() => {
    loadAllEntries();
  }, []);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!form.quantity || !familyName.trim()) return;
    setError('');

    const familyKey = `family-${familyName}`;
    const familyEntries = JSON.parse(localStorage.getItem(familyKey) || '[]');

    // Check if same waste type already exists for this family
    const existingIndex = familyEntries.findIndex(
      (entry) => entry.wasteType.toLowerCase() === form.type.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Update existing entry - add to quantity instead of creating duplicate
      familyEntries[existingIndex].quantity += Number(form.quantity);
      localStorage.setItem(familyKey, JSON.stringify(familyEntries));
      
      // Update in entries state
      setEntries((prev) =>
        prev.map((item) =>
          item.id === familyEntries[existingIndex].id
            ? { ...item, quantity: familyEntries[existingIndex].quantity }
            : item
        )
      );
      setError('');
    } else {
      // Create new entry
      const newEntry = { 
        id: Date.now(), 
        familyName, 
        wasteType: form.type, 
        quantity: Number(form.quantity), 
        status: 'Pending' 
      };

      familyEntries.push(newEntry);
      localStorage.setItem(familyKey, JSON.stringify(familyEntries));

      setEntries((prev) => [...prev, newEntry].sort((a, b) => {
        if (a.familyName !== b.familyName) {
          return a.familyName.localeCompare(b.familyName);
        }
        return b.id - a.id;
      }));
    }

    setForm({ type: 'Plastic', quantity: '' });
  };

  const handleEdit = (entry) => {
    if (role !== 'family' || entry.familyName.toLowerCase() !== familyName.toLowerCase()) {
      setError('You can only edit your own entries.');
      return;
    }
    setEditingId(entry.id);
    setForm({ type: entry.wasteType, quantity: entry.quantity });
  };

  const handleUpdateEntry = (e) => {
    e.preventDefault();
    if (!form.quantity) return;

    const entry = entries.find((e) => e.id === editingId);
    if (entry.familyName.toLowerCase() !== familyName.toLowerCase()) {
      setError('You can only edit your own entries.');
      return;
    }

    // Check if changing to a waste type that already exists
    const familyKey = `family-${entry.familyName}`;
    const familyEntries = JSON.parse(localStorage.getItem(familyKey) || '[]');
    const editIdx = familyEntries.findIndex((e) => e.id === editingId);
    
    const isDuplicateType = familyEntries.some(
      (e) => e.id !== editingId && e.wasteType.toLowerCase() === form.type.toLowerCase()
    );

    if (isDuplicateType) {
      setError(`You already have ${form.type} in your list. Edit that entry instead.`);
      return;
    }

    if (editIdx >= 0) {
      familyEntries[editIdx] = { ...familyEntries[editIdx], wasteType: form.type, quantity: Number(form.quantity) };
      localStorage.setItem(familyKey, JSON.stringify(familyEntries));
      setEntries((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, wasteType: form.type, quantity: Number(form.quantity) } : item))
      );
    }
    setEditingId(null);
    setForm({ type: 'Plastic', quantity: '' });
  };

  const handleDeleteEntry = (id) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    if (role === 'family' && entry.familyName.toLowerCase() !== familyName.toLowerCase()) {
      setError('You can only delete your own entries.');
      return;
    }

    const familyKey = `family-${entry.familyName}`;
    const familyEntries = JSON.parse(localStorage.getItem(familyKey) || '[]');
    const updated = familyEntries.filter((e) => e.id !== id);
    localStorage.setItem(familyKey, JSON.stringify(updated));
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    if (role !== 'center') return;

    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const familyKey = `family-${entry.familyName}`;
    const familyEntries = JSON.parse(localStorage.getItem(familyKey) || '[]');
    const idx = familyEntries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      familyEntries[idx].status = newStatus;
      localStorage.setItem(familyKey, JSON.stringify(familyEntries));
      setEntries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {role === 'family' && (
        <>
          <Typography variant="h5" gutterBottom>Welcome, {familyName}</Typography>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {editingId 
                ? `Update Entry: ${entries.find(e => e.id === editingId)?.wasteType || ''}`
                : 'Add New Waste Entry'
              }
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            <form onSubmit={editingId ? handleUpdateEntry : handleAddEntry}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  select
                  label="Waste Type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  sx={{ flex: 1 }}
                >
                  {wasteTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  inputProps={{ min: 0 }}
                  sx={{ flex: 1 }}
                />
                <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: 'flex-end' }}>
                  <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                    {editingId ? 'Update' : 'Submit'}
                  </Button>
                  {editingId && (
                    <Button variant="outlined" onClick={() => { setEditingId(null); setForm({ type: 'Plastic', quantity: '' }); setError(''); }} sx={{ flex: 1 }}>
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Stack>
            </form>
          </Paper>
        </>
      )}

      {role === 'center' && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">All Families - Field Report & Management</Typography>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={loadAllEntries}>
            Refresh
          </Button>
        </Stack>
      )}

      <Paper sx={{ p: 3, overflowX: 'auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Family Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Waste Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Quantity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                // Filter entries based on role
                const filteredEntries = role === 'family' 
                  ? entries.filter((e) => e.familyName.toLowerCase() === familyName.toLowerCase())
                  : entries;

                return filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => {
                    const isOwnEntry = role === 'family' && entry.familyName.toLowerCase() === familyName.toLowerCase();
                    const canEdit = isOwnEntry;
                    const canDelete = isOwnEntry || role === 'center';
                    const canUpdateStatus = role === 'center';

                    return (
                      <TableRow 
                        key={entry.id} 
                        hover
                        sx={{ backgroundColor: isOwnEntry ? '#fff3e0' : 'transparent' }}
                      >
                        <TableCell sx={{ fontWeight: isOwnEntry ? 'bold' : '500' }}>
                          {entry.familyName}
                          {isOwnEntry && <span style={{ color: '#f57c00', marginLeft: '8px' }}>(You)</span>}
                        </TableCell>
                        <TableCell>{entry.wasteType}</TableCell>
                        <TableCell align="center">{entry.quantity}</TableCell>
                        <TableCell>
                          {canUpdateStatus ? (
                            <Select
                              size="small"
                              value={entry.status || 'Pending'}
                              onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                              sx={{ minWidth: '120px' }}
                            >
                              {statuses.map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor:
                                  entry.status === 'Recycled'
                                    ? '#4caf50'
                                    : entry.status === 'Processing'
                                    ? '#ff9800'
                                    : '#2196f3',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {entry.status || 'Pending'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: '12px' }}>
                          {new Date(entry.id).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {canEdit && (
                            <IconButton 
                              onClick={() => handleEdit(entry)} 
                              aria-label="edit" 
                              size="small" 
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {canDelete && (
                            <IconButton 
                              onClick={() => handleDeleteEntry(entry.id)} 
                              aria-label="delete" 
                              size="small" 
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        {role === 'family' ? 'No entries yet. Add your first waste entry above!' : 'No entries yet'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack sx={{ mt: 3 }}>
        <Typography variant="body2" color="textSecondary">
          {(() => {
            const filteredEntries = role === 'family' 
              ? entries.filter((e) => e.familyName.toLowerCase() === familyName.toLowerCase())
              : entries;
            return (
              <>
                Total Entries: <strong>{filteredEntries.length}</strong> | 
                Pending: <strong>{filteredEntries.filter((e) => !e.status || e.status === 'Pending').length}</strong> |
                Processing: <strong>{filteredEntries.filter((e) => e.status === 'Processing').length}</strong> |
                Recycled: <strong>{filteredEntries.filter((e) => e.status === 'Recycled').length}</strong>
              </>
            );
          })()}
        </Typography>
      </Stack>
    </Container>
  );
};

export default FieldTable;
