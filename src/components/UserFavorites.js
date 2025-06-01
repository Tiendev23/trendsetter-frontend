import React, { useEffect, useState } from 'react';
import { fetchUserFavorites, removeUserFavorite } from '../api/api';

import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Avatar,
    Stack,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

export default function UserFavorites({ userId }) {
    const [favorites, setFavorites] = useState([]);

    const loadFavorites = () => {
        fetchUserFavorites(userId)
            .then(res => setFavorites(res.data))
            .catch(() => alert('Lỗi khi tải danh sách yêu thích'));
    };

    useEffect(() => {
        if (userId) loadFavorites();
    }, [userId]);

    const handleRemove = (productId) => {
        if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này khỏi yêu thích?')) {
            removeUserFavorite(userId, productId)
                .then(() => loadFavorites())
                .catch(() => alert('Xóa thất bại'));
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Sản phẩm yêu thích
            </Typography>
            <List>
                {favorites.length === 0 && <Typography>Chưa có sản phẩm yêu thích.</Typography>}
                {favorites.map(p => (
                    <ListItem
                        key={p._id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(p._id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={p.image} variant="square" sx={{ width: 64, height: 64 }} />
                            <ListItemText
                                primary={p.name}
                                secondary={`Giá: ${p.price.toLocaleString()}`}
                            />
                        </Stack>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
