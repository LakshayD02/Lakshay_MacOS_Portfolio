"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Moon, Sun, Key, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LoginScreen({
  onLogin,
  isDarkMode,
  onToggleDarkMode,
}: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "lakshaymac") {
      setError(false);
      setErrorMessage("");
      onLogin();
    } else if (password.length === 0) {
      setError(true);
      setErrorMessage("Please enter a password");
    } else {
      setError(true);
      setErrorMessage("Incorrect password. Please try again.");
    }
  };

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Choose wallpaper based on dark/light mode
  const wallpaper = isDarkMode ? "/wallpaper-night.jpg" : "/wallpaper-day.jpg";

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <span className="text-white text-5xl font-bold">LD</span>
        </div>
        <h2 className="text-white text-2xl font-medium mb-6">Lakshay Dhoundiyal</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
          <div className="relative w-full">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
                setErrorMessage("");
              }}
              className={`w-full pl-9 pr-10 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 ${
                error ? "ring-2 ring-red-500 focus:ring-red-500" : ""
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Hint - Made more visible */}
          <div className="w-full mt-3 text-center">
            <p className="text-white/80 text-sm font-mono tracking-wide">
              Hint: <span className="text-white font-semibold">lakshaymac</span>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full mt-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="outline"
            className="mt-6 bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white hover:text-black transition-all duration-200 w-32"
          >
            Login
          </Button>
        </form>
      </div>

      <div className="fixed bottom-8">
        <button
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}