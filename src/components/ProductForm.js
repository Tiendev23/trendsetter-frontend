import React, { useState, useEffect } from 'react';
import {
    createProduct, updateProduct, fetchLevelOneCategories, fetchSubCategories, fetchBrands
} from '../api/api';

import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Avatar,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Stack,
} from '@mui/material';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = ['Đỏ', 'Xanh', 'Vàng', 'Đen', 'Trắng'];

export default function ProductForm({ product, onSuccess }) {
    // Các state quản lý form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [parentCategory, setParentCategory] = useState(''); // loại cấp 1
    const [category, setCategory] = useState(''); // loại cấp 2
    const [categoriesLevelTwo, setCategoriesLevelTwo] = useState([]);
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [levelOneCategories, setLevelOneCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');

    useEffect(() => {
        fetchLevelOneCategories().then(res => setLevelOneCategories(res.data));
        fetchBrands().then(res => setBrands(res.data));
    }, []);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setParentCategory(product.category?.parent ? product.category.parent._id : '');
            setCategory(product.category?._id || '');
            setBrand(product.brand?._id || '');
            setDescription(product.description || '');
            setSizes(product.sizes || []);
            setColors(product.colors || []);
            setPreview(product.image || '');
            setImageFile(null);
            setBannerPreview(product.banner || '');
            setBannerFile(null);
        } else {
            setName('');
            setPrice('');
            setParentCategory('');
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

    // Khi parentCategory thay đổi, load danh sách cấp 2
    useEffect(() => {
        if (parentCategory) {
            fetchSubCategories(parentCategory).then(res => setCategoriesLevelTwo(res.data));
        } else {
            setCategoriesLevelTwo([]);
            setCategory('');
        }
    }, [parentCategory]);

    // Xử lý thay đổi file ảnh sản phẩm
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

    // Xử lý thay đổi file ảnh banner
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

    // Xử lý thay đổi size checkbox
    const handleSizeChange = (event) => {
        const size = event.target.name;
        if (event.target.checked) {
            setSizes(prev => [...prev, size]);
        } else {
            setSizes(prev => prev.filter(s => s !== size));
        }
    };

    // Xử lý thay đổi color checkbox
    const handleColorChange = (event) => {
        const color = event.target.name;
        if (event.target.checked) {
            setColors(prev => [...prev, color]);
        } else {
            setColors(prev => prev.filter(c => c !== color));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !price || !category) {
            alert('Vui lòng nhập đầy đủ thông tin (tên, giá, loại sản phẩm cấp 2)');
            return;
        }

        const data = {
            name,
            price: parseFloat(price),
            category,
            brand,
            description,
            sizes,
            colors,
            imageFile,
            bannerFile,
        };

        const action = product
            ? updateProduct(product._id, data)
            : createProduct(data);

        action.then(() => {
            onSuccess();
            setName('');
            setPrice('');
            setParentCategory('');
            setCategory('');
            setBrand('');
            setDescription('');
            setSizes([]);
            setColors([]);
            setPreview('');
            setImageFile(null);
            setBannerPreview('');
            setBannerFile(null);
        }).catch(() => alert('Lỗi khi lưu sản phẩm'));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}
        >
            <TextField
                label="Tên sản phẩm"
                variant="outlined"
                size="small"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            <TextField
                label="Giá"
                variant="outlined"
                size="small"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
            />

            {/* Chọn loại cấp 1 */}
            <FormControl variant="outlined" size="small" required>
                <InputLabel>Loại cấp 1</InputLabel>
                <Select
                    label="Loại cấp 1"
                    value={parentCategory}
                    onChange={e => setParentCategory(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Chọn loại cấp 1</em>
                    </MenuItem>
                    {levelOneCategories.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Chọn loại cấp 2 */}
            <FormControl variant="outlined" size="small" required disabled={!parentCategory}>
                <InputLabel>Loại cấp 2</InputLabel>
                <Select
                    label="Loại cấp 2"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Chọn loại cấp 2</em>
                    </MenuItem>
                    {categoriesLevelTwo.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined" size="small">
                <InputLabel>Thương hiệu</InputLabel>
                <Select
                    label="Thương hiệu"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Chọn thương hiệu</em>
                    </MenuItem>
                    {brands.map(b => (
                        <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Mô tả sản phẩm"
                variant="outlined"
                size="small"
                multiline
                minRows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            {/* Các phần còn lại giữ nguyên (size, color, ảnh, banner) như trước */}

            {/* ... phần checkbox chọn size, color và upload ảnh tương tự như code trước ... */}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label" size="small">
                    Tải ảnh sản phẩm
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>
                {preview && <Avatar src={preview} alt="Ảnh sản phẩm" sx={{ width: 56, height: 56 }} />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label" size="small">
                    Tải ảnh banner
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleBannerChange}
                    />
                </Button>
                {bannerPreview && <Avatar src={bannerPreview} alt="Ảnh banner" sx={{ width: 120, height: 56, borderRadius: 1 }} />}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" type="submit">
                    {product ? 'Cập nhật' : 'Thêm'}
                </Button>
                {product && (
                    <Button variant="outlined" color="secondary" onClick={() => onSuccess()}>
                        Hủy
                    </Button>
                )}
            </Box>
        </Box>
    );
}
