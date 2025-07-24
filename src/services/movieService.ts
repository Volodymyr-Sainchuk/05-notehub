import axios from "axios";
import type { Movie } from "../types/movie";

interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(query: string, page: number): Promise<SearchMoviesResponse> {
  const response = await axios.get<SearchMoviesResponse>("https://api.themoviedb.org/3/search/movie", {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
}
