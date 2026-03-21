import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

const UserManagement = () => {
  const [familyName, setFamilyName] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const stored = JSON.parse(localStorage.getItem('family-users') || '[]');
    setUsers(stored);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!familyName.trim()) {
      setError('Family name is required.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('family-users') || '[]');
    if (users.length >= 10) {
      setError('Maximum 10 families allowed. Delete one to add another.');
      return;
    }

    if (users.some((u) => u.familyName.toLowerCase() === familyName.toLowerCase())) {
      setError('This family already exists.');
      return;
    }

    // Store family without a hard-coded password
    const newUser = { id: Date.now(), familyName: familyName.trim() };
    const updated = [...users, newUser];
    localStorage.setItem('family-users', JSON.stringify(updated));
    setUsers(updated);
    setSuccess(`${familyName} added successfully!`);
    setFamilyName('');
  };

  const handleDeleteUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    localStorage.setItem('family-users', JSON.stringify(updated));

    // Also delete their entries
    const familyToDelete = users.find((u) => u.id === id);
    if (familyToDelete) {
      localStorage.removeItem(`family-${familyToDelete.familyName}`);
    }

    setUsers(updated);
    setSuccess(`User deleted.`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" spacing={3}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>Add New Family User</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleAddUser}>
            <Stack spacing={2}>
              <TextField
                label="Family Name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                fullWidth
                placeholder="e.g., Smith, Patel, Johnson"
              />
              <Button type="submit" variant="contained">Add Family (Max 10)</Button>
            </Stack>
          </form>
        </Paper>

        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>Registered Families</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Family Name</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.familyName}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        aria-label="delete"
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {!users.length && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">No families registered yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Button variant="outlined" onClick={() => navigate('/')}>Back to Login</Button>
    </Container>
  );
};

export default UserManagement;
