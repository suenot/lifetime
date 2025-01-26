'use client';

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useEvents } from '../../contexts/EventsContext';
import { Event, EventType } from '../../types/events';
import dayjs from 'dayjs';

interface EventFormData {
  type: EventType;
  title: string;
  description: string;
  color: string;
  imageUrl: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

const initialFormData: EventFormData = {
  type: 'single',
  title: '',
  description: '',
  color: '#e0e0e0',
  imageUrl: '',
};

export const EventsDrawer: React.FC = () => {
  const { events, isDrawerOpen, toggleDrawer, addEvent, updateEvent, deleteEvent } = useEvents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        type: event.type,
        title: event.title,
        description: event.description || '',
        color: event.color || '#e0e0e0',
        imageUrl: event.imageUrl || '',
        ...(event.type === 'single' ? { date: event.date } : { startDate: event.startDate, endDate: event.endDate }),
      });
    } else {
      setEditingEvent(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    const eventData = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      color: formData.color,
      imageUrl: formData.imageUrl,
      ...(formData.type === 'single'
        ? { date: formData.date }
        : { startDate: formData.startDate, endDate: formData.endDate }),
    };

    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id } as Event);
    } else {
      addEvent(eventData as Omit<Event, 'id'>);
    }

    handleCloseDialog();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{ '& .MuiDrawer-paper': { width: 320 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">События</Typography>
            <Button startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              Добавить
            </Button>
          </Box>
          <List>
            {events.map((event) => (
              <ListItem
                key={event.id}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleOpenDialog(event)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => deleteEvent(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={event.imageUrl} sx={{ bgcolor: event.color }}>
                    {event.title[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={event.title}
                  secondary={event.type === 'single' ? dayjs(event.date).format('DD.MM.YYYY') : `${dayjs(event.startDate).format('DD.MM.YYYY')} - ${dayjs(event.endDate).format('DD.MM.YYYY')}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Редактировать событие' : 'Новое событие'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Тип события</InputLabel>
              <Select
                value={formData.type}
                label="Тип события"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
              >
                <MenuItem value="single">Одиночное событие</MenuItem>
                <MenuItem value="range">Диапазон событий</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Название"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />

            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Цвет"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              fullWidth
              sx={{ '& input': { p: 1 } }}
            />

            <TextField
              label="URL изображения"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
            />

            {formData.type === 'single' ? (
              <DatePicker
                label="Дата"
                value={formData.date ? dayjs(formData.date) : null}
                onChange={(date) => setFormData({ ...formData, date: date?.toISOString() })}
                format="DD.MM.YYYY"
              />
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Начало"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(date) => setFormData({ ...formData, startDate: date?.toISOString() })}
                  format="DD.MM.YYYY"
                />
                <DatePicker
                  label="Конец"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(date) => setFormData({ ...formData, endDate: date?.toISOString() })}
                  format="DD.MM.YYYY"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
