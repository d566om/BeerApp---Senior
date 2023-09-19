import { useEffect, useState } from 'react';
import { fetchData, loadSavedBeersFromLocalStorage, saveBeersToLocalstorage } from './utils';
import { ApiParams, Beer , SORT} from '../../types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Checkbox, Paper, TextField, Link, Select, MenuItem, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableHead, Box, TableSortLabel } from '@mui/material';
import styles from './Home.module.css';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

const Home = () => {
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [savedList, setSavedList] = useState<Array<Beer>>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>('name:asc');
  const itemsPerPage = 10;
  
  const getParams = ():ApiParams => {
    return {
      by_name:filterText,
      page: currentPage,
      per_page: itemsPerPage,
      sort:sortOrder as SORT
    };
  };

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList, getParams()), []);
  useEffect(() => setSavedList(loadSavedBeersFromLocalStorage()), []);
  useEffect(() => {
    fetchData(setBeerList,  getParams());
  }, [filterText, currentPage, sortOrder]);

  const handleFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterText(filterText);
    //Reset to page 1. Keeping the page number might be a problem if the filtered list has less pages.
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event: React.MouseEvent<unknown>) => {
    const newSortOrder = sortOrder === 'name:asc' ? 'name:desc' : 'name:asc';
    setSortOrder(newSortOrder);
  }

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
     // Material table uses 0 indexes for pagination
    setCurrentPage(page+1);
  };

  const handleBeerCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Create copy of saved list, and modify this
    var newSavedList = structuredClone(savedList);
    
    // If a beer is favourited/unfavourited, delete it from the existing favourite list
    // With this if we favourite a beer with updated properties, the updated props will be saved
    const deleteIndex = savedList.findIndex(savedBeer => savedBeer.id === event.target.id);
    if (deleteIndex !== -1) {
      newSavedList.splice(deleteIndex, 1)
      
    }

    // Save the new favourite
    if (event.target.checked) {
      const indexOfBeer = beerList.findIndex(beer => beer.id === event.target.id);
      if (indexOfBeer !== -1) {
        const copyOfBeer = structuredClone(beerList[indexOfBeer]);
        newSavedList.push(copyOfBeer);
      }
    }

    updateSavedBeers(newSavedList)
  }

  const updateSavedBeers = (savedBeers:Beer[]):void => {
    setSavedList(savedBeers);
    saveBeersToLocalstorage(savedBeers);
  }

  const isBeerFavourited = (beer: Beer):boolean => {
    return savedList.some(savedBeer => savedBeer.id === beer.id);
  }

  const clearFavourites = () => {
    updateSavedBeers([]);
  }
  

  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <TextField label='Filter...' variant='outlined' value={filterText} onChange={handleFilterTextChange}/>
              </div>
              <ul className={styles.list}>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="custom pagination table" size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Favourite</TableCell>
                      <TableCell
                        sortDirection={sortOrder === 'name:asc' ? 'asc' : 'desc'}
                      >
                        <TableSortLabel active={true} direction={sortOrder === 'name:asc' ? 'asc' : 'desc'} onClick={handleSortOrderChange}>
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Brewery type</TableCell>
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {beerList.map((beer, index) => (
                      <TableRow key={beer.id}>
                        <TableCell scope="row">
                          <Checkbox id={beer.id} checked={isBeerFavourited(beer)} onChange={handleBeerCheckboxClick}/>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Link component={RouterLink} to={`/beer/${beer.id}`}>{beer.name}</Link>
                        </TableCell>
                        <TableCell>({beer.city} {beer.street})</TableCell>
                        <TableCell>{beer.brewery_type}</TableCell>
                        <TableCell>{beer.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[]}
                        count={-1}
                        rowsPerPage={itemsPerPage}
                        page={currentPage-1}
                        SelectProps={{
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        }}
                        onPageChange={handlePageChange}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
              </ul>
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                <Button variant='contained' size='small' onClick={clearFavourites}>
                  Remove all items
                </Button>
              </div>
              <ul className={styles.list}>
                {savedList.map((beer, index) => (
                  <li key={index.toString()}>
                    <Checkbox id={beer.id} checked={isBeerFavourited(beer)} onChange={handleBeerCheckboxClick}/>
                    <Link component={RouterLink} to={`/beer/${beer.id}`}>
                      {beer.name}
                    </Link>
                    &nbsp;({beer.city} {beer.street})
                  </li>
                ))}
                {!savedList.length && <p>No saved items</p>}
              </ul>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
