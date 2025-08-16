import React, { useEffect, useState, useCallback } from 'react';
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadProducts = useCallback(() => {
    const filters = {
      name: searchTerm,
      category: categoryFilter,
      brand: brandFilter,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    fetchProducts(filters)
      .then(res => setProducts(res.data))
      .catch(() => alert('Lỗi khi tải danh sách sản phẩm'));
  });

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, brandFilter, priceRange, loadProducts] );

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

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />

        <FormControl variant="outlined" size="small">
          <InputLabel>Loại sản phẩm</InputLabel>
          <Select
            label="Loại sản phẩm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {/* Add categories dynamically */}
            <MenuItem value="category1">Danh mục 1</MenuItem>
            <MenuItem value="category2">Danh mục 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small">
          <InputLabel>Thương hiệu</InputLabel>
          <Select
            label="Thương hiệu"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {/* Add brands dynamically */}
            <MenuItem value="brand1">Thương hiệu 1</MenuItem>
            <MenuItem value="brand2">Thương hiệu 2</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Giá (từ)"
          variant="outlined"
          type="number"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          label="Giá (đến)"
          variant="outlined"
          type="number"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
          size="small"
          sx={{ width: 100 }}
        />
      </Box>

      {/* Product Form */}
      <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />

      {/* Product Table */}
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
                <TableCell>  {p.price != null ? p.price.toLocaleString() : 'N/A'}</TableCell>
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
