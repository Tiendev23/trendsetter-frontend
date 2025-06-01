import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../api/api';
import CategoryForm from './CategoryForm';

import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);

    const loadCategories = () => {
        fetchCategories()
            .then(res => setCategories(res.data))
            .catch(() => alert('Lỗi khi tải danh sách loại sản phẩm'));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa?')) {
            deleteCategory(id)
                .then(() => loadCategories())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
    };

    const handleFormSuccess = () => {
        setEditingCategory(null);
        loadCategories();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Quản lý Loại sản phẩm</Typography>
            <CategoryForm category={editingCategory} onSuccess={handleFormSuccess} />
            <List>
                {categories.map(c => (
                    <ListItem
                        key={c._id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(c)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(c._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={c.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
