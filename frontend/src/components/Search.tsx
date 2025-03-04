/** @jsxImportSource react */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchResult, SearchResultType } from "../types/search";
import { searchService } from "../services/search/searchService";
import { SearchType } from "./ui/searchType";
import { SEARCH_CONSTANTS } from "../constants/search";

const searchTypeOptions = [
  { 
    value: 'ALL',
    label: 'All',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    value: SearchResultType.PATIENT,
    label: 'Patients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
];

const MIN_SEARCH_LENGTH = 3;

interface SearchProps {
  readonly onResultSelect?: (result: SearchResult) => void;
  readonly className?: string;
}

export function Search({ onResultSelect, className = '' }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchResultType | 'ALL'>('ALL');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const performSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();
    // Allow * to bypass the minimum length check
    if (trimmedValue === SEARCH_CONSTANTS.SHOW_ALL_RESULTS || trimmedValue.length >= MIN_SEARCH_LENGTH) {
      setIsSearching(true);
      searchService.search(value, { type: searchType })
        .then(searchResults => {
          setResults(searchResults);
          // Auto-select first result if available
          setSelectedIndex(searchResults.length > 0 ? 0 : -1);
        })
        .catch(error => {
          console.error('Search failed:', error);
          setResults([]);
          setSelectedIndex(-1);
        });
    } else {
      setIsSearching(false);
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [searchType]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setIsSearching(false);
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  const handleTypeChange = useCallback((value: string) => {
    setSearchType(value as SearchResultType | 'ALL');
    setResults([]);
    setIsSearching(false);
    setSelectedIndex(-1);
  }, []);

  const selectResult = useCallback((result: SearchResult) => {
    onResultSelect?.(result);
    setIsSearching(false);
    setSearchTerm('');
    setResults([]);
    setSelectedIndex(-1);
  }, [onResultSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSearching && results.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev + 1;
            return next >= results.length ? 0 : next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev - 1;
            return next < 0 ? results.length - 1 : next;
          });
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0) {
            selectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsSearching(false);
          setSelectedIndex(-1);
          break;
      }
    }
  }, [isSearching, results, selectedIndex, selectResult]);

  const getSearchResultContent = () => {
    if (results.length > 0) {
      return (
        <div className="divide-y divide-gray-100">
          {results.reduce((acc: React.ReactElement[], result, index) => {
            // Add type header if needed
            if (index === 0 || results[index - 1].type !== result.type) {
              acc.push(
                <div key={`header-${result.type}`} className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {result.type}
                </div>
              );
            }
            
            // Add the result item
            acc.push(
              <button 
                key={result.id}
                ref={index === selectedIndex ? selectedItemRef : null}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => selectResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    selectResult(result);
                  }
                }}
              >
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {result.title}
                    </div>
                    {result.subtitle && (
                      <div className="text-sm text-gray-500">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
            
            return acc;
          }, [])}
        </div>
      );
    }
    
    if (searchTerm.length >= MIN_SEARCH_LENGTH) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500">
          No results found
        </div>
      );
    }
    
    return (
      <div className="px-4 py-3 text-sm text-gray-500">
        Please enter at least {MIN_SEARCH_LENGTH} characters to search
      </div>
    );
  };

  // Ensure selected item is visible
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <SearchType
          value={searchType}
          onChange={handleTypeChange}
          options={searchTypeOptions}
        />
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Smart patient search"
            className="w-full px-5 py-2.5 pr-12 border-2 border-gray-200 rounded-lg bg-blue-50 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 text-base"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-150 group flex items-center justify-center"
            onClick={() => {
              // Voice search functionality will be implemented later
              console.log('Voice search clicked');
            }}
            title="Ask a Question (Coming Soon)"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>
      
      {isSearching && (
        <div 
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {getSearchResultContent()}
        </div>
      )}
    </div>
  );
}
