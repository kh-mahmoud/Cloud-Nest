"use client";

import React, { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { getFiles } from "@/lib/actions/file.action";
import { Models } from "node-appwrite";
import FormatedDateTime from "./FormatedDateTime";
import Thumbnail from "./Thumbnail";
import { useDebounce } from 'use-debounce';


const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const searchRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery] = useDebounce(query, 300);

  

  //function to fetch files

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const files = await getFiles({ searchquery: debouncedQuery });
      setResults(files.documents);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  //fetch files when query change
  useEffect(() => {
    fetchFiles()
    if (debouncedQuery.length == 0) return router.push(path)
  }, [debouncedQuery])

  //handle click on search result item
  const handleClickItem = (file: Models.Document) => {
    setOpen(false)
    setResults([])
    if (query) {
      router.push(`/${file.type == "video" || file.type == "audio" ? 'media' : file.type == "archive" ? "others" : file.type + 's'}?query=${query}`)
    }
    else {
      router.push(`/${file.type == "video" || file.type == "audio" ? 'media' : file.type == "archive" ? "others" : file.type + 's'}`)
    }
  }

  //handle focus on input
  const handleFocus = async () => {
    setOpen(true)
    await fetchFiles()
  }

  //handle click outside of search input
  //to close the search result
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search" ref={searchRef}>
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          onFocus={handleFocus}
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className={`search-result ${results.length > 3 ? "h-[450px] overflow-auto" : "h-auto"}`}>
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex  items-center overflow-hidden w-full gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      classes="size-9 min-w-9"
                    />
                    <p className="subtitle-2  truncate overflow-hidden text-light-100">
                      {file.name + "." + file.extension}
                    </p>
                  </div>

                  <FormatedDateTime
                    date={file.$createdAt}
                    classes="caption line-clamp-1 text-light-200 w-[130px]"
                  />
                </li>
              ))
            ) : (
              loading ? <p className="flex justify-center items-center">Loading...</p>
                :
                <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;