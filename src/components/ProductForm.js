import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, fetchCategories } from '../api/api';

import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Avatar,
} from '@mui/material';

export default function ProductForm({ product, onSuccess }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        fetchCategories().then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setCategory(product.category?._id || '');
            setPreview(product.image || '');
            setImageFile(null);
        } else {
            setName('');
            setPrice('');
            setCategory('');
            setPreview('');
            setImageFile(null);
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !price || !category) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const data = { name, price: parseFloat(price), category, imageFile };

        const action = product
            ? updateProduct(product._id, data)
            : createProduct(data);

        action.then(() => {
            onSuccess();
            setName('');
            setPrice('');
            setCategory('');
            setPreview('');
            setImageFile(null);
        }).catch(() => alert('Lỗi khi lưu sản phẩm'));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
        >
            <TextField
                label="Tên sản phẩm"
                variant="outlined"
                size="small"
                value={name}
                onChange={e => setName(e.target.value)}
                sx={{ minWidth: 200 }}
            />
            <TextField
                label="Giá"
                variant="outlined"
                size="small"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                sx={{ minWidth: 120 }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Loại sản phẩm</InputLabel>
                <Select
                    label="Loại sản phẩm"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Chọn loại sản phẩm</em>
                    </MenuItem>
                    {categories.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" component="label" size="small">
                Tải ảnh lên
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {preview && <Avatar src={preview} alt="Preview" sx={{ width: 56, height: 56 }} />}
            <Button variant="contained" color="primary" type="submit">
                {product ? 'Cập nhật' : 'Thêm'}
            </Button>
            {product && (
                <Button variant="outlined" color="secondary" onClick={() => onSuccess()}>
                    Hủy
                </Button>
            )}
        </Box>
    );
}
