import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../api/api';
import ProductForm from './ProductForm';

import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Avatar,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = () => {
        fetchProducts()
            .then(res => setProducts(res.data))
            .catch(() => alert('Lỗi khi tải danh sách sản phẩm'));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa?')) {
            deleteProduct(id)
                .then(() => loadProducts())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleFormSuccess = () => {
        setEditingProduct(null);
        loadProducts();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Quản lý Sản phẩm</Typography>
            <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Loại sản phẩm</TableCell>
                            <TableCell>Thương hiệu</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p._id}>
                                <TableCell>
                                    {p.image ? (
                                        <Avatar src={p.image} alt={p.name} variant="square" sx={{ width: 56, height: 56 }} />
                                    ) : (
                                        <Avatar variant="square" sx={{ width: 56, height: 56 }}>
                                            ?
                                        </Avatar>
                                    )}
                                </TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.price.toLocaleString()}</TableCell>
                                <TableCell>{p.category?.name || 'Chưa có loại'}</TableCell>
                                <TableCell>{p.brand?.name || '-'}</TableCell>
                                <TableCell>{p.description || '-'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
