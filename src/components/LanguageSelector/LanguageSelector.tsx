'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const handleChange = (event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
    if (newLanguage !== null) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleChange}
      aria-label="language selector"
      size="small"
    >
      <ToggleButton value="en" aria-label="english">
        EN
      </ToggleButton>
      <ToggleButton value="ru" aria-label="russian">
        RU
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
