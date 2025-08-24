import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../api/api";
import ProductForm from "./ProductForm";

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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = () => {
    fetchProducts()
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("Lỗi khi tải danh sách sản phẩm"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      deleteProduct(id)
        .then(() => loadProducts())
        .catch(() => alert("Xóa thất bại"));
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

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
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá gốc</TableCell>
              <TableCell>Giá bán</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) =>
              product.variants.map((variant) => (
                <TableRow key={variant._id}>
                  <TableCell>
                    {variant.images?.length > 0 ? (
                      <Avatar
                        src={variant.images[0]}
                        alt={product.name}
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
                    <Link
                      to={`/products/${product._id}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{variant.basePrice?.toLocaleString()} ₫</TableCell>
                  <TableCell>{variant.finalPrice?.toLocaleString()} ₫</TableCell>
                  <TableCell>{product.category?.name || "Chưa có loại"}</TableCell>
                  <TableCell>{product.brand?.name || "-"}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description || "-",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={variant.color} size="small" />
                  </TableCell>
                  <TableCell>
                    {variant.inventories?.length > 0 ? (
                      <Stack direction="row" spacing={1}>
                        {variant.inventories.map((inv) => (
                          <Chip
                            key={inv._id}
                            label={`Size ${inv.size}`}
                            color={inv.stock === 0 ? "default" : "primary"}
                            variant={inv.stock === 0 ? "outlined" : "filled"}
                            size="small"
                            sx={{
                              opacity: inv.stock === 0 ? 0.5 : 1,
                              textDecoration: inv.stock === 0 ? "line-through" : "none",
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
