import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Event Manager
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/')}
                        style={{ marginRight: 10 }}
                    >
                        Events
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/add-event')}
                    >
                        Add Event
                    </Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: 20, marginBottom: 20 }}>
                {children}
            </Container>
        </div>
    );
};

export default Layout; 