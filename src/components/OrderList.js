import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, deleteOrder, updateOrderStatus } from '../api/api';
import OrderForm from './OrderForm';

import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    const loadOrders = () => {
        fetchOrders()
            .then(res => setOrders(res.data))
            .catch(() => alert('Lỗi khi tải danh sách đơn hàng'));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) {
            deleteOrder(id)
                .then(() => loadOrders())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleStatusChange = (id, status) => {
        updateOrderStatus(id, status)
            .then(() => loadOrders())
            .catch(() => alert('Cập nhật trạng thái thất bại'));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Đơn hàng
            </Typography>

            {/* Form tạo đơn hàng mới */}
            <OrderForm onSuccess={loadOrders} />

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            {/* <TableCell>Tổng tiền</TableCell> */}
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        {order._id}
                                    </Link>
                                </TableCell>
                                <TableCell>{order.user?.fullName || order.user?.username || '-'}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                {/* <TableCell>{order.totalPrice.toLocaleString()}</TableCell> */}
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="pending">Chờ xác nhận</MenuItem>
                                        <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                                        <MenuItem value="shipping">Đang giao hàng</MenuItem>
                                        <MenuItem value="delivered">Đã giao</MenuItem>
                                        <MenuItem value="cancelled">Đã hủy</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(order._id)} aria-label="delete">
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
