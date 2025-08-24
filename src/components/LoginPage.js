// src/components/LoginPage.js (PHIÊN BẢN FIX LỖI)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, createUser } from '../api/api';
import {
  Container, Box, Typography, TextField, Button, CircularProgress, Alert
} from '@mui/material';

export default function LoginPage() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const navigate = useNavigate();

  // State đăng nhập
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // State đăng ký
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'admin',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);
    try {
      const response = await login(loginData);
      localStorage.setItem('token', response.data.token);
      navigate('/products');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setIsRegisterLoading(true);
    try {
      await createUser(registerData);
      setRegisterSuccess('Tạo tài khoản thành công! Vui lòng đăng nhập.');
      setRegisterData({ fullName: '', email: '', username: '', password: '', role: 'admin' });
      setTimeout(() => {
        setIsSignUpActive(false);
        setRegisterSuccess('');
      }, 2000);
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const primaryColor = '#45bc1b';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f5f7' }}>
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '768px',
          maxWidth: '100%',
          minHeight: '520px',
          borderRadius: '10px',
          boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
          p: '0 !important',
          background: '#fff',
        }}
      >
        {/* FORM ĐĂNG KÝ */}
        <Box
          sx={{
            ...formContainerStyles,
            left: 0,
            width: '50%',
            zIndex: 2,
            transform: isSignUpActive ? 'translateX(100%)' : 'translateX(-100%)',
            opacity: isSignUpActive ? 1 : 0,
            transition: 'all 0.6s ease-in-out',
            pointerEvents: isSignUpActive ? 'auto' : 'none', // Ngăn form bị click khi ẩn
          }}
        >
          <form onSubmit={handleRegisterSubmit}>
            <Typography variant="h4" fontWeight="bold" mb={2}>Tạo tài khoản</Typography>
            {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}
            {registerSuccess && <Alert severity="success" sx={{ mb: 2 }}>{registerSuccess}</Alert>}
            <TextField name="fullName" label="Họ và Tên" variant="filled" fullWidth margin="normal" onChange={handleRegisterChange} value={registerData.fullName} required />
            <TextField name="email" label="Email" type="email" variant="filled" fullWidth margin="normal" onChange={handleRegisterChange} value={registerData.email} required />
            <TextField name="username" label="Tên đăng nhập" variant="filled" fullWidth margin="normal" onChange={handleRegisterChange} value={registerData.username} required />
            <TextField name="password" label="Mật khẩu" type="password" variant="filled" fullWidth margin="normal" onChange={handleRegisterChange} value={registerData.password} required />
            <Button type="submit" variant="contained" sx={{ ...buttonStyles, mt: 2, background: primaryColor }} disabled={isRegisterLoading}>
              {isRegisterLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
            </Button>
          </form>
        </Box>

        {/* FORM ĐĂNG NHẬP */}
        <Box
          sx={{
            ...formContainerStyles,
            left: 0,
            width: '50%',
            zIndex: 3,
            transform: isSignUpActive ? 'translateX(100%)' : 'translateX(0)',
            opacity: isSignUpActive ? 0 : 1,
            transition: 'all 0.6s ease-in-out',
            pointerEvents: isSignUpActive ? 'none' : 'auto', // Chặn click khi bị ẩn
          }}
        >
          <form onSubmit={handleLoginSubmit}>
            <Typography variant="h4" fontWeight="bold" mb={2}>Đăng nhập Admin</Typography>
            {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
            <TextField name="username" label="Tên đăng nhập" variant="filled" fullWidth margin="normal" onChange={handleLoginChange} required />
            <TextField name="password" label="Mật khẩu" type="password" variant="filled" fullWidth margin="normal" onChange={handleLoginChange} required />
            <Button type="submit" variant="contained" sx={{ ...buttonStyles, background: primaryColor }} disabled={isLoginLoading}>
              {isLoginLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
            </Button>
          </form>
        </Box>

        {/* OVERLAY */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            transition: 'transform 0.6s ease-in-out',
            zIndex: 10,
            transform: isSignUpActive ? 'translateX(-100%)' : 'translateX(0)',
          }}
        >
          <Box
            sx={{
              background: primaryColor,
              backgroundImage: `linear-gradient(to right, ${primaryColor}, #81e655)`,
              color: '#fff',
              position: 'relative',
              left: '-100%',
              height: '100%',
              width: '200%',
              transition: 'transform 0.6s ease-in-out',
              transform: isSignUpActive ? 'translateX(50%)' : 'translateX(0)',
            }}
          >
            {/* PANEL TRÁI */}
            <Box sx={{ ...overlayPanelStyles, transform: 'translateX(0)' }}>
              <Typography variant="h4" fontWeight="bold">Chào mừng trở lại!</Typography>
              <Typography sx={{ p: '20px 0' }}>Đăng nhập để vào trang quản trị của bạn.</Typography>
              <Button variant="outlined" color="inherit" sx={buttonStyles} onClick={() => setIsSignUpActive(false)}>Đăng nhập</Button>
            </Box>

            {/* PANEL PHẢI */}
            <Box sx={{ ...overlayPanelStyles, right: 0, transform: 'translateX(0)' }}>
              <Typography variant="h4" fontWeight="bold">Chào mừng!</Typography>
              <Typography sx={{ p: '20px 0' }}>Chưa có tài khoản quản trị?<br />Hãy đăng ký tại đây.</Typography>
              <Button variant="outlined" color="inherit" sx={buttonStyles} onClick={() => setIsSignUpActive(true)}>Đăng ký</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const formContainerStyles = {
  position: 'absolute',
  top: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 50px',
  textAlign: 'center',
};

const buttonStyles = {
  borderRadius: '20px',
  border: '1px solid',
  borderColor: '#45bc1b',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '12px 45px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  '&:active': { transform: 'scale(0.95)' },
  '&.MuiButton-outlined': { borderColor: '#fff' },
};

const overlayPanelStyles = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '0 40px',
  textAlign: 'center',
  top: 0,
  height: '100%',
  width: '50%',
};
