import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api/api';

import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Lỗi khi tải chi tiết sản phẩm');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!product) return <Typography>Sản phẩm không tồn tại</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/products" variant="outlined" sx={{ mb: 2 }}>
        ← Quay lại danh sách
      </Button>

      <Typography variant="h4" gutterBottom>{product.name}</Typography>

      <Stack direction="row" spacing={4} flexWrap="wrap" mb={3}>
        {product.banner && (
          <Avatar
            src={product.banner}
            variant="rounded"
            sx={{ width: 300, height: 140, borderRadius: 2 }}
            alt="Banner"
          />
        )}
        {product.image && (
          <Avatar
            src={product.image}
            variant="rounded"
            sx={{ width: 150, height: 150, borderRadius: 2 }}
            alt="Ảnh sản phẩm"
          />
        )}
      </Stack>

      <Typography variant="h6">Giá: {product.price.toLocaleString()}</Typography>
      <Typography variant="body1" gutterBottom>
        Loại sản phẩm: {product.category?.name || 'Chưa có'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thương hiệu: {product.brand?.name || '-'}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Mô tả: {product.description || '-'}
      </Typography>

      <Box mt={2}>
        <Typography variant="subtitle1">Size:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {product.sizes && product.sizes.length > 0
            ? product.sizes.map(size => <Chip key={size} label={size} size="small" />)
            : '-'}
        </Stack>
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle1">Màu sắc:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {product.colors && product.colors.length > 0
            ? product.colors.map(color => <Chip key={color} label={color} size="small" />)
            : '-'}
        </Stack>
      </Box>
    </Box>
  );
}
