'use client';

import React from 'react';
import { Box, Stack, Avatar, AvatarGroup } from '@mui/material';
import { Event } from '../../types/events';
import { useEvents } from '../../contexts/EventsContext';

interface WeekEventsProps {
  weekId: string;
}

export const WeekEvents: React.FC<WeekEventsProps> = ({ weekId }) => {
  const { getEventsForWeek, displayMode } = useEvents();
  const events = getEventsForWeek(weekId);

  if (events.length === 0) {
    return null;
  }

  if (displayMode === 'compact') {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: events[0].color || '#e0e0e0',
          borderRadius: 1,
        }}
      />
    );
  }

  // Large mode with multiple events
  if (events.length > 1) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          padding: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 16,
              height: 16,
              fontSize: '0.75rem',
            },
          }}
        >
          {events.map((event) => (
            <Avatar
              key={event.id}
              src={event.imageUrl}
              sx={{
                bgcolor: event.color || '#e0e0e0',
              }}
            >
              {event.title[0]}
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
    );
  }

  // Large mode with single event
  const event = events[0];
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: event.color || '#f5f5f5',
        borderRadius: 2,
        padding: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {event.imageUrl ? (
        <Avatar
          src={event.imageUrl}
          sx={{
            width: '80%',
            height: '80%',
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: '80%',
            height: '80%',
            bgcolor: event.color || '#e0e0e0',
          }}
        >
          {event.title[0]}
        </Avatar>
      )}
    </Box>
  );
};
