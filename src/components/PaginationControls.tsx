import React from 'react';
import { Pagination, Stack, Select, MenuItem, Typography } from '@mui/material';
import { useStore } from '../store/useStore';

interface PaginationControlsProps {
  total: number;
  pageSize: number;
  setPageSize: (size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ total, pageSize, setPageSize }) => {
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
      <Typography variant="body2">Rows per page:</Typography>
      <Select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        size="small"
      >
        {[5, 10, 20].map((size) => (
          <MenuItem key={size} value={size}>{size}</MenuItem>
        ))}
      </Select>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        color="primary"
        shape="rounded"
        size="small"
      />
    </Stack>
  );
};

export default PaginationControls;
