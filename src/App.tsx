import { useState } from "react";

import SearchResult from "./SearchResult";
import useDebouncedValue from "./useDebouncedValue";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  return (
    <section className="h-screen p-6 md:p-24 bg-gray-200">
      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
        <input
          id="searchbox"
          className="text-xl block w-full appearance-none bg-white placeholder-gray-400 px-4 py-3 rounded-lg outline-none"
          placeholder="Search for movie"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {debouncedSearchTerm.length > 0 && (
          <SearchResult debouncedSearchTerm={debouncedSearchTerm} />
        )}
      </div>
    </section>
  );
};

export default App;
