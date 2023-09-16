import { useEffect, useState } from 'react';
import { fetchData, loadSavedBeersFromLocalStorage, saveBeersToLocalstorage } from './utils';
import { ApiParams, Beer , SORT} from '../../types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Checkbox, Paper, TextField, Link } from '@mui/material';
import styles from './Home.module.css';

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
  useEffect(() => setSavedList(loadSavedBeersFromLocalStorage()));

  const handleFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterText(filterText);
    //Reset to page 1. Keeping the page number might be a problem if the filtered list has less pages.
    setCurrentPage(1);
    fetchData(setBeerList,  getParams())
  };

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = event.target.value;
    setSortOrder(sortOrder);
    fetchData(setBeerList,  getParams());
  }
  
  //TODO Disable paging while request is in progress
  const handleNextPageClick = () => {
    setCurrentPage(currentPage + 1);
    fetchData(setBeerList,  getParams())
  };

  //TODO Disable paging while request is in progress
  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchData(setBeerList,  getParams())
    }
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
                <Button variant='contained'>Reload list</Button>
              </div>
              <ul className={styles.list}>
                {beerList.map((beer, index) => (
                  <li key={index.toString()}>
                    <Checkbox id={beer.id} checked={isBeerFavourited(beer)} onChange={handleBeerCheckboxClick}/>
                    <Link component={RouterLink} to={`/beer/${beer.id}`}>
                      {beer.name}
                    </Link>
                    &nbsp;({beer.city} {beer.street})
                  </li>
                ))}
              </ul>

              <select value={sortOrder} onChange={handleSortOrderChange}>
                <option value='name:asc'>Ascending</option>
                <option value='name:desc'>Descending</option>
              </select>

              <div className={styles.pagination}>
                <Button variant='contained' onClick={handlePrevPageClick} disabled={currentPage === 1}>
                  Previous Page
                </Button>
                Page number: {currentPage}
                {/*TODO find out if it's possible to retrieve the total number of pages*/}
                <Button variant='contained' onClick={handleNextPageClick} disabled={beerList.length < itemsPerPage}>
                  Next Page
                </Button>
              </div>
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
