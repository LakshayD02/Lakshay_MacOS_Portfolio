"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Dock from "@/components/dock"
import Menubar from "@/components/menubar"
import Wallpaper from "@/components/wallpaper"
import Window from "@/components/window"
import Launchpad from "@/components/launchpad"
import ControlCenter from "@/components/control-center"
import Spotlight from "@/components/spotlight"
import type { AppWindow } from "@/types"

interface DesktopProps {
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  initialDarkMode: boolean
  onToggleDarkMode: () => void
  initialBrightness: number
  onBrightnessChange: (value: number) => void
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness)
  const desktopRef = useRef<HTMLDivElement>(null)

  const settingsApp = {
    id: "settings",
    title: "System Settings",
    component: "Settings",
    position: { x: 120, y: 80 },
    size: { width: 900, height: 640 },
  }

  const appStoreApp = {
    id: "app-store",
    title: "App Store",
    component: "AppStore",
    position: { x: 140, y: 100 },
    size: { width: 900, height: 640 },
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // No default app opening to avoid duplicate key issues

    return () => clearInterval(timer)
  }, [])

  // Update local state when props change
  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  const openApp = (app: AppWindow) => {
    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === app.id)
      if (existing) {
        return prev.map((window) =>
          window.id === app.id ? { ...window, minimized: false } : window
        )
      }
      return [...prev, app]
    })

    setActiveWindowId(app.id)

    if (showLaunchpad) {
      setShowLaunchpad(false)
    }
  }

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id))

    setActiveWindowId((currentActive) => {
      if (currentActive !== id) return currentActive

      const remainingWindows = openWindows.filter((window) => window.id !== id && !window.minimized)
      return remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null
    })
  }

  const minimizeWindow = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, minimized: true } : window))
    )

    setActiveWindowId((currentActive) => {
      if (currentActive !== id) return currentActive

      const remainingWindows = openWindows.filter((window) => window.id !== id && !window.minimized)
      return remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null
    })
  }

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id)
  }

  const toggleLaunchpad = () => {
    setShowLaunchpad(!showLaunchpad)
    if (showControlCenter) setShowControlCenter(false)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleSpotlight = () => {
    setShowSpotlight(!showSpotlight)
    if (showControlCenter) setShowControlCenter(false)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    onToggleDarkMode()
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    onBrightnessChange(value)
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the desktop, not on children
    if (e.target === desktopRef.current) {
      setActiveWindowId(null)
      if (showControlCenter) setShowControlCenter(false)
      if (showSpotlight) setShowSpotlight(false)
    }
  }

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        <Menubar
          time={time}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onOpenAbout={() => openApp(settingsApp)}
          onOpenSettings={() => openApp(settingsApp)}
          onOpenAppStore={() => openApp(appStoreApp)}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          isDarkMode={isDarkMode}
          activeWindow={activeWindowId ? openWindows.find((w) => w.id === activeWindowId) || null : null}
        />

        {/* Windows */}
        <div className="absolute inset-0 pt-6 pb-16">
          {openWindows
            .filter((window) => !window.minimized)
            .map((window) => (
              <Window
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onFocus={() => setActiveWindow(window.id)}
                isDarkMode={isDarkMode}
              />
            ))}
        </div>

        {/* Launchpad */}
        {showLaunchpad && <Launchpad onAppClick={openApp} onClose={() => setShowLaunchpad(false)} />}

        {/* Control Center */}
        {showControlCenter && (
          <ControlCenter
            onClose={() => setShowControlCenter(false)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            brightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        )}

        {/* Spotlight */}
        {showSpotlight && <Spotlight onClose={() => setShowSpotlight(false)} onAppClick={openApp} />}

        <Dock
          onAppClick={openApp}
          onLaunchpadClick={toggleLaunchpad}
          activeAppIds={openWindows.map((w) => w.id)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  )
}
