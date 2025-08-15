"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@components/ui/dropdown-menu";
import { 
  Search, 
  Mic, 
  MapPin, 
  ArrowRight, 
  Bot, 
  ChevronDown,
  Sparkles 
} from "lucide-react";
import { isSpeechRecognitionSupported, createSpeechRecognition } from "@lib/utils/speechRecognition";

const AdvancedSearchHeader = ({ 
  onSearch, 
  placeholder = "Find restaurants, services, and more...",
  className = "",
  showAiMode = true,
  showVoiceSearch = true,
  showLocationSelector = true
}) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  const inputRef = useRef(null);
  const formRef = useRef(null);

  // Popular searches
  const popularSearches = [
    "Restaurants", "Hair Salons", "Auto Repair", 
    "Dentists", "Plumbers", "Coffee Shops"
  ];

  // Client-side hydration guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  const supportFlag = isClient && isSpeechRecognitionSupported();

  // Initialize speech recognition
  useEffect(() => {
    if (!isClient || !supportFlag || !showVoiceSearch) return;

    try {
      const recognition = createSpeechRecognition({
        continuous: false,
        interimResults: false,
        lang: "en-US",
      });

      recognition.setCallbacks({
        onStart: () => setIsListening(true),
        onResult: (result) => {
          if (result.isFinal && result.transcript) {
            setQuery(result.transcript.trim());
            setIsListening(false);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });

      setSpeechRecognition(recognition);
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error);
    }

    return () => {
      if (speechRecognition) {
        speechRecognition.destroy();
      }
    };
  }, [isClient, supportFlag, showVoiceSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query.trim(), location);
    }
    setShowSuggestions(false);
  };

  const handleVoiceSearch = async () => {
    if (!supportFlag || !speechRecognition) return;

    if (isListening) {
      speechRecognition.stop();
    } else {
      try {
        await speechRecognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const handlePopularSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchTerm, location);
    }
  };

  const toggleAiMode = () => {
    setAiMode(!aiMode);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className={`hidden items-center w-full max-w-2xl md:flex ${className}`}>
      <div className="flex items-center w-full max-w-2xl">
        <div className="relative w-full">
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col w-full h-full min-w-0 p-2 ml-6 border rounded-lg shadow-sm transition-all duration-200 bg-background border-border focus-within:border-blue-500 dark:focus-within:border-blue-400"
          >
            <div className="relative flex items-center justify-between w-full">
              <div className="flex items-center justify-center flex-1">
                <div className="relative w-full flex items-center">
                  {/* AI Mode Button */}
                  {showAiMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleAiMode}
                      className={`inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground rounded-md text-xs mr-2 h-6 w-8 px-1 py-0 transition-all duration-200 ${
                        aiMode 
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                      title="Enter AI Chat Mode (Cmd+Shift+A)"
                    >
                      <div className="flex items-center gap-0.5">
                        <Bot className="w-3 h-3" aria-hidden="true" />
                        <span className="text-[8px] font-medium leading-none">AI</span>
                      </div>
                    </Button>
                  )}

                  {/* Search Icon */}
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />

                  {/* Search Input */}
                  <input
                    ref={inputRef}
                    className="!bg-transparent w-full min-h-[1.5rem] resize-none !border-0 text-sm leading-relaxed shadow-none !outline-none !ring-0 disabled:bg-transparent disabled:opacity-80 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    id="search-input"
                    placeholder={placeholder}
                    style={{ height: "20px" }}
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />

                  {/* Hidden file input (if needed for uploads) */}
                  <input type="file" multiple className="hidden" />

                  {/* Voice Search Button */}
                  {showVoiceSearch && isClient && supportFlag && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`ml-1 p-1.5 rounded-full transition-all duration-200 ${
                        isListening 
                          ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" 
                          : "hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 text-gray-500 dark:text-gray-400"
                      }`}
                      aria-label="Start voice search"
                      title="🎤 Click to search by voice"
                    >
                      <Mic className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative flex items-center space-x-2 ml-2">
                {/* Separator */}
                <div className="h-4 w-px bg-gray-400 dark:bg-gray-500"></div>

                {/* Location Dropdown */}
                {showLocationSelector && (
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center h-6 text-xs border rounded-md transition-all duration-200 bg-background border-border hover:bg-accent px-2"
                          title="Click to set your location"
                        >
                          <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                          <span className="truncate max-w-20 sm:max-w-24 text-foreground">
                            {location || "Location"}
                          </span>
                          <ChevronDown className="w-3 h-3 flex-shrink-0 text-muted-foreground ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuItem onClick={() => setLocation("Current Location")}>
                          <MapPin className="w-4 h-4 mr-2" />
                          Use Current Location
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("San Francisco, CA")}>
                          San Francisco, CA
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("New York, NY")}>
                          New York, NY
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("Los Angeles, CA")}>
                          Los Angeles, CA
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Search Submit Button */}
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  disabled={!query.trim()}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-6 w-6 transition-all duration-200 pointer-events-auto cursor-pointer"
                  title="Search"
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Popular Searches Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-800 dark:border-neutral-700 rounded-lg shadow-lg z-50 overflow-hidden max-h-96">
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handlePopularSearchClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchHeader;
