'use client';

import { Box, Container, Typography } from '@mui/material';
import LifeCalendar from '../components/LifeCalendar/LifeCalendar';
import { translations } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';
import styles from "./page.module.css";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 1 }}>
        {t.title}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
        {t.subtitle}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {t.description}
      </Typography>
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        overflow: 'hidden'
      }}>
        <LifeCalendar />
      </Box>
    </Container>
  );
}
