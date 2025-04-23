import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Spinner from "./Spinner";

interface Result {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

const SectionRow = ({
  data,
  debouncedSearchTerm,
}: {
  data: Result[];
  debouncedSearchTerm: string;
}) => {
  return (
    <ul>
      {data.map((movie: Result) => {
        const regex = new RegExp(`(${debouncedSearchTerm})`, "i"); // Case-insensitive match
        const parts = movie.Title.split(regex);

        return (
          <li key={movie.imdbID}>
            <a href="#" className="block hover:bg-gray-200 rounded px-2 py-1">
              {parts.map((part, index) =>
                regex.test(part) ? <strong key={index}>{part}</strong> : part
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

// Helper function to render sections
const renderSection = (
  data: Result[],
  title: string,
  debouncedSearchTerm: string
) => {
  return (
    data.length > 0 && (
      <div>
        <h3 className="text-xs text-gray-600 pl-2 py-1">{title}</h3>
        <SectionRow data={data} debouncedSearchTerm={debouncedSearchTerm} />
      </div>
    )
  );
};

const SearchResult = ({
  debouncedSearchTerm,
}: {
  debouncedSearchTerm: string;
}) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { isPending, data } = useQuery({
    queryKey: ["searchSuggestions", debouncedSearchTerm],
    queryFn: () =>
      fetch(
        // I have tried to query the API with "type" parameter of both movie and series
        // e.g. https://www.omdbapi.com/?apikey={apiKey}&s={title}&type=movie&type=series
        // but it seems that the API does not support this
        // it return "Error: 'Procedure or function SearchTitle has too many arguments specified.'"
        // so I choose to filter the data on the client side
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${debouncedSearchTerm}`
      ).then((res) => res.json()),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: 60 * 1000, // 1 minute
  });
  const [results, setResults] = useState<Result[]>([]);

  // Update results when data changes
  useEffect(() => {
    if (data && data.Search) {
      setResults(data.Search);
    } else {
      setResults([]);
    }
  }, [data]);

  // Filter results into movies and series
  const movies = results
    .filter((result) => result.Type === "movie")
    .slice(0, 3);
  const series = results
    .filter((result) => result.Type === "series")
    .slice(0, 3);

  return (
    <div
      id="suggestions"
      className="px-2 py-2 border-t border-gray-200 text-sm text-gray-800"
    >
      {isPending ? (
        <Spinner />
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {renderSection(movies, "Movies", debouncedSearchTerm)}
          {renderSection(series, "TV Shows", debouncedSearchTerm)}
        </div>
      ) : data?.Error ? (
        <div className="flex items-center justify-center">
          <p className="text-xs text-gray-600 pl-2 py-1">{data.Error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchResult;
