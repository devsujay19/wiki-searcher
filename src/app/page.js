"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});

  const handleSearch = async e => {

    e.preventDefault();
    if (search === "") return;

    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw Error(response.statusText);
    };

    const json = await response.json();

    setSearchInfo(json.query.searchinfo);

    setResults(json.query.search);

  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col justify-center min-h-[100vh]">
      <header className="flex flex-col items-center mb-[32px]">
        <h1 className="text-[#888] font-semibold text-[42px] uppercase text-center mb-[16px]">Wiki Searcher</h1>
        <form className="flex justify-center items-center rounded-[16px] overflow-hidden w-[100%] max-w-[480px] mb-[16px] transition-[0.4s]" onSubmit={handleSearch}>
          <input value={search} onChange={e => setSearch(e.target.value)} id="search-bar" className="block appearance-none outline-none border-none p-[16px] w-[100%] transition-[0.4s]" type="text" placeholder="Search Wikipedia Articles..." />
        </form>
        {(searchInfo.totalhits) ? <p>Search Results: {searchInfo.totalhits}</p> : "Search to see total hits"}
      </header>
      <div className="max-w-[768px] mx-auto">
        {results.map((result, i) => {
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            <div key={i} id="result" className="w-[100%] p-[16px] mb-[16px] bg-transparent border rounded-[16px] bg-white duration-[250ms]">
              <h3 className="text-[#888] text-[28px] mb-[16px] ">{result.title}</h3>
              <p className="mb-[16px]" dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
              <Link target="_blank" rel="nonreferrer noopener" className="inline-block py-[12px] px-[16px] bg-[#A84FFF] text-white font-[700] decoration-none rounded-[12px] transition-[0.4s]" id="link" href={url}>Read more</Link>
            </div>
          );
        })}
      </div>
      <footer className="text-center fixed bottom-0 left-0 right-0 items-center justify-center">
        <p className="mb-4">&copy; {currentYear} | Sujay Mukherjee. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
