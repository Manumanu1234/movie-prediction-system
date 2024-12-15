import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Moviepage.css"
function MoviePage() {
    const [moviearr, setmoviearr] = useState([]);
    const [data, setdata] = useState([]);
    const [moveie, setmoveie] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    async function fetchMovieArr() {

        try {
            const response = await axios.get(`http://127.0.0.1:8000/getmovie`, {
                params: {
                    testData: moveie,
                    pageNum: 1
                }
            });
            console.log(response.data.data);
            setmoviearr(response.data.data);
        } catch (error) {
            console.error("Error fetching movie IDs:", error);
        }
    }

    useEffect(() => {
        if (moviearr.length === 0) return;
        const fetchPosters = async () => {
            setIsLoading(true)

            try {
                const newdatas = [];
                for (let i = 0; i < moviearr.length; i++) {
                    const response = await axios.get(`https://api.themoviedb.org/3/movie/${moviearr[i]}/images?api_key=1e88b4752ec95155d917907a67c3322d`);
                    if (response.data.posters.length > 0) {
                        newdatas.push(response.data.posters[0].file_path);
                    }
                }
                setdata(newdatas);
                console.log(newdatas);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching movie posters:", error);
            }
        };

        fetchPosters();
    }, [moviearr]);

    return (
        <div className='row'>
            <div>
                <header>
                    <h1>Movie Prediction</h1>
                    <p>Find out if your movie is worth watching!</p>
                </header>
                <main>
                    <section class="search-section">
                        <input type="text" onChange={(e) => { setmoveie(e.target.value) }} id="movie-input" placeholder="Enter movie name..."></input>
                        <button onClick={fetchMovieArr} id="predict-button">Predict</button>
                    </section>
                    <section className="results-section">
                        {isLoading ? (
                            <div className="loading">
                                <h1>Loading...</h1>
                            </div>
                        ) : (
                            <div className="movie-images">
                                {data.length > 0 ? (
                                    data.map((filePath, index) => (
                                        <img
                                            key={index}
                                            src={`https://image.tmdb.org/t/p/original/${filePath}`}
                                            alt={`Poster ${index}`}
                                        />
                                    ))
                                ) : (
                                    <p>No movie data available.</p>
                                )}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default MoviePage;
