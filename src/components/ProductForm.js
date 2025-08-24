import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, fetchCategories, fetchBrands } from '../api/api';
import {
    Box, Button, TextField, MenuItem, Select, InputLabel, FormControl,
    Avatar, FormGroup, FormControlLabel, Checkbox, Typography
} from '@mui/material';

const AVAILABLE_SIZES = ["38", "39", "40", "41", "42", "49"];
const AVAILABLE_COLORS = ['Đỏ', 'Xanh', 'Vàng', 'Đen', 'Trắng'];

export default function ProductForm({ product, onSuccess }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');

    useEffect(() => {
        fetchCategories().then(res => setCategories(res.data));
        fetchBrands().then(res => setBrands(res.data));
    }, []);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setCategory(product.category?._id || '');
            setBrand(product.brand?._id || '');
            setDescription(product.description || '');
            setSizes(product.sizes || []);
            setColors(product.colors || []);
            setPreview(product.image || '');
            setBannerPreview(product.banner || '');
            setImageFile(null);
            setBannerFile(null);
        } else {
            setName('');
            setPrice('');
            setCategory('');
            setBrand('');
            setDescription('');
            setSizes([]);
            setColors([]);
            setPreview('');
            setImageFile(null);
            setBannerPreview('');
            setBannerFile(null);
        }
    }, [product]);

    const handleSizeChange = (e) => {
        const s = e.target.name;
        setSizes(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s));
    };

    const handleColorChange = (e) => {
        const c = e.target.name;
        setColors(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c));
    };

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

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        setBannerFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBannerPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setBannerPreview('');
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || colors.length === 0 || sizes.length === 0) {
        alert('Vui lòng nhập đầy đủ thông tin, chọn size và màu');
        return;
    }

    try {
        const variants = colors.map(color => ({
            color,
            basePrice: parseFloat(price),
            inventories: sizes.map(size => ({ size: parseInt(size), stock: 10 })) // stock mặc định
        }));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        if (brand) formData.append('brand', brand);
        formData.append('description', description || '');
        formData.append('variants', JSON.stringify(variants));

        colors.forEach((color, index) => {
            if (imageFile) formData.append(`images_${index}`, imageFile);
        });

        if (bannerFile) formData.append('banner', bannerFile);

        const action = product
            ? updateProduct(product._id, formData)
            : createProduct(formData);

        const res = await action;

        alert('Lưu sản phẩm thành công');
        onSuccess?.();

        // Reset form
        setName('');
        setPrice('');
        setCategory('');
        setBrand('');
        setDescription('');
        setSizes([]);
        setColors([]);
        setPreview('');
        setImageFile(null);
        setBannerPreview('');
        setBannerFile(null);

    } catch (err) {
        console.error('Lỗi khi lưu sản phẩm:', err.response || err);
        if (err.response?.data?.message) {
            alert(`Lỗi: ${err.response.data.message}`);
        } else {
            alert('Lỗi khi lưu sản phẩm');
        }
    }
};



    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
            <TextField label="Tên sản phẩm" variant="outlined" size="small" value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Giá" variant="outlined" size="small" type="number" value={price} onChange={e => setPrice(e.target.value)} required />

            <FormControl size="small" required>
                <InputLabel>Loại sản phẩm</InputLabel>
                <Select value={category} onChange={e => setCategory(e.target.value)}>
                    <MenuItem value=""><em>Chọn loại</em></MenuItem>
                    {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl size="small">
                <InputLabel>Thương hiệu</InputLabel>
                <Select value={brand} onChange={e => setBrand(e.target.value)}>
                    <MenuItem value=""><em>Chọn thương hiệu</em></MenuItem>
                    {brands.map(b => <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
                </Select>
            </FormControl>

            <TextField label="Mô tả" variant="outlined" size="small" multiline minRows={3} value={description} onChange={e => setDescription(e.target.value)} />

            <Box>
                <Typography variant="subtitle2">Chọn Size</Typography>
                <FormGroup row>
                    {AVAILABLE_SIZES.map(s => (
                        <FormControlLabel key={s} control={<Checkbox checked={sizes.includes(s)} onChange={handleSizeChange} name={s} />} label={s} />
                    ))}
                </FormGroup>
            </Box>

            <Box>
                <Typography variant="subtitle2">Chọn Màu</Typography>
                <FormGroup row>
                    {AVAILABLE_COLORS.map(c => (
                        <FormControlLabel key={c} control={<Checkbox checked={colors.includes(c)} onChange={handleColorChange} name={c} />} label={c} />
                    ))}
                </FormGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label">
                    Ảnh sản phẩm
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {preview && <Avatar src={preview} sx={{ width: 56, height: 56 }} />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label">
                    Banner
                    <input type="file" hidden accept="image/*" onChange={handleBannerChange} />
                </Button>
                {bannerPreview && <Avatar src={bannerPreview} sx={{ width: 120, height: 56, borderRadius: 1 }} />}
            </Box>

            <Button variant="contained" color="primary" type="submit">{product ? 'Cập nhật' : 'Thêm'}</Button>
        </Box>
    );
}
