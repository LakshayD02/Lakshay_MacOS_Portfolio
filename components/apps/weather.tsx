"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Droplets, Wind, Sunrise, Sunset, Cloud, CloudRain, CloudSnow, Sun, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WeatherProps {
  isDarkMode?: boolean
}

interface WeatherData {
  current: {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    sunrise: string
    sunset: string
    feelsLike: number
  }
  forecast: Array<{
    day: string
    temp: number
    condition: string
  }>
}

interface CitySuggestion {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "snowy"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

const API_KEY = "5f8b7fa065c8de159eb9939a2075766b"

export default function Weather({ isDarkMode = true }: WeatherProps) {
  const [city, setCity] = useState("Delhi, IN")
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [condition, setCondition] = useState<WeatherCondition>("partly-cloudy")
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  
  // Fetch city suggestions as user types
  const fetchCitySuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    setIsSearching(true)
    
    try {
      const geoUrl = `/api/weather/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`
      const response = await fetch(geoUrl)
      
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }
      
      const data = await response.json()
      
      if (data && Array.isArray(data)) {
        const citySuggestions: CitySuggestion[] = data.map((city: any) => ({
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon
        }))
        setSuggestions(citySuggestions)
        setShowSuggestions(true)
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }
  
  // Handle search input with debounce
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(true)
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    searchTimeout.current = setTimeout(() => {
      fetchCitySuggestions(value)
    }, 300) // Debounce to avoid too many API calls
  }
  
  // Handle city selection from suggestions
  const handleCitySelect = (selectedCity: CitySuggestion) => {
    const cityName = selectedCity.state 
      ? `${selectedCity.name}, ${selectedCity.state}, ${selectedCity.country}`
      : `${selectedCity.name}, ${selectedCity.country}`
    
    setCity(cityName)
    setSearchQuery(cityName)
    setShowSuggestions(false)
    fetchWeatherByCoordinates(selectedCity.lat, selectedCity.lon, cityName)
  }
  
  // Fetch weather using coordinates
  const fetchWeatherByCoordinates = async (lat: number, lon: number, cityName: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch current weather
      const weatherUrl = `/api/weather/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      const weatherResponse = await fetch(weatherUrl)
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }
      
      const currentData = await weatherResponse.json()
      
      // Fetch 5-day forecast
      const forecastUrl = `/api/weather/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      const forecastResponse = await fetch(forecastUrl)
      
      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data")
      }
      
      const forecastData = await forecastResponse.json()
      
      // Process forecast data
      const dailyForecasts = []
      const days = new Set()
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000)
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' })
        
        if (!days.has(dayKey) && dailyForecasts.length < 5) {
          days.add(dayKey)
          dailyForecasts.push({
            day: dayKey,
            temp: Math.round(item.main.temp),
            condition: item.weather[0].description,
          })
        }
      }
      
      const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      const weatherData: WeatherData = {
        current: {
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          sunrise: formatTime(currentData.sys.sunrise),
          sunset: formatTime(currentData.sys.sunset),
          feelsLike: Math.round(currentData.main.feels_like),
        },
        forecast: dailyForecasts,
      }
      
      setWeather(weatherData)
      setCity(cityName)
      
      // Set condition for animations
      const mainCondition = currentData.weather[0].main.toLowerCase()
      if (mainCondition.includes("rain") || mainCondition.includes("drizzle")) {
        setCondition("rainy")
      } else if (mainCondition.includes("snow")) {
        setCondition("snowy")
      } else if (mainCondition.includes("cloud")) {
        setCondition("partly-cloudy")
      } else if (mainCondition.includes("clear")) {
        setCondition("sunny")
      } else {
        setCondition("partly-cloudy")
      }
      
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch weather for Delhi on component mount
  useEffect(() => {
    const fetchDelhiWeather = async () => {
      try {
        // Get Delhi coordinates
        const geoUrl = `/api/weather/geo/1.0/direct?q=Delhi&limit=1&appid=${API_KEY}`
        const response = await fetch(geoUrl)
        const data = await response.json()
        
        if (data && data[0]) {
          await fetchWeatherByCoordinates(data[0].lat, data[0].lon, "Delhi, IN")
        }
      } catch (err) {
        console.error("Error fetching Delhi weather:", err)
        setError("Failed to load default weather data")
      }
    }
    
    fetchDelhiWeather()
  }, [])
  
  // Initialize particles and animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    initParticles()
    
    const animate = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      updateParticles(ctx, canvas.width, canvas.height)
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [condition])
  
  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const initParticles = () => {
    particles.current = []
    const count = condition === "rainy" ? 100 : condition === "snowy" ? 80 : condition === "sunny" ? 50 : 30
    
    for (let i = 0; i < count; i++) {
      let particle: Particle
      
      if (condition === "rainy") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 7 + 10,
          opacity: Math.random() * 0.5 + 0.5,
          color: isDarkMode ? 'rgba(120, 160, 255, 0.8)' : 'rgba(0, 90, 190, 0.6)'
        }
      } else if (condition === "snowy") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 + 1,
          opacity: Math.random() * 0.3 + 0.7,
          color: 'rgba(255, 255, 255, 0.8)'
        }
      } else if (condition === "sunny") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          color: isDarkMode ? `rgba(255, ${200 + Math.random() * 55}, 0, ${Math.random() * 0.5 + 0.3})` : `rgba(255, ${200 + Math.random() * 55}, 0, ${Math.random() * 0.7 + 0.3})`
        }
      } else {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 30,
          size: Math.random() * 30 + 20,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: 0,
          opacity: Math.random() * 0.2 + 0.1,
          color: isDarkMode ? 'rgba(200, 200, 220, 0.3)' : 'rgba(255, 255, 255, 0.7)'
        }
      }
      particles.current.push(particle)
    }
  }
  
  const updateParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    particles.current.forEach(p => {
      const x = (p.x / 100) * width
      const y = (p.y / 100) * height
      
      ctx.beginPath()
      
      if (condition === "rainy") {
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size / 2
        ctx.moveTo(x, y)
        ctx.lineTo(x + p.speedX, y + p.size * 2)
        ctx.stroke()
      } else if (condition === "snowy" || condition === "sunny") {
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      p.x += p.speedX * 0.1
      p.y += p.speedY * 0.1
      
      if (condition === "rainy" || condition === "snowy") {
        if (p.y > 100) {
          p.y = 0
          p.x = Math.random() * 100
        }
        if (p.x < 0 || p.x > 100) {
          p.x = Math.random() * 100
        }
      } else if (condition === "sunny") {
        if (p.x < 0) p.x = 100
        if (p.x > 100) p.x = 0
        if (p.y < 0) p.y = 100
        if (p.y > 100) p.y = 0
      } else {
        if (p.x < -30) p.x = 130
        if (p.x > 130) p.x = -30
      }
    })
  }
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchCitySuggestions(searchQuery)
    }
  }
  
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear")) return <Sun className="w-6 h-6" />
    if (conditionLower.includes("cloud")) return <Cloud className="w-6 h-6" />
    if (conditionLower.includes("rain")) return <CloudRain className="w-6 h-6" />
    if (conditionLower.includes("snow")) return <CloudSnow className="w-6 h-6" />
    return <Cloud className="w-6 h-6" />
  }
  
  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col relative overflow-hidden`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Search bar with autocomplete */}
        <div className="p-4 relative" ref={suggestionsRef}>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search any city in the world... (e.g., London, New York, Tokyo)"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && fetchCitySuggestions(searchQuery)}
                className={`pl-10 pr-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                autoComplete="off"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSuggestions([])
                    setShowSuggestions(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Button 
              onClick={() => searchQuery.trim() && fetchCitySuggestions(searchQuery)}
              variant={isDarkMode ? "outline" : "default"}
              className={isDarkMode ? "border-gray-700" : ""}
              disabled={loading || isSearching}
            >
              Search
            </Button>
          </div>
          
          {/* Autocomplete suggestions dropdown */}
          {showSuggestions && (suggestions.length > 0 || isSearching) && (
            <div className={`absolute left-4 right-4 mt-1 ${cardBg} border ${borderColor} rounded-lg shadow-lg max-h-96 overflow-y-auto z-20`}>
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm">Searching cities...</p>
                </div>
              ) : (
                <>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${suggestion.country}-${index}`}
                      onClick={() => handleCitySelect(suggestion)}
                      className={`w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b ${borderColor} last:border-b-0`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">{suggestion.name}</span>
                            {suggestion.state && (
                              <span className="text-sm text-gray-500 ml-1">, {suggestion.state}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-6">{suggestion.country}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Select
                        </Button>
                      </div>
                    </button>
                  ))}
                  {suggestions.length === 0 && !isSearching && (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No cities found. Try a different search term.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mx-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading weather for {city}...</p>
            </div>
          </div>
        )}
        
        {!loading && weather && (
          <>
            {/* Current weather */}
            <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  <h2 className="text-2xl font-bold">{city}</h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                
                <div className="flex items-center mt-4">
                  <div className="text-6xl font-light mr-4">{weather.current.temp}°C</div>
                  <div>
                    <p className="text-lg capitalize">{weather.current.condition}</p>
                    <p className="text-sm text-gray-500">Feels like {weather.current.feelsLike}°C</p>
                  </div>
                </div>
              </div>
              
              <div className={`${cardBg} p-4 rounded-lg border ${borderColor} grid grid-cols-2 gap-4 w-full md:w-auto`}>
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-medium">{weather.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="font-medium">{weather.current.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Sunrise className="w-5 h-5 mr-2 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sunrise</p>
                    <p className="font-medium">{weather.current.sunrise}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Sunset className="w-5 h-5 mr-2 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sunset</p>
                    <p className="font-medium">{weather.current.sunset}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Forecast */}
            <div className="px-6 mt-4 pb-6">
              <h3 className="text-lg font-medium mb-3">5-Day Forecast</h3>
              <div className={`grid grid-cols-5 gap-2 ${cardBg} rounded-lg border ${borderColor} p-4`}>
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <p className="font-medium">{day.day}</p>
                    <div className="my-2">{getWeatherIcon(day.condition)}</div>
                    <p className="text-lg font-medium">{day.temp}°C</p>
                    <p className="text-xs text-gray-500 text-center capitalize">
                      {day.condition.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}