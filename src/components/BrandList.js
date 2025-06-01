import React, { useEffect, useState } from 'react';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../api/api';

import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function BrandForm({ brand, onSuccess, onCancel }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (brand) {
            setName(brand.name);
        } else {
            setName('');
        }
    }, [brand]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Tên thương hiệu không được để trống');
            return;
        }

        const action = brand ? updateBrand(brand._id, { name }) : createBrand({ name });

        action.then(() => {
            onSuccess();
            setName('');
        }).catch(() => alert('Lỗi khi lưu thương hiệu'));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                label="Tên thương hiệu"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
                {brand ? 'Cập nhật' : 'Thêm'}
            </Button>
            {brand && (
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                    Hủy
                </Button>
            )}
        </Box>
    );
}

export default function BrandList() {
    const [brands, setBrands] = useState([]);
    const [editingBrand, setEditingBrand] = useState(null);

    const loadBrands = () => {
        fetchBrands()
            .then(res => setBrands(res.data))
            .catch(() => alert('Lỗi khi tải danh sách thương hiệu'));
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa thương hiệu này?')) {
            deleteBrand(id)
                .then(() => loadBrands())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
    };

    const handleFormSuccess = () => {
        setEditingBrand(null);
        loadBrands();
    };

    const handleCancel = () => {
        setEditingBrand(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Thương hiệu
            </Typography>
            <BrandForm brand={editingBrand} onSuccess={handleFormSuccess} onCancel={handleCancel} />
            <List>
                {brands.map(b => (
                    <ListItem
                        key={b._id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(b)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(b._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={b.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
