import { useState, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
export default function Home({ data }) {
  const [state, setState] = useState({ id: null, liked: false });
  const [results, setResults] = useState([...data]);

  console.log(data);
  const handleLiked = (imdbID) => {
    setState({ id: imdbID, liked: true });
  };

  const onChange = useCallback((event) => {
    const query = event.target.value;
    if (query.length) {
      setResults(
        data.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
      );
      // setResults([]);
    } else {
      setResults([...data]);
    }
  }, []);
  return (
    <div className="w-full max-w-screen-lg mx-auto bg-gray-100 flex flex-col justify-center">
      <div className="text-center flex flex-col justify-center items-center">
        <h1 className="my-4 text-4xl">IMDB Movies</h1>
        <div className="w-64 relative z-50">
          <div>
            <input
              type="search"
              placeholder="Search..."
              className="px-1 py-1 rounded-sm focus:outline-0 w-full"
              onChange={onChange}
            />
          </div>
          <div className="my-4 flex flex-col justify-center items-center">
            <div className="py-1">
              <input
                type="radio"
                id="html"
                name="fav_language"
                value="HTML"
                onChange={() => setResults([...data])}
              />
              <label htmlFor="html">All movies</label>
            </div>
            <div className="py-1">
              <input
                type="radio"
                id="css"
                name="fav_language"
                value="CSS"
                onChange={() => {
                  const newData = results.filter(
                    (movie) => movie.imdbID == state.id
                  );
                  return setResults([...newData]);
                }}
              />
              <label htmlFor="CSS">Favourites</label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {results.map((movie, index) => (
          <div
            className="flex flex-col justify-center items-center p-4 drop-shadow-lg"
            key={index}
          >
            <div className="w-[250px] h-[380px] relative">
              <Image
                src={movie.poster}
                width="250px"
                height="380px"
                layout="responsive"
                objectFit="cover"
              />
              <div className="absolute w-full border-8 border-green-500 bg-gray-900/80 h-full top-0 left-0 flex flex-col justify-center items-center text-white text-5xl font-bold opacity-0 hover:opacity-100">
                <span>{movie.imdbRating}/10</span>
                <span className="text-lg font-basic">{movie.genre}</span>
                <span>
                  <div
                    className={`w-5 h-5 z-20 scale-150 cursor-pointer absolute top-5 right-4 hover:fill-red-500 ${
                      state.id == movie.imdbID && state.liked
                        ? 'fill-red-500'
                        : 'fill-red-300'
                    }`}
                    onClick={(e) => handleLiked(movie.imdbID)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                    >
                      <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path>
                    </svg>
                  </div>
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center w-[250px] text-sm">
              <h1 className="font-bold">{movie.title}</h1>
              <div>{movie.released}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await axios.get(
    'https://hexanovate-eq5fxeakz-thephenom1708.vercel.app/api/movies',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('res', data);
  return {
    props: { data },
  };
}
