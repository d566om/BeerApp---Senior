import { useEffect, useState } from 'react';
import { Beer } from '../../types';
import { fetchData } from './utils';
import { Avatar, Checkbox, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import SportsBar from '@mui/icons-material/SportsBar';
import { Link, useNavigate } from 'react-router-dom';

const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList), []);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  return (
    <article>
      <section>
        <header>
          <h1>BeerList page</h1>
        </header>
        <main>
          <TableContainer component={Paper} style={{maxHeight: 400}}>
            <Table sx={{ minWidth: 400 }} aria-label="custom pagination table" size={'small'} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Brewery type</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beerList.map((beer, index) => (
                  <TableRow key={beer.id}>
                    <TableCell component="th" scope="row">{beer.name}</TableCell>
                    <TableCell>({beer.city} {beer.street})</TableCell>
                    <TableCell>{beer.brewery_type}</TableCell>
                    <TableCell>{beer.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
