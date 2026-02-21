import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function ResponsiveAppBar({ title }) {

  return (
    <Box>
      <AppBar position="static" sx={{
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: 'background.default',
        color: 'text.secondary',
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button color="inherit"><AccountCircleIcon sx={{ fontSize: 30 }} /></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default ResponsiveAppBar;
