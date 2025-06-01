import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: green[700],  // xanh lá đậm, bạn có thể chọn green[500], green[900] tùy ý
        },
        secondary: {
            main: green[300],  // màu xanh lá nhạt hơn, dùng cho nút hoặc highlight phụ
        },
    },
});

export default theme;
