import React, { useEffect, useState } from 'react';
import { fetchBrands, createBrand, updateBrand, deleteBrand, fetchProducts } from '../api/api';

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

    const handleDelete = async (id) => {
        const ok = window.confirm('Bạn chắc chắn muốn xóa thương hiệu này?');
        if (!ok) return;

        try {
            //  Kiểm tra xem còn sản phẩm thuộc brand không
            const res = await fetchProducts({ brand: id });
            if (res.data.data.length > 0) {
                alert('Không thể xóa thương hiệu này vì vẫn còn sản phẩm thuộc thương hiệu');
                return;
            }

            //  Nếu không còn sản phẩm => xóa brand
            await deleteBrand(id);
            alert('Xóa thương hiệu thành công');
            loadBrands();
        } catch (err) {
            alert('Xóa thất bại hoặc không thể kiểm tra sản phẩm');
            console.error(err);
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
