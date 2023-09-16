import { getBeerList } from '../../api';
import { ApiParams, Beer } from '../../types';
import handle from '../../utils/error';

const localStorageKey = 'savedBeers';

const loadSavedBeersFromLocalStorage = () => {
  const savedList = localStorage.getItem(localStorageKey);
  if (savedList) {
    return JSON.parse(savedList);
  }

  return [];
};

const saveBeersToLocalstorage = (savedBeers:Beer[]):void => {
  localStorage.setItem(localStorageKey, JSON.stringify(savedBeers));
}

const fetchData = (setData: (data: Array<Beer>) => void, params?: ApiParams) => {
  (async () => {
    try {
      const { data } = await getBeerList(params);
      setData(data);
    } catch (error) {
      handle(error);
    }
  })();
};

export { fetchData, loadSavedBeersFromLocalStorage, saveBeersToLocalstorage };
