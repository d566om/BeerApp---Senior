import { getBeerList } from '../../api';
import { ApiParams, Beer } from '../../types';
import handle from '../../utils/error';

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

export { fetchData };
