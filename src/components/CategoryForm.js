import React, { useState, useEffect } from 'react';
import { fetchLevelOneCategories, createCategory, updateCategory } from '../api/api';

import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

export default function CategoryForm({ category, onSuccess }) {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [levelOneCategories, setLevelOneCategories] = useState([]);

  useEffect(() => {
    fetchLevelOneCategories()
      .then(res => setLevelOneCategories(res.data))
      .catch(() => alert('Lỗi tải danh mục cấp 1'));
  }, []);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParent(category.parent || '');
    } else {
      setName('');
      setParent('');
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên loại sản phẩm');
      return;
    }
    const data = { name, parent: parent || null };

    const action = category
      ? updateCategory(category._id, data)
      : createCategory(data);

    action
      .then(() => {
        onSuccess();
        setName('');
        setParent('');
      })
      .catch(() => alert('Lỗi khi lưu loại sản phẩm'));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        label="Tên loại sản phẩm"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        sx={{ flexGrow: 1, minWidth: 200 }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Loại cha (cấp 1)</InputLabel>
        <Select
          value={parent}
          label="Loại cha (cấp 1)"
          onChange={e => setParent(e.target.value)}
        >
          <MenuItem value="">
            <em>Không có (cấp 1)</em>
          </MenuItem>
          {levelOneCategories.map(c => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" type="submit" sx={{ minWidth: 120 }}>
        {category ? 'Cập nhật' : 'Thêm'}
      </Button>
    </Box>
  );
}
