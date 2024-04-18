import { useEffect, useState } from "react";
import StarRating from './StarRating'
import { Link } from "react-router-dom";
import { MyRoute } from "./MyRoute";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '52ad0df';

export default function App() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [watched, setWached] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    function handleSelectMovie(id) {
        setSelectedId(selectedId => id === selectedId ? null : id)
    }

    function handleHoverMovie(id) {
        setHoveredId(hoveredId => id === hoveredId ? null : id)
    }

    function handleCloseMovie() {
        setSelectedId(null)
    }

    function handleAddWatched(movie) {
        setWached(watched => [...watched, movie])
    }

    function handleDeleteWatched(id) {
        setWached(watched => watched.filter(movie => movie.imdbID !== id))
    }

    useEffect(function () {
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                // So basically, always before we start fetching data, we reset the error.
                setError('');
                const response = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                    { signal: controller.signal }
                );

                if (!response.ok) throw new Error("Something went wrong with fetching movies");

                const data = await response.json();

                if (data.Response === "False") throw new Error("Movie not found");

                setMovies(data.Search.slice(0,5));
                setError('');

            } catch (err) {
                if (err.name !== "AbortError")
                    console.log(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        // if(!query.length){
        if (query.length < 3) {
            setError('');
            setMovies([]);
            return;
        }
        handleCloseMovie();
        fetchMovies();

        return function () {
            controller.abort();
        }
    }, [query]);

    return (
        <>
            <Nav>
                <Logo />
                <SearchBar query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Nav>
            <Main>
                <Box>
                    {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
                    {isLoading && <Loader />}
                    {!isLoading && !error && movies.length === 0 && <h3 className="search-guide-text">Search for the movie of your choice up in the search bar...</h3>}
                    {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} onHoverMovie={handleHoverMovie} hoveredId={hoveredId} />}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
                        </>
                    )}
                </Box>

                {/* <ListBox element={
                    <>
                        <WatchedSummary watched={watched} />
                        <WatchedMoviesList watched={watched} />
                    </>
                } />
                <ListBox element={<MovieList movies={movies}/>} /> */}
            </Main>
            <Footer />
        </>
    )
}

function Loader() {
    return (
        <p className="loader">Loading...</p>
    )
}

function Nav({ children }) {
    return (
        <nav className="nav-bar">
            {children}
        </nav>
    )
}

function ErrorMessage({ message }) {
    return (
        <p><span>⛔</span> {message}</p>
    )
}

function Logo() {
    return (
        
        <div className="logo">
            <h1><span role="img">🍿</span> Net-prime</h1>
            {/* <a href="index.html"><span role="img">🍿</span> Net-prime</a> */}
            {/* <Link to='/'>home</Link> */}
        </div>
        
    )
}

function SearchBar({ query, setQuery }) {

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

function NumResults({ movies }) {
    return (
        <p className="num-results">
            {movies.length === 0 ? '' : <>Found <strong>{movies.length}</strong> results</>}
            {/* Found <strong>{movies.length}</strong> results */}
        </p>
    )
}

function Main({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    )
}

function Box({ children }) {
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
                children
            )}
        </div>
    )
}

function MovieList({ movies, onSelectMovie, onHoverMovie, hoveredId }) {

    return (
        <ul className="list">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} onHoverMovie={onHoverMovie} hoveredId={hoveredId} />
            ))}
        </ul>
    )
}

function Movie({ movie, onSelectMovie, onHoverMovie, hoveredId }) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)} onMouseEnter={() => onHoverMovie(movie.imdbID)} className={`${hoveredId === movie.imdbID ? 'hovered-searched-movie' : 'searched-movie'}`}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <div>
                <h3>{movie.Title}</h3>
                <p>
                    <span> <img src={movie.Poster} alt={`${movie.Title} poster`} style={{ height: '10px' }} /> </span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

    // const isWatched = watched.find(item => item === movie)
    const isWatched = watched.map(item => item.imdbID)
        .includes(selectedId)

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster,
            imdbRating: Number(movie.imdbRating),
            runtime: Number(movie.Runtime.split(' ').at(0)),
            userRating
        }
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(function () {
        document.addEventListener('keydown', (e) => {
            if (e.code === "Escape") onCloseMovie()
        })
    }, [onCloseMovie])

    useEffect(function () {
        async function getMovieDetails() {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
            const data = await res.json();
            setMovie(data)
            setIsLoading(false);
        }
        getMovieDetails()
    }, [selectedId])

    useEffect(function () {
        if (!movie.Title) return;
        document.title = `Movie | ${movie.Title}`

        return function () {
            document.title = `Net-prime`
        }
    }, [movie.Title])

    return (
        <div >
            {isLoading ? <Loader /> :
                <div>
                    <button className="back" onClick={onCloseMovie}>&larr;</button>
                    <header className="movie-details">
                        <img src={movie.Poster} alt={`poster of ${movie.movie}`} />
                        <div>
                            <h2>{movie.Title}</h2>
                            <p>{movie.Released} &bull; {movie.runtime}</p>
                            <p>{movie.Genre}</p>
                            <p>{movie.imdbRating} IMDb rating</p>
                        </div>
                    </header>

                    <section className="movie-details-below">
                        {!isWatched ?
                            <div className="rating" key={movie.imdbID}>
                                <StarRating maxRating={10} size={44} onSetRating={setUserRating} />
                                {userRating > 0 && <button className="add-to-list" onClick={handleAdd} >+ Add to list</button>}
                            </div> : <p>You rated this movie {watchedUserRating} ⭐.</p>}

                        <em>{movie.plot}</em>
                        <p>Starring {movie.Actors}</p>
                        <p>Directed by {movie.Director}</p>
                    </section>
                </div>
            }
        </div>
    )
}

// Not necessary
// function WachedBox (){
//     const [watched, setWached] = useState(tempWachedData);
//     const [isOpen2, setIsOpen2] = useState(true);

//     return (
//         <div className="box">
//                 <button
//                   className="btn-toggle"
//                   onClick={() => setIsOpen2(open => !open)}
//                 >
//                   {isOpen2 ? '-' : '+'}  
//                 </button>
//                 {isOpen2 && (
//                     <>
//                         <WatchedSummary watched={watched} />
//                         <WatchedMoviesList watched={watched} />
//                     </>
//                 )}
//             </div>
//     )
// }

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div className="rated-list">
                <p>
                    <span className="hash">#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⌛</span>
                    <span>{avgRuntime.toFixed(2)} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (<WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />))}
        </ul>
    )
}

function WatchedMovie({ movie, onDeleteWatched }) {
    return (
        <li className="watched-movie-container">
            <img src={movie.poster} alt={`${movie.title} poster`} style={{ height: '50px' }} />
            <div>
                <h3>{movie.title}</h3>
                <div className="watched-movie-data">
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

                    <button onClick={() => onDeleteWatched(movie.imdbID)}>❌</button>
                </div>
            </div>
        </li>
    )
}

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="links">
                <i class="fa-brands fa-facebook"></i>
                <i class="fa-brands fa-square-instagram"></i>
                <i class="fa-brands fa-twitter"></i>
                <i class="fa-brands fa-youtube"></i>
            </div>
            <div className="detail-section">
                <ul>
                    <li>Audio Description</li>
                    <li>Investor Relations</li>
                    <li>Legal Notices</li>
                </ul>
                <ul>
                    <li>Help Center</li>
                    <li>Jobs</li>
                    <li>Cookie Preferences</li>
                </ul>
                <ul>
                    <li>Gift Cards</li>
                    <li>Terms of Use</li>
                    <li>Corporate Information</li>
                </ul>
                <ul>
                    <li>Media Center</li>
                    <li>Privacy</li>
                    <li>Contact Us</li>
                </ul>
            </div>
            <p>&copy; {currentYear} Net-prime Inc. All rights reserved.</p>
        </footer>
    )
}
