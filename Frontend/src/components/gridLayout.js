import React, { useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import CardTour from '../components/card_tour';

const GridLayout = ({ tours, itemsPerPage, title }) => {
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const selectedTours = tours.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="grid-tour-layout" style={{width:'100%'}}>
            <div className="mt-6">
                <h3 className="font-bold text-2xl">{title}</h3>
            </div>
            <Grid container spacing={4} style={{ width: '100%' }}>
                {selectedTours.map((tour, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CardTour tour={tour} />
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={Math.ceil(tours.length / itemsPerPage)}
                page={page}
                onChange={handleChange}
                color="primary"
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
        </div>
    );
};

export default GridLayout;