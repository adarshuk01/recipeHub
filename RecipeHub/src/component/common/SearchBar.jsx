import React, { useEffect, useRef, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'

function SearchBar({ initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false) // ✅ new state
  const navigate = useNavigate()
  const suppressSuggestions = useRef(false)

  // ✅ Fetch suggestions with debounce
  useEffect(() => {
    if (suppressSuggestions.current) {
      suppressSuggestions.current = false
      return
    }

    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        axiosInstance
          .get(`/recipes/suggestions?q=${encodeURIComponent(searchQuery.trim())}`)
          .then(res => {
            setSuggestions(res.data || [])
            setShowSuggestions(isFocused && res.data.length > 0) // ✅ Only show if focused
          })
          .catch(err => {
            console.error('Suggestion fetch error:', err)
            setSuggestions([])
            setShowSuggestions(false)
          })
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, isFocused]) // ✅ track isFocused

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSuggestionClick = (text) => {
    suppressSuggestions.current = true
    setSearchQuery(text)
    setShowSuggestions(false)
    setSuggestions([])
    navigate(`/search/${encodeURIComponent(text)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
      <FiSearch className="absolute top-3 left-3 text-gray-500" size={20} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}      // ✅ show on focus
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // ✅ delay to allow click
        placeholder="Search Recipe"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      {showSuggestions && (
        <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-md shadow max-h-48 overflow-y-auto">
          {suggestions.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="block w-full text-left px-4 py-2 hover:bg-blue-100 text-sm"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

export default SearchBar
