import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/api';

import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserForm({ open, onClose, onSubmit, user }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('customer');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setPassword(''); // để trống nếu không đổi
            setEmail(user.email || '');
            setFullName(user.fullName || '');
            setRole(user.role || 'customer');
        } else {
            setUsername('');
            setPassword('');
            setEmail('');
            setFullName('');
            setRole('customer');
        }
    }, [user]);

    const handleSubmit = () => {
        if (!username || (!user && !password) || !email || !fullName) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        onSubmit({ username, password, email, fullName, role });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                    disabled={!!user} // không cho sửa username khi edit
                />
                <TextField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    {...(!user && { required: true })}
                    helperText={user ? 'Để trống nếu không đổi mật khẩu' : ''}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    type="email"
                />
                <TextField
                    label="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    select
                    label="Vai trò"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="customer">Khách hàng</MenuItem>
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {user ? 'Cập nhật' : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formOpen, setFormOpen] = useState(false);

    const loadUsers = () => {
        fetchUsers()
            .then(res => setUsers(res.data))
            .catch(() => alert('Lỗi khi tải danh sách tài khoản'));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAdd = () => {
        setEditingUser(null);
        setFormOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa tài khoản này?')) {
            deleteUser(id)
                .then(() => loadUsers())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleFormSubmit = (data) => {
        const action = editingUser ? updateUser(editingUser._id, data) : createUser(data);
        action
            .then(() => {
                setFormOpen(false);
                loadUsers();
            })
            .catch(err => {
                alert(err.response?.data?.message || 'Lỗi khi lưu tài khoản');
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Tài khoản Khách hàng
            </Typography>
            <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
                Thêm tài khoản
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên đăng nhập</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id}>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.fullName}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(u)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(u._id)} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <UserForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                user={editingUser}
            />
        </Box>
    );
}
