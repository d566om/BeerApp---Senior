import { useEffect, useState } from 'react';
import { Beer as IBeer } from '../../types';
import { fetchData } from './utils';
import { useParams } from 'react-router-dom';

const Beer = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState<IBeer>();

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeer, id), [id]);

  return (
    <article>
      <section>
        <header>
          <h1>{beer?.name}</h1>
        </header>
        <main>
          <table>
            <tr>
              <td>Type: </td> 
              <td>{beer?.brewery_type}</td>
            </tr>
            <tr>
              <td>City: </td>
              <td> {beer?.city}</td>
            </tr>
            <tr>
              <td>Website: </td>
              <td> {beer?.website_url}</td>
            </tr>
            <tr>
              <td>Country: </td>
              <td> {beer?.country}</td>
            </tr>
          </table>
        </main>
      </section>
    </article>
  );
};

export default Beer;
