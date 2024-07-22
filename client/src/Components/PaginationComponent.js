import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import '../Styles/PaginationComponent.css'

const PaginationComponent = ({ count, page, handleChange }) => {
    return (
        <div className="pagination-container">
            <Stack spacing={2} style={{ padding: '20px 0' }}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={handleChange}
                    color="primary"
                />
            </Stack>
        </div>
    );
};

export default PaginationComponent;