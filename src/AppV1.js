import { useState } from "react";

const tempMovieData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: ''
    },
    {
        imdbID: 'tt0133093',
        Title: 'The Matrix',
        Year: '1999',
        Poster: ''
    },
    {
        imdbID: 'tt6751668',
        Title: 'Parasite',
        Year: '2019',
        Poster: ''
    },
];

const tempWachedData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: '',
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: 'tt0088763',
        Title: 'Back to the Future',
        Year: '1985',
        Poster: '',
        runtime: 116,
        imdbRating: 8.8,
        userRating: 9,
    },      
];

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App(){
    const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWached] = useState(tempWachedData);
    // {console.log(movies.length)}

    return (
        <>
            <Nav>
                <Logo />
                <SearchBar />
                <NumResults movies={movies}/>
            </Nav>
            <Main>
                {/* <ListBox>
                    <MovieList movies={movies}/>
                </ListBox>
                <ListBox>
                    <WatchedSummary watched={watched} />
                    <WatchedMoviesList watched={watched} />
                </ListBox> */}
                <ListBox element={
                    <>
                        <WatchedSummary watched={watched} />
                        <WatchedMoviesList watched={watched} />
                    </>
                } />
                <ListBox element={<MovieList movies={movies}/>} />
            </Main>
        </>
    )
}

function Nav ({children}){
    return (
        <nav className="nav-bar">
           {children}
        </nav>
    )
}

function Logo(){
    return (
        <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
    </div>
    )
}

function SearchBar (){
    const [query, setQuery] = useState('');

    return (
        <input 
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    )
}

function NumResults ({movies}) {
    return(
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    )
}

function Main ({children}){
    return (
        <main className="main">
            {children}   
        </main>
    )
}

function ListBox ({element}){
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
                <button
                  className="btn-toggle"
                  onClick={() => setIsOpen(open => !open)}
                >
                  {isOpen ? '-' : '+'}  
                </button>
                {isOpen && (
                    element
                )}
        </div>
    )
}

function MovieList({movies}){

    return (
        <ul className="list">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID}/>
            ))}
        </ul>
    )
}

function Movie({movie}){
    return (
        <li >
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span></span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

function WachedBox (){
    const [watched, setWached] = useState(tempWachedData);
    const [isOpen2, setIsOpen2] = useState(true);
    
    return (
        <div className="box">
                <button
                  className="btn-toggle"
                  onClick={() => setIsOpen2(open => !open)}
                >
                  {isOpen2 ? '-' : '+'}  
                </button>
                {isOpen2 && (
                    <>
                        <WatchedSummary watched={watched} />

                        <WatchedMoviesList watched={watched} />
                    </>
                )}
            </div>
    )
}

function WatchedSummary({watched}){
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⌛</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMoviesList({watched}) {
    return (
        <ul className="list">
            {watched.map((movie) => (<WatchedMovie movie={movie} key={movie.imdbID}/>))}
        </ul>
    )
}

function WatchedMovie({movie}){
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⌛</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    )
}


