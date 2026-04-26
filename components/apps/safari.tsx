"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Star, Plus, Search, Wifi, X, Globe, ExternalLink } from "lucide-react"

interface SafariProps {
  isDarkMode?: boolean
}

interface Tab {
  id: string
  title: string
  url: string
  isLoading: boolean
}

// Custom search results component
const SearchResults = memo(({ query, isDarkMode, onNavigate }: { query: string; isDarkMode: boolean; onNavigate: (url: string) => void }) => {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate search results (in a real app, you'd use a search API)
    setIsLoading(true)
    // Using a proxy or mock results since Google doesn't allow iframes
    setTimeout(() => {
      setResults([
        {
          title: `${query} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          description: `Read about ${query} on Wikipedia, the free encyclopedia.`
        },
        {
          title: `${query} - Search Results`,
          url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
          description: `Search for ${query} on Bing`
        },
        {
          title: `${query} - YouTube`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
          description: `Watch videos about ${query} on YouTube`
        }
      ])
      setIsLoading(false)
    }, 500)
  }, [query])
  
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const linkColor = isDarkMode ? "text-blue-400" : "text-blue-600"
  const resultBg = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Search results for: <span className="font-semibold">{query}</span>
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className={`${resultBg} rounded-lg p-4`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(result.url)
                  }}
                  className={`${linkColor} text-lg font-medium hover:underline block mb-1`}
                >
                  {result.title}
                </a>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>
                  {result.url}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {result.description}
                </p>
              </div>
            ))}
            
            <div className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} pt-4 mt-4`}>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-center`}>
                Note: Some websites may not load in iframe due to security restrictions. 
                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")}
                  className={`${linkColor} hover:underline ml-1 inline-flex items-center gap-1`}
                >
                  Open in new tab <ExternalLink className="w-3 h-3" />
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

SearchResults.displayName = 'SearchResults'

// Memoized WebView component to prevent unnecessary re-renders
const WebView = memo(({ tab, isDarkMode, onOpenInNewTab }: { tab: Tab; isDarkMode: boolean; onOpenInNewTab?: (url: string) => void }) => {
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    setError(null)
  }, [tab.url])
  
  if (tab.url === "home") {
    return null
  }
  
  // Check if it's a Google search URL
  if (tab.url.includes("google.com/search")) {
    const searchParams = new URL(tab.url).searchParams.get("q")
    if (searchParams) {
      return <SearchResults query={searchParams} isDarkMode={isDarkMode} onNavigate={onOpenInNewTab || ((url: string) => window.open(url, "_blank"))} />
    }
  }
  
  // For other websites that might not allow iframe embedding, show a fallback
  const blockedSites = ["google.com", "youtube.com", "facebook.com", "twitter.com", "instagram.com"]
  const isBlocked = blockedSites.some(site => tab.url.includes(site))
  
  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className={`w-20 h-20 mb-4 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <Globe className={`w-10 h-10 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`} />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Cannot load this website
        </h3>
        <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {tab.url.includes("google.com") ? "Google" : "This website"} doesn't allow embedding in iframes due to security restrictions.
        </p>
        <button
          onClick={() => window.open(tab.url, "_blank")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </button>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full relative">
      {tab.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load website</p>
            <button onClick={() => window.open(tab.url, "_blank")} className="text-blue-500 hover:underline">
              Open in new tab instead
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={tab.url}
          className="w-full h-full border-0"
          title={tab.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          onError={() => setError("Failed to load")}
        />
      )}
    </div>
  )
})

WebView.displayName = 'WebView'

// Memoized HomePage component
const HomePage = memo(({ 
  isDarkMode, 
  onNavigate,
  bookmarks 
}: { 
  isDarkMode: boolean
  onNavigate: (url: string) => void
  bookmarks: any[]
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"

  return (
    <div className="p-8 overflow-y-auto h-full" ref={contentRef}>
      <h2 className="text-2xl font-bold mb-6">SNS Links</h2>

      <div className="grid grid-cols-5 sm:grid-cols-7 gap-6 mb-12">
        {bookmarks.map((link, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer transition-colors`}
            onClick={() => onNavigate(link.url)}
          >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
              <img src={link.icon || "/placeholder.svg"} alt={link.title} className="w-8 h-8 object-contain" />
            </div>
            <span className="text-sm text-center">{link.title}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Frequently Visited</h2>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-12">
        {bookmarks.map((site, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer transition-colors`}
            onClick={() => onNavigate(site.url)}
          >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
              <img src={site.icon || "/placeholder.svg"} alt={site.title} className="w-8 h-8 object-contain" />
            </div>
            <span className="text-sm text-center">{site.title}</span>
          </div>
        ))}
      </div>

      {/* Profile Card */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${cardBg}`}>
          <div className="max-w-2xl mx-auto font-['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Helvetica Neue', sans-serif]">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
              <div className="mb-6">
                <h3 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Lakshay Dhoundiyal
                </h3>
                <p className="text-[15px] text-[#6e6e73] dark:text-[#8e8e93] mt-1">
                  Full Stack Developer & Cyber Security Researcher
                </p>
              </div>
              
              <div className="mb-8">
                <p className="text-[15px] leading-relaxed text-[#1d1d1f] dark:text-[#e5e5ea] opacity-85">
                  Building secure, performant web applications with a focus on user experience. 
                  Passionate about full-stack development, security research, and protecting 
                  digital assets from evolving cyber threats.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate("https://lakshay-projects.vercel.app/")}
                  className="px-5 py-2 bg-[#007aff] hover:bg-[#005fc1] text-white text-[14px] font-medium rounded-lg transition-all duration-200 cursor-pointer"
                >
                  View Projects
                </button>
                <button
                  onClick={() => onNavigate("https://drive.google.com/file/d/1Z09Ibl9qgYtegQjVwaMzzfZdbHbjZNNM/view?usp=drive_link")}
                  className="px-5 py-2 bg-[#e9e9ef] dark:bg-[#2c2c2e] hover:bg-[#dddce2] dark:hover:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white text-[14px] font-medium rounded-lg transition-all duration-200 cursor-pointer"
                >
                  View Resume
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#e9e9ef] dark:border-[#2c2c2e]">
                <div className="flex gap-4 text-[13px] text-[#6e6e73] dark:text-[#8e8e93]">
                  <span>lakshay.dev</span>
                  <span>•</span>
                  <span>security researcher</span>
                  <span>•</span>
                  <a href="mailto:lakshay@example.com" className="hover:text-[#007aff] transition-colors">
                    contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

HomePage.displayName = 'HomePage'

export default function Safari({ isDarkMode = true }: SafariProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Home",
      url: "home",
      isLoading: false,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [urlInput, setUrlInput] = useState("")
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [history, setHistory] = useState<{ [key: string]: string[] }>({})
  const [historyIndex, setHistoryIndex] = useState<{ [key: string]: number }>({})
  const isLoadingRef = useRef(false)
  const lastLoadedUrlRef = useRef<{ [key: string]: string }>({})
  
  const bookmarks = [
    {
      id: "1",
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259",
      icon: "/linkedin.png",
    },
    {
      id: "2",
      title: "GitHub",
      url: "https://github.com/LakshayD02",
      icon: "/github.png",
    },
    {
      id: "3",
      title: "Stack Overflow",
      url: "https://stackoverflow.com/users/29207769/lakshayd02",
      icon: "/stackoverflow.png",
    },
  ]

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  // Get WiFi status from localStorage
  useEffect(() => {
    const checkWifiStatus = () => {
      const status = localStorage.getItem("wifiEnabled")
      setWifiEnabled(status === null ? true : status === "true")
    }
    checkWifiStatus()
    const interval = setInterval(checkWifiStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  // Update URL input when active tab changes
  useEffect(() => {
    if (activeTab) {
      if (activeTab.url === "home") {
        setUrlInput("")
      } else if (activeTab.url.includes("google.com/search")) {
        try {
          const searchParams = new URL(activeTab.url).searchParams.get("q")
          setUrlInput(searchParams || activeTab.url)
        } catch {
          setUrlInput(activeTab.url)
        }
      } else {
        setUrlInput(activeTab.url)
      }
    }
  }, [activeTabId, activeTab?.url])

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"

  // Search engine function
  const searchOrNavigate = useCallback((query: string): string => {
    // Check if it's a URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    const isUrl = urlPattern.test(query.toLowerCase())
    
    if (isUrl) {
      if (!query.startsWith("http")) {
        return "https://" + query
      }
      return query
    } else {
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`
    }
  }, [])

  const createNewTab = useCallback((url?: string, title?: string) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: title || "New Tab",
      url: url || "home",
      isLoading: false,
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    if (url && url !== "home") {
      setTimeout(() => {
        loadUrlInTab(newTab.id, url)
      }, 50)
    }
  }, [])

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (tabs.length === 1) return
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[0].id)
      }
    }
  }, [tabs.length, activeTabId, tabs])

  const loadUrlInTab = useCallback((tabId: string, newUrl: string) => {
    if (!wifiEnabled || newUrl === "home") return
    
    // Prevent duplicate loads
    if (lastLoadedUrlRef.current[tabId] === newUrl && !isLoadingRef.current) {
      return
    }
    
    lastLoadedUrlRef.current[tabId] = newUrl
    isLoadingRef.current = true

    setTabs(prev => 
      prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, isLoading: true }
          : tab
      )
    )

    // Update history
    setHistory(prev => {
      const tabHistory = prev[tabId] || []
      const currentIndex = historyIndex[tabId] || -1
      const newHistory = [...tabHistory.slice(0, currentIndex + 1), newUrl]
      return { ...prev, [tabId]: newHistory }
    })
    setHistoryIndex(prev => ({ ...prev, [tabId]: (historyIndex[tabId] || -1) + 1 }))

    // Simulate loading
    setTimeout(() => {
      setTabs(prev => 
        prev.map(tab => 
          tab.id === tabId 
            ? { ...tab, isLoading: false, url: newUrl, title: getTitleFromUrl(newUrl) }
            : tab
        )
      )
      isLoadingRef.current = false
    }, 300)
  }, [wifiEnabled, historyIndex])

  const getTitleFromUrl = useCallback((url: string) => {
    if (url === "home") return "Home"
    try {
      if (url.includes("google.com/search")) {
        const searchParams = new URL(url).searchParams.get("q")
        if (searchParams) {
          return `Search: ${searchParams.substring(0, 30)}`
        }
      }
      const urlObj = new URL(url)
      return urlObj.hostname.replace("www.", "")
    } catch {
      return url.substring(0, 30)
    }
  }, [])

  const navigateToUrl = useCallback((input: string, openInNewTab: boolean = false) => {
    const finalUrl = searchOrNavigate(input)
    
    if (openInNewTab) {
      createNewTab(finalUrl, getTitleFromUrl(finalUrl))
    } else if (activeTab) {
      loadUrlInTab(activeTabId, finalUrl)
    }
  }, [searchOrNavigate, createNewTab, getTitleFromUrl, activeTab, activeTabId, loadUrlInTab])

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      navigateToUrl(urlInput)
    }
  }, [urlInput, navigateToUrl])

  const handleRefresh = useCallback(() => {
    if (activeTab && activeTab.url !== "home" && wifiEnabled) {
      loadUrlInTab(activeTabId, activeTab.url)
    }
  }, [activeTab, wifiEnabled, activeTabId, loadUrlInTab])

  const handleGoBack = useCallback(() => {
    const tabHistory = history[activeTabId] || []
    const currentIndex = historyIndex[activeTabId] || 0
    if (currentIndex > 0) {
      const prevUrl = tabHistory[currentIndex - 1]
      setHistoryIndex(prev => ({ ...prev, [activeTabId]: currentIndex - 1 }))
      setTabs(prev =>
        prev.map(tab =>
          tab.id === activeTabId
            ? { ...tab, url: prevUrl, title: getTitleFromUrl(prevUrl) }
            : tab
        )
      )
    }
  }, [history, historyIndex, activeTabId, getTitleFromUrl])

  const handleGoForward = useCallback(() => {
    const tabHistory = history[activeTabId] || []
    const currentIndex = historyIndex[activeTabId] || 0
    if (currentIndex < tabHistory.length - 1) {
      const nextUrl = tabHistory[currentIndex + 1]
      setHistoryIndex(prev => ({ ...prev, [activeTabId]: currentIndex + 1 }))
      setTabs(prev =>
        prev.map(tab =>
          tab.id === activeTabId
            ? { ...tab, url: nextUrl, title: getTitleFromUrl(nextUrl) }
            : tab
        )
      )
    }
  }, [history, historyIndex, activeTabId, getTitleFromUrl])

  const handleGoHome = useCallback(() => {
    if (activeTab) {
      setTabs(prev =>
        prev.map(tab =>
          tab.id === activeTabId
            ? { ...tab, url: "home", title: "Home", isLoading: false }
            : tab
        )
      )
      setUrlInput("")
    }
  }, [activeTab, activeTabId])

  const handleOpenInNewTab = useCallback((url: string) => {
    window.open(url, "_blank")
  }, [])

  const NoInternetView = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className={`w-24 h-24 mb-6 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <Wifi className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`} />
      </div>
      <h2 className={`text-xl font-semibold mb-2 ${textColor}`}>You Are Not Connected to the Internet</h2>
      <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
        This page can't be displayed because your computer is currently offline.
      </p>
      <button
        className={`px-4 py-2 rounded ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
      {/* Toolbar */}
      <div className={`${toolbarBg} border-b ${borderColor} p-2 flex items-center space-x-2 flex-shrink-0`}>
        <button 
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${!history[activeTabId]?.length ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleGoBack}
          disabled={!history[activeTabId]?.length || (historyIndex[activeTabId] || 0) <= 0}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${!history[activeTabId]?.length ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleGoForward}
          disabled={!history[activeTabId]?.length || (historyIndex[activeTabId] || 0) >= (history[activeTabId]?.length || 0) - 1}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button 
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={handleGoHome}
        >
          <Home className="w-4 h-4" />
        </button>

        <form onSubmit={handleUrlSubmit} className={`flex-1 flex items-center ${inputBg} rounded px-3 py-1`}>
          <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className={`w-full bg-transparent focus:outline-none text-sm ${textColor}`}
            placeholder="Search Google or enter URL"
          />
        </form>

        <button 
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={() => setShowBookmarks(!showBookmarks)}
        >
          <Star className="w-4 h-4" />
        </button>
        
        <button 
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={() => createNewTab()}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarks dropdown */}
      {showBookmarks && (
        <div className={`absolute top-12 right-2 w-64 ${cardBg} border ${borderColor} rounded-lg shadow-lg z-20`}>
          <div className="p-2">
            <h3 className="text-sm font-semibold mb-2 px-2">Bookmarks</h3>
            {bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${hoverBg}`}
                onClick={() => {
                  navigateToUrl(bookmark.url)
                  setShowBookmarks(false)
                }}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{bookmark.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className={`${toolbarBg} border-b ${borderColor} px-2 flex items-center overflow-x-auto flex-shrink-0`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`px-3 py-1 text-sm rounded-t flex items-center whitespace-nowrap cursor-pointer ${
              activeTabId === tab.id 
                ? isDarkMode ? "bg-gray-900" : "bg-white"
                : ""
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="mr-2 max-w-[120px] truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <button 
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-500 ml-2"
                onClick={(e) => closeTab(tab.id, e)}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!wifiEnabled ? (
          <NoInternetView />
        ) : activeTab && activeTab.url === "home" ? (
          <HomePage 
            isDarkMode={isDarkMode} 
            onNavigate={navigateToUrl}
            bookmarks={bookmarks}
          />
        ) : activeTab ? (
          <WebView tab={activeTab} isDarkMode={isDarkMode} onOpenInNewTab={handleOpenInNewTab} />
        ) : null}
      </div>
    </div>
  )
}