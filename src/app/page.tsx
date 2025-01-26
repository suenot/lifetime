'use client';

import { Box, Typography } from '@mui/material';
import LifeCalendar from '../components/LifeCalendar/LifeCalendar';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import { EventsProvider } from '../contexts/EventsContext';
import { EventsDrawer } from '../components/EventsDrawer/EventsDrawer';
import styles from "./page.module.css";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <EventsProvider>
      <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h3" component="h1" sx={{ p: 2, textAlign: 'center' }}>
          {t.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ px: 2, pb: 2, textAlign: 'center', color: 'text.secondary' }}>
          {t.description}
        </Typography>
        <LifeCalendar />
        <EventsDrawer />
      </Box>
    </EventsProvider>
  );
}
