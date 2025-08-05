import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    IconButton,
    Box,
    Paper,
    Alert,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { Event } from '../types/Event';

const EventList: React.FC = () => {
    const { state, deleteEvent } = useEventContext();
    const navigate = useNavigate();

    const handleEdit = (event: Event) => {
        navigate(`/edit-event/${event.id}`);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteEvent(id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (state.events.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }} className="py-12">
                <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} className="text-gray-400" />
                <Typography variant="h5" color="text.secondary" gutterBottom className="text-gray-600 font-medium">
                    No Events Found
                </Typography>
                <Typography variant="body1" color="text.secondary" className="text-gray-500">
                    Start by adding your first event!
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="space-y-6">
            <Typography variant="h4" component="h1" gutterBottom className="text-gray-800 font-bold">
                Events
            </Typography>
            <Grid container spacing={3}>
                {state.events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                ...(event.isPast && {
                                    opacity: 0.7,
                                    backgroundColor: '#f5f5f5',
                                }),
                            }}
                            className={`transition-all duration-300 hover:shadow-medium ${event.isPast ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {event.title}
                                    </Typography>
                                    {event.isPast && (
                                        <Chip
                                            label="Past Event"
                                            color="default"
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {event.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EventIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(event.date)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {event.venue}
                                    </Typography>
                                </Box>

                                {event.time && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Time: {event.time}
                                    </Typography>
                                )}

                                {event.organizer && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Organizer: {event.organizer}
                                    </Typography>
                                )}

                                {event.capacity && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Capacity: {event.capacity} people
                                    </Typography>
                                )}
                            </CardContent>

                            <Box sx={{ p: 2, pt: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(event)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(event.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default EventList; 