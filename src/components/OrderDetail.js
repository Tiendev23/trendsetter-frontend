import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../api/api';

import {
    TableContainer,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Chip,
    Select,
    MenuItem,
    Button,
    CircularProgress,
} from '@mui/material';

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrderById(id)
            .then(res => {
                setOrder(res.data);
                setStatus(res.data.status);
                setLoading(false);
            })
            .catch(() => {
                alert('Lỗi khi tải chi tiết đơn hàng');
                setLoading(false);
            });
    }, [id]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        updateOrderStatus(id, newStatus)
            .then(res => {
                setStatus(res.data.status);
                alert('Cập nhật trạng thái thành công');
            })
            .catch(() => alert('Cập nhật trạng thái thất bại'));
    };

    if (loading) return <CircularProgress />;
    if (!order) return <Typography>Đơn hàng không tồn tại</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Button component={Link} to="/orders" variant="outlined" sx={{ mb: 2 }}>
                ← Quay lại danh sách đơn hàng
            </Button>

            <Typography variant="h4" gutterBottom>
                Chi tiết đơn hàng #{order._id}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                Khách hàng: {order.user?.fullName || order.user?.username || '-'}
            </Typography>
            <Typography variant="body2" gutterBottom>Email: {order.user?.email || '-'}</Typography>
            <Typography variant="body2" gutterBottom>
                Địa chỉ giao hàng: {order.shippingAddress}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Ngày đặt: {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Sản phẩm trong đơn</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Màu</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Giá (1 sp)</TableCell>
                                <TableCell>Tổng tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.product?.name || 'Không xác định'}</TableCell>
                                    <TableCell>{item.size || '-'}</TableCell>
                                    <TableCell>{item.color || '-'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.price.toLocaleString()}</TableCell>
                                    <TableCell>{(item.price * item.quantity).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Tổng tiền: {order.totalPrice.toLocaleString()}</Typography>
            </Box>

            <Box sx={{ mt: 3, maxWidth: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Trạng thái đơn hàng
                </Typography>
                <Select
                    fullWidth
                    value={status}
                    onChange={handleStatusChange}
                    size="small"
                >
                    <MenuItem value="pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="shipping">Đang giao hàng</MenuItem>
                    <MenuItem value="delivered">Đã giao</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
            </Box>
        </Box>
    );
}
