import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { EventFormData } from '../types/Event';
import { eventFormSchema } from '../schemas/eventSchema';

const AddEvent: React.FC = () => {
    const { addEvent, checkVenueDateCollision } = useEventContext();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        clearErrors,
    } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: '',
            description: '',
            venue: '',
            date: '',
            time: '',
            organizer: '',
            capacity: undefined,
        },
    });

    const watchedVenue = watch('venue');
    const watchedDate = watch('date');


    React.useEffect(() => {
        if (watchedVenue && watchedDate) {
            if (checkVenueDateCollision(watchedVenue, watchedDate)) {
                setError('venue', {
                    type: 'manual',
                    message: 'An event already exists at this venue on the selected date',
                });
                setError('date', {
                    type: 'manual',
                    message: 'An event already exists at this venue on the selected date',
                });
            } else {
                clearErrors(['venue', 'date']);
            }
        }
    }, [watchedVenue, watchedDate, checkVenueDateCollision, setError, clearErrors]);

    const onSubmit = (data: EventFormData) => {
        if (checkVenueDateCollision(data.venue, data.date)) {
            setError('venue', {
                type: 'manual',
                message: 'An event already exists at this venue on the selected date',
            });
            return;
        }

        addEvent(data);
        navigate('/');
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }} className="space-y-6">
            <Typography variant="h4" component="h1" gutterBottom className="text-gray-800 font-bold">
                Add New Event
            </Typography>

            <Paper sx={{ p: 4 }} className="shadow-soft bg-white rounded-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Event Title"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="venue"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Venue"
                                        fullWidth
                                        error={!!errors.venue}
                                        helperText={errors.venue?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.date}
                                        helperText={errors.date?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Time (Optional)"
                                        type="time"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="organizer"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Organizer (Optional)"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="capacity"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Capacity (Optional)"
                                        type="number"
                                        fullWidth
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }} className="pt-4">
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    Add Event
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddEvent; 