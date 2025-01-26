'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Language } from '../../hooks/useLanguage';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newLanguage: Language | null) => {
    if (newLanguage) {
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
};

export default LanguageSelector;
