import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../api/api';

import { Box, Button, TextField } from '@mui/material';

export default function CategoryForm({ category, onSuccess }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName('');
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Tên loại sản phẩm không được để trống');
            return;
        }

        const data = { name };

        const action = category
            ? updateCategory(category._id, data)
            : createCategory(data);

        action.then(() => {
            onSuccess();
            setName('');
        }).catch(() => alert('Lỗi khi lưu loại sản phẩm'));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                label="Tên loại sản phẩm"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
                {category ? 'Cập nhật' : 'Thêm'}
            </Button>
            {category && (
                <Button variant="outlined" color="secondary" onClick={() => onSuccess()}>
                    Hủy
                </Button>
            )}
        </Box>
    );
}
