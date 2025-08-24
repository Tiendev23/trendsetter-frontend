import React, { useState, useEffect } from 'react';
import {
    TableContainer, Box, Button, TextField, Typography, MenuItem, Select,
    FormControl, InputLabel, Table, TableBody, TableCell, TableHead,
    TableRow, IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, fetchProducts, createOrder } from '../api/api';

export default function OrderForm({ onSuccess }) {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        fetchUsers().then(res => setUsers(res.data));
        fetchProducts()
            .then(res => setProducts(Array.isArray(res.data?.data) ? res.data.data : []))
            .catch(console.error);
    }, []);

    const handleAddItem = () => {
        setOrderItems(prev => [...prev, { product: '', variant: '', quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        setOrderItems(prev => {
            const newItems = [...prev];
            newItems[index][field] = value;
            // reset variant if product changes
            if (field === 'product') newItems[index].variant = '';
            return newItems;
        });
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => {
            const prod = products.find(p => p._id === item.product);
            if (!prod) return total;
            const variant = prod.variants.find(v => v._id === item.variant);
            const price = variant?.finalPrice || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser || !shippingAddress || orderItems.length === 0) {
            alert('Vui lòng nhập đầy đủ thông tin đơn hàng');
            return;
        }
        for (const item of orderItems) {
            if (!item.product || !item.variant || item.quantity < 1) {
                alert('Vui lòng chọn sản phẩm, biến thể và số lượng hợp lệ');
                return;
            }
        }

        const itemsForApi = orderItems.map(item => {
            const prod = products.find(p => p._id === item.product);
            const variant = prod.variants.find(v => v._id === item.variant);
            return {
                product: prod._id,
                variant: variant._id,
                quantity: Number(item.quantity),
                size: variant.inventories?.[0]?.size || '', 
                color: variant.color,
                price: variant.finalPrice
            };
        });

        const data = {
            user: selectedUser,
            shippingAddress,
            items: itemsForApi,
            totalPrice: calculateTotalPrice()
        };

        createOrder(data)
            .then(() => {
                alert('Tạo đơn hàng thành công');
                setSelectedUser('');
                setShippingAddress('');
                setOrderItems([]);
                onSuccess();
            })
            .catch(() => alert('Lỗi khi tạo đơn hàng'));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Tạo đơn hàng mới</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Khách hàng</InputLabel>
                <Select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                    {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>{user.fullName} ({user.username})</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Địa chỉ giao hàng"
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                fullWidth required sx={{ mb: 2 }}
            />

            <Button variant="outlined" onClick={handleAddItem} sx={{ mb: 1 }}>Thêm sản phẩm</Button>

            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>Biến thể</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Tổng</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItems.map((item, idx) => {
                            const prod = products.find(p => p._id === item.product);
                            const variant = prod?.variants.find(v => v._id === item.variant);
                            const price = variant?.finalPrice || 0;
                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Select
                                            value={item.product}
                                            onChange={e => handleItemChange(idx, 'product', e.target.value)}
                                            required size="small" sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value=""><em>Chọn sản phẩm</em></MenuItem>
                                            {products.map(p => (
                                                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <Select
                                            value={item.variant}
                                            onChange={e => handleItemChange(idx, 'variant', e.target.value)}
                                            required size="small" sx={{ minWidth: 150 }}
                                            disabled={!item.product}
                                        >
                                            <MenuItem value=""><em>Chọn màu</em></MenuItem>
                                            {products.find(p => p._id === item.product)?.variants.map(v => (
                                                <MenuItem key={v._id} value={v._id}>{v.color}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <Select
                                            value={item.size}
                                            onChange={e => handleItemChange(idx, 'size', e.target.value)}
                                            required size="small" sx={{ minWidth: 70 }}
                                            disabled={!item.variant}
                                        >
                                            <MenuItem value=""><em>Chọn size</em></MenuItem>
                                            {products.find(p => p._id === item.product)
                                                ?.variants.find(v => v._id === item.variant)
                                                ?.inventories.map(inv => (
                                                    <MenuItem key={inv._id} value={inv.size}>{inv.size}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                                            inputProps={{ min: 1 }}
                                            size="small" required sx={{ width: 70 }}
                                        />
                                    </TableCell>

                                    <TableCell>{price.toLocaleString()}</TableCell>
                                    <TableCell>{(price * item.quantity).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleRemoveItem(idx)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom>
                Tổng tiền: {calculateTotalPrice().toLocaleString()}
            </Typography>

            <Button type="submit" variant="contained" color="primary">Tạo đơn hàng</Button>
        </Box>
    );
}
