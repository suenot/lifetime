'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { translations } from '../../i18n/translations';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

// Initialize weekOfYear plugin
dayjs.extend(weekOfYear);

interface WeekProps {
  filled?: boolean;
  color?: string;
}

const Week: React.FC<WeekProps> = ({ filled, color }) => (
  <Box
    sx={{
      width: '100%',
      paddingBottom: '100%',
      backgroundColor: filled ? color || '#e0e0e0' : 'transparent',
      border: '1px solid #e0e0e0',
      borderRadius: '2px',
    }}
  />
);

const SeasonDivider: React.FC<{ label: string }> = ({ label }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}
  >
    <Typography
      variant="caption"
      sx={{
        fontSize: '0.75rem',
        color: 'text.secondary',
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Divider sx={{ width: '100%', borderColor: 'divider' }} />
  </Box>
);

const LifeCalendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs('1989-01-07'));
  const { language, setLanguage } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const lifeExpectancy = 100;
  const weeksInYear = 52;

  const currentDate = dayjs();
  
  const getWeeksLived = (year: number, weekIndex: number) => {
    if (!birthDate) return false;
    
    const weekStart = dayjs().year(year).week(weekIndex + 1).startOf('week');
    
    if (weekStart.isBefore(birthDate)) {
      return false;
    }
    
    if (weekStart.isAfter(currentDate)) {
      return false;
    }
    
    return true;
  };

  const renderSeasons = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          ml: isMobile ? '40px' : '60px',
          mr: isMobile ? '40px' : '60px',
          mb: 2,
          gap: 1,
        }}
      >
        <Grid container spacing={0.5}>
          <Grid item xs={12 / (isMobile ? 4 : 4)}>
            <SeasonDivider label={t.seasons.winter} />
          </Grid>
          <Grid item xs={12 / (isMobile ? 4 : 4)}>
            <SeasonDivider label={t.seasons.spring} />
          </Grid>
          <Grid item xs={12 / (isMobile ? 4 : 4)}>
            <SeasonDivider label={t.seasons.summer} />
          </Grid>
          <Grid item xs={12 / (isMobile ? 4 : 4)}>
            <SeasonDivider label={t.seasons.autumn} />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderYearLabel = (year: number) => {
    const age = birthDate ? year - birthDate.year() : 0;
    return (
      <Typography
        variant="body2"
        sx={{
          position: 'sticky',
          left: 0,
          width: isMobile ? '40px' : '60px',
          textAlign: 'right',
          pr: 1,
          fontSize: isMobile ? '0.7rem' : '0.875rem',
        }}
      >
        {`${age}`}
      </Typography>
    );
  };

  const renderYearNumber = (year: number) => (
    <Typography
      variant="body2"
      sx={{
        position: 'sticky',
        right: 0,
        width: isMobile ? '40px' : '60px',
        textAlign: 'left',
        pl: 1,
        fontSize: isMobile ? '0.7rem' : '0.875rem',
      }}
    >
      {year}
    </Typography>
  );

  return (
    <Box sx={{ p: 2, maxWidth: '100%', overflow: 'auto' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
          <DatePicker
            label={t.birthDate}
            value={birthDate}
            onChange={(newValue) => setBirthDate(newValue)}
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: 150 }
              }
            }}
          />
        </LocalizationProvider>
        <LanguageSelector 
          language={language} 
          onLanguageChange={setLanguage} 
        />
      </Stack>

      {renderSeasons()}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        {birthDate && Array.from({ length: lifeExpectancy }, (_, yearIndex) => {
          const year = birthDate.year() + yearIndex;
          return (
            <Box
              key={year}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {renderYearLabel(year)}
              <Grid
                container
                spacing={0.5}
                sx={{
                  flex: 1,
                  minWidth: isMobile ? 300 : 600,
                }}
              >
                {Array.from({ length: weeksInYear }, (_, weekIndex) => (
                  <Grid
                    item
                    key={weekIndex}
                    xs={12 / (isMobile ? 26 : 52)}
                  >
                    <Week
                      filled={getWeeksLived(year, weekIndex)}
                      color={theme.palette.primary.light}
                    />
                  </Grid>
                ))}
              </Grid>
              {renderYearNumber(year)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LifeCalendar;
