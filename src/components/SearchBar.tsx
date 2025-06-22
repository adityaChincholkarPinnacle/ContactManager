import React, { useCallback, useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Fade } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import useDebounce from '../hooks/useDebounce';

const SearchBar: React.FC = () => {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [localValue, setLocalValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localValue, 400);

  
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <TextField
      label="Search by name, email, or phone"
      variant="outlined"
      size="small"
      fullWidth
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <Fade in={!!localValue}>
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                aria-label="clear search"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          </Fade>
        ),
      }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.3s ease-in-out',
        },
      }}
    />
  );
};

export default React.memo(SearchBar);
