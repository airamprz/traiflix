import { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading..." });
  const [playing, setPlaying] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="text-white">
      <div className="container mx-auto">
        <form
          className="flex justify-end items-center mb-4"
          onSubmit={searchMovies}
        >
          <input
            type="text"
            className="p-2 border border-gray-300 rounded shadow text-black"
            placeholder="Buscar..."
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-green-700 text-white rounded"
            style={{ backgroundColor: "#d62c2c" }}
            type="submit"
          >
            Buscar
          </button>
        </form>
      </div>
      <div>
        <div className="mt-4">
          <div>
            {movie ? (
              <div
                className="relative bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                  height: "600px",
                }}
              >
                {playing ? (
                  <>
                    <YouTube
                      videoId={trailer.key}
                      className="absolute top-0 left-0 w-full h-full"
                      containerClassName={"youtube-container amru"}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          cc_load_policy: 0,
                          fs: 0,
                          iv_load_policy: 0,
                          modestbranding: 0,
                          rel: 0,
                          showinfo: 0,
                        },
                      }}
                    />
                    <button
                      onClick={() => setPlaying(false)}
                      className="absolute top-0 right-0 m-4 text-white"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
                    <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start">
                      {trailer ? (
                        <button
                          className="px-4 py-2 text-white rounded"
                          style={{ backgroundColor: "#d62c2c" }}
                          onClick={() => setPlaying(true)}
                          type="button"
                        >
                          Ver Trailer
                        </button>
                      ) : (
                        "Sorry, no trailer available"
                      )}
                      <h1 className="text-5xl font-bold">{movie.title}</h1>
                      <p className="text-xl">{movie.overview}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="container mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => selectMovie(movie)}
                className="cursor-pointer"
              >
                <img
                  src={`${IMAGE_PATH}${movie.poster_path}`}
                  alt=""
                  className="rounded shadow-md"
                />
                <h3 className="text-center font-bold mt-2">{movie.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
