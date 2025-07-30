import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

const navItems = [
    { text: 'Sản phẩm', path: '/products' },
    { text: 'Loại sản phẩm', path: '/categories' },
    { text: 'Thương hiệu', path: '/brands' },
    { text: 'Tài khoản', path: '/users' },
    { text: 'Đơn hàng', path: '/orders' },  // thêm mục đơn hàng
];


export default function Layout() {
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Admin Trendsetter
                    </Typography>
                </Toolbar>
                <List>
                    {navItems.map(({ text, path }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={path}
                                selected={location.pathname === path}
                            >
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Khoảng trống header */}
                <Outlet />
            </Box>
        </Box>
    );
}
