"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"

interface SpotifyProps {
  isDarkMode?: boolean
}

export default function Spotify({ isDarkMode = true }: SpotifyProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  // New playlist with different songs and working audio URLs
  const playlist = [
    {
      title: "Midnight Drive",
      artist: "Lofi Dreams",
      cover: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "3:42",
    },
    {
      title: "Ocean Waves",
      artist: "Chill Beats",
      cover: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "2:56",
    },
    {
      title: "City Lights",
      artist: "Urban Sound",
      cover: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "4:10",
    },
    {
      title: "Mountain Air",
      artist: "Nature Vibes",
      cover: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "3:28",
    },
    {
      title: "Neon Nights",
      artist: "Synthwave",
      cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      duration: "3:55",
    },
    {
      title: "Jazz Cafe",
      artist: "Smooth Jazz",
      cover: "https://images.pexels.com/photos/270288/pexels-photo-270288.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      duration: "4:22",
    },
    {
      title: "Electric Dreams",
      artist: "EDM Masters",
      cover: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      duration: "3:18",
    },
    {
      title: "Rainy Day",
      artist: "Piano Relax",
      cover: "https://images.pexels.com/photos/164715/pexels-photo-164715.jpeg?w=300&h=300&fit=crop",
      file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      duration: "3:45",
    },
  ]

  const currentTrack = playlist[currentTrackIndex]

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const secondaryBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsAudioReady(false)
    setError(null)
    setCurrentTime(0)
    setDuration(0)

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsAudioReady(true)
    }
    const handleEnd = () => handleNext()
    const handleCanPlayThrough = () => setIsAudioReady(true)
    const handleError = () => {
      console.error("Audio error for track:", currentTrack.title)
      setError("Unable to load this track. Try another one.")
      setIsAudioReady(false)
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("ended", handleEnd)
    audio.addEventListener("error", handleError)

    audio.load()

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("ended", handleEnd)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioReady) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
          setError("Click play to start listening")
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, isAudioReady])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!isAudioReady) {
      setError("Loading track, please wait...")
      return
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
  }

  const handleNext = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number.parseFloat(e.target.value)
    try {
      audio.currentTime = newTime
      setCurrentTime(newTime)
    } catch (err) {
      console.error("Error setting time:", err)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay()
      return
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex(index)
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col`}>
      {/* Header */}
      <div className={`${secondaryBg} p-4 flex items-center justify-between border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🎵</span>
          </div>
          <h2 className="font-semibold">Spotify</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
        <div className="w-48 h-48 mb-6 rounded-md overflow-hidden shadow-lg bg-gray-800">
          <img
            src={currentTrack.cover}
            alt={`${currentTrack.title} cover`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"
            }}
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          {error && <p className="text-yellow-400 text-xs mt-1">{error}</p>}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{isAudioReady ? formatTime(duration) : currentTrack.duration}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleTimeChange}
            disabled={!isAudioReady}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                (currentTime / (duration || 1)) * 100
              }%, #4D4D4D ${(currentTime / (duration || 1)) * 100}%, #4D4D4D 100%)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
            onClick={handlePrevious}
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            className={`p-3 rounded-full transition-all ${isAudioReady ? "bg-white hover:scale-105" : "bg-gray-400 cursor-not-allowed"}`}
            onClick={togglePlay}
            disabled={!isAudioReady}
          >
            {isPlaying ? <Pause className="w-8 h-8 text-black" /> : <Play className="w-8 h-8 text-black" />}
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
            onClick={handleNext}
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center w-full max-w-xs">
          <button className="p-2 rounded-full hover:bg-gray-700 mr-2 transition-all" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(isMuted ? 0 : volume) * 100}%, #4D4D4D ${
                (isMuted ? 0 : volume) * 100
              }%, #4D4D4D 100%)`,
            }}
          />
        </div>
      </div>

      {/* Playlist */}
      <div className={`${secondaryBg} p-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className="font-medium mb-2 text-sm">Playlist</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {playlist.map((track, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded cursor-pointer transition-all ${
                currentTrackIndex === index ? "bg-green-500/20" : "hover:bg-gray-700/30"
              }`}
              onClick={() => selectTrack(index)}
            >
              <div className="w-8 h-8 mr-3 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                <img src={track.cover} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${currentTrackIndex === index ? "text-green-500" : ""}`}>
                  {track.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
              </div>
              <div className="text-xs text-gray-400 ml-2">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} preload="auto" />
    </div>
  )
}