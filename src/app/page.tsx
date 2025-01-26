'use client';

import { Box, Container, Typography } from '@mui/material';
import LifeCalendar from '../components/LifeCalendar/LifeCalendar';
import { translations } from '../i18n/translations';
import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [language, setLanguage] = useState<string>('ru');
  const t = translations[language as keyof typeof translations];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t.title}
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
