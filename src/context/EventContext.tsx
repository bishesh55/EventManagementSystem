import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Event } from '../types/Event';

interface EventState {
    events: Event[];
    loading: boolean;
    error: string | null;
}

interface EventAction {
    type: 'ADD_EVENT' | 'UPDATE_EVENT' | 'DELETE_EVENT' | 'LOAD_EVENTS' | 'SET_ERROR';
    payload: Event | Event[] | string;
}

interface EventContextType {
    state: EventState;
    addEvent: (event: Omit<Event, 'id' | 'isPast'>) => void;
    updateEvent: (id: string, event: Omit<Event, 'id' | 'isPast'>) => void;
    deleteEvent: (id: string) => void;
    checkVenueDateCollision: (venue: string, date: string, excludeId?: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Loading all tge  initial states from the localStorage
const getInitialState = (): EventState => {
    try {
        const savedEvents = localStorage.getItem('events');
        if (savedEvents) {
            const events = JSON.parse(savedEvents);
            const updatedEvents = events.map((event: Event) => ({
                ...event,
                isPast: new Date(event.date) < new Date(),
            }));
            return {
                events: updatedEvents,
                loading: false,
                error: null,
            };
        }
    } catch (error) {
        console.error('Error loading events from localStorage:', error);
    }

    return {
        events: [],
        loading: false,
        error: null,
    };
};

const initialState: EventState = getInitialState();

const eventReducer = (state: EventState, action: EventAction): EventState => {
    switch (action.type) {
        case 'ADD_EVENT':
            return {
                ...state,
                events: [...state.events, action.payload as Event],
            };
        case 'UPDATE_EVENT':
            const updatedEvent = action.payload as Event;
            return {
                ...state,
                events: state.events.map(event =>
                    event.id === updatedEvent.id ? updatedEvent : event
                ),
            };
        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter(event => event.id !== action.payload),
            };
        case 'LOAD_EVENTS':
            return {
                ...state,
                events: action.payload as Event[],
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload as string,
            };
        default:
            return state;
    }
};

interface EventProviderProps {
    children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(eventReducer, initialState);

    // Saving the  events to localStorage when event changes
    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(state.events));
    }, [state.events]);

    useEffect(() => {
        const updatePastEvents = () => {
            const updatedEvents = state.events.map(event => ({
                ...event,
                isPast: new Date(event.date) < new Date(),
            }));

           
            const hasChanges = updatedEvents.some((event, index) =>
                event.isPast !== state.events[index]?.isPast
            );

            if (hasChanges) {
                dispatch({ type: 'LOAD_EVENTS', payload: updatedEvents });
            }
        };
        updatePastEvents();
        const interval = setInterval(updatePastEvents, 60000);

        return () => clearInterval(interval);
    }, [state.events]);

    const addEvent = (eventData: Omit<Event, 'id' | 'isPast'>) => {
        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(),
            isPast: new Date(eventData.date) < new Date(),
        };
        dispatch({ type: 'ADD_EVENT', payload: newEvent });
    };

    const updateEvent = (id: string, eventData: Omit<Event, 'id' | 'isPast'>) => {
        const updatedEvent: Event = {
            ...eventData,
            id,
            isPast: new Date(eventData.date) < new Date(),
        };
        dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    };

    const deleteEvent = (id: string) => {
        dispatch({ type: 'DELETE_EVENT', payload: id });
    };

    const checkVenueDateCollision = (venue: string, date: string, excludeId?: string): boolean => {
        return state.events.some(event =>
            event.venue === venue &&
            event.date === date &&
            event.id !== excludeId
        );
    };

    return (
        <EventContext.Provider value={{
            state,
            addEvent,
            updateEvent,
            deleteEvent,
            checkVenueDateCollision,
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = (): EventContextType => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
}; 