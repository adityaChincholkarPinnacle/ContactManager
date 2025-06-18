import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useStore } from '../store/useStore';

const FavouritesToggle: React.FC = () => {
  const favouritesOnly = useStore((state) => state.favouritesOnly);
  const setFavouritesOnly = useStore((state) => state.setFavouritesOnly);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={favouritesOnly}
          onChange={(e) => setFavouritesOnly(e.target.checked)}
          color="primary"
        />
      }
      label={<span style={{ display: 'flex', alignItems: 'center' }}><StarIcon color={favouritesOnly ? 'warning' : 'disabled'} sx={{ mr: 0.5 }} /> Favourites Only</span>}
      sx={{ ml: 2 }}
    />
  );
};

export default FavouritesToggle;
