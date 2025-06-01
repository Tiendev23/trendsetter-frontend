import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Chip,
  Stack,
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
      <Typography variant="h4" gutterBottom>
        Quản lý Sản phẩm
      </Typography>
      <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh sản phẩm</TableCell>
              <TableCell>Banner</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Loại sản phẩm</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  {p.image ? (
                    <Avatar
                      src={p.image}
                      alt={p.name}
                      variant="square"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="square" sx={{ width: 56, height: 56 }}>
                      ?
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  {p.banner ? (
                    <Avatar
                      src={p.banner}
                      alt={`${p.name} banner`}
                      variant="square"
                      sx={{ width: 120, height: 56, borderRadius: 1 }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Link to={`/products/${p._id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell>{p.price.toLocaleString()}</TableCell>
                <TableCell>{p.category?.name || 'Chưa có loại'}</TableCell>
                <TableCell>{p.brand?.name || '-'}</TableCell>
                <TableCell>{p.description || '-'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {p.sizes && p.sizes.length > 0
                      ? p.sizes.map((size) => (
                        <Chip key={size} label={size} size="small" />
                      ))
                      : '-'}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {p.colors && p.colors.length > 0
                      ? p.colors.map((color) => (
                        <Chip key={color} label={color} size="small" />
                      ))
                      : '-'}
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(p)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(p._id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
