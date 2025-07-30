import React, { useEffect, useState } from 'react';
import {
    fetchLevelOneCategories,
    fetchSubCategories,
    deleteCategory,
} from '../api/api';

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
    IconButton,
    Collapse,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import CategoryForm from './CategoryForm';

export default function CategoryList() {
    const [levelOneCategories, setLevelOneCategories] = useState([]);
    const [openRows, setOpenRows] = useState({});
    const [subCategories, setSubCategories] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadLevelOneCategories();
    }, []);

    const loadLevelOneCategories = () => {
        fetchLevelOneCategories()
            .then(res => setLevelOneCategories(res.data))
            .catch(() => alert('Lỗi tải danh sách loại cấp 1'));
    };

    const loadSubCategories = (parentId) => {
        if (subCategories[parentId]) {
            setOpenRows(prev => ({ ...prev, [parentId]: !prev[parentId] }));
        } else {
            fetchSubCategories(parentId)
                .then(res => {
                    setSubCategories(prev => ({ ...prev, [parentId]: res.data }));
                    setOpenRows(prev => ({ ...prev, [parentId]: true }));
                })
                .catch(() => alert('Lỗi tải danh sách loại cấp 2'));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa loại sản phẩm này?')) {
            deleteCategory(id)
                .then(() => {
                    alert('Xóa thành công');
                    loadLevelOneCategories();
                    // Nếu có mở rộng, có thể reload subcategories nếu cần
                })
                .catch(() => alert('Xóa thất bại'));
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleFormSuccess = () => {
        setDialogOpen(false);
        loadLevelOneCategories();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Quản lý Loại sản phẩm
            </Typography>

            <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
                Thêm Loại sản phẩm
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Tên loại sản phẩm</TableCell>
                            <TableCell>Cấp cha</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {levelOneCategories.map(cat => (
                            <React.Fragment key={cat._id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => loadSubCategories(cat._id)}>
                                            {openRows[cat._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell>--</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(cat._id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse in={openRows[cat._id]} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Loại cấp 2
                                                </Typography>
                                                <Table size="small" aria-label="subcategories">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Tên loại cấp 2</TableCell>
                                                            <TableCell>Cấp cha</TableCell>
                                                            <TableCell>Hành động</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(subCategories[cat._id] || []).map(subCat => (
                                                            <TableRow key={subCat._id}>
                                                                <TableCell>{subCat.name}</TableCell>
                                                                <TableCell>{cat.name}</TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={() => handleEdit(subCat)}><EditIcon /></IconButton>
                                                                    <IconButton onClick={() => handleDelete(subCat._id)} color="error"><DeleteIcon /></IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog chứa form thêm/sửa */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingCategory ? 'Sửa Loại sản phẩm' : 'Thêm Loại sản phẩm'}</DialogTitle>
                <DialogContent>
                    <CategoryForm category={editingCategory} onSuccess={handleFormSuccess} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
