// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EventProvider } from "./context/EventContext";
import EventList from "./pages/EventList";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import Layout from "./components/Layout";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <EventProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<EventList />} />
                        <Route path="/add-event" element={<AddEvent />} />
                        <Route path="/edit-event/:id" element={<EditEvent />} />
                    </Routes>
                </Layout>
            </EventProvider>
        </ThemeProvider>
    );
};

export default App; 