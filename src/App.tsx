"use client"

import { useState, useEffect } from "react"
import { Clock, Globe, Hash, Plus, X, Moon, Sun } from "lucide-react"
import {
  addToLocalStorageList,
  removeFromLocalStorageList,
  getFromChromeStorage,
  setToChromeStorage,
} from "./content/helpers/utility.ts"
import { getTimeWastingSites } from "./content/timeWastingSitesData.ts"
// Helper function to get domain from URL
const extractDomain = (url: string) => {
  try {
    // Remove protocol and 'www.' if present, then get the hostname.
    const hostname = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]
    const parts = hostname.split(".")
    // If there are more than two parts, assume the first is a subdomain and return the last two.
    if (parts.length > 2) {
      return parts.slice(-2).join(".")
    }
    return hostname
  } catch (error) {
    return url
  }
}

// Helper function to get favicon
const getFaviconUrl = (domain: string) => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

function App() {
  const [isActive, setIsActive] = useState(true)
  const [activeTab, setActiveTab] = useState("tracking")
  const [trackingMode, setTrackingMode] = useState("social")
  const [showAvailableSites, setShowAvailableSites] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [availableSites, setAvailableSites] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for user's preferred color scheme and saved theme
    const loadTheme = async () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const savedTheme = await getFromChromeStorage("timewise-theme")

      if (savedTheme) {
        setDarkMode(savedTheme === "dark")
        document.documentElement.classList.toggle("dark", savedTheme === "dark")
      } else {
        setDarkMode(prefersDark)
        document.documentElement.classList.toggle("dark", prefersDark)
        await setToChromeStorage("timewise-theme", prefersDark ? "dark" : "light")
      }
    }

    loadTheme()
  }, [])

  useEffect(() => {
    if (trackingMode === "social") {
      getTimeWastingSites()
        .then((sites) => {
          setAvailableSites(sites)
        })
        .catch((err) => {
          console.error("Error fetching time wasting sites:", err)
        })
    }
  }, [trackingMode])

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    await setToChromeStorage("timewise-theme", newDarkMode ? "dark" : "light")
  }

  const handleAddSite = (site: string) => {
    if (!availableSites.includes(site)) {
      setAvailableSites([site, ...availableSites])
      addToLocalStorageList("addedSites", site)
      setShowAvailableSites(false)
    }
  }

  const handleRemoveSite = (site: string) => {
    setAvailableSites(availableSites.filter((s) => s !== site))
    removeFromLocalStorageList("removedSites", site)
  }

  const handleAddCustomUrl = () => {
    if (customUrl) {
      const domain = extractDomain(customUrl)
      handleAddSite(domain)
      setCustomUrl("")
      setShowAvailableSites(false)
    }
  }

  return (
    <div className={`min-h-screen bg-[#F8F9FF] dark:bg-slate-900 p-2 w-[400px] transition-colors duration-300`}>
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#6366F1] dark:text-indigo-400 text-xl font-bold">TimeWise</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-indigo-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366F1] dark:peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-xs font-medium text-gray-700 dark:text-slate-300">
                {isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        </div>

        {isActive ? (
          <>
            <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1.5 mb-6 shadow-sm dark:shadow-slate-800/20">
              <button
                onClick={() => setActiveTab("tracking")}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "tracking"
                    ? "text-white bg-[#6366F1] dark:bg-indigo-600"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Tracking
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
                  activeTab === "insights"
                    ? "text-white bg-[#6366F1] dark:bg-indigo-600"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Insights
              </button>
            </div>

            {/* Tracking Content */}
            {activeTab === "tracking" ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm dark:shadow-slate-800/20">
                <h2 className="text-[#6366F1] dark:text-indigo-400 text-lg font-semibold mb-4">Tracking websites</h2>
                {/* Tracking Mode Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4 ">
                  <button
                    onClick={() => setTrackingMode("social")}
                    className={`p-4 rounded-xl flex items-center justify-center transition-all cursor-pointer duration-200 ${
                      trackingMode === "social"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 dark:text-slate-200"
                    }`}
                  >
                    <Hash className="w-5 h-5 mr-2" />
                    Social Media
                  </button>
                  <button
                    onClick={() => setTrackingMode("all")}
                    className={`p-4 rounded-xl flex items-center justify-center transition-all cursor-pointer duration-200 ${
                      trackingMode === "all"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 dark:text-slate-200"
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-1.5" />
                    All Sites
                  </button>
                </div>

                {/* Currently Tracking Section */}
                {trackingMode == "social" && (
                  <div className="space-y-3">
                    {availableSites.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Currently Tracking
                        </h3>
                        <div className="flex flex-col gap-2">
                          {availableSites.slice(0, 3).map((site) => (
                            <div
                              key={site}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded-lg"
                            >
                              <div className="flex items-center">
                                <img
                                  src={getFaviconUrl(site) || "/placeholder.svg"}
                                  alt={`${site} icon`}
                                  className="w-4 h-4 mr-2"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      "https://www.google.com/s2/favicons?domain=example.com&sz=128"
                                  }}
                                />
                                <span className="text-xs font-medium dark:text-slate-200">{site}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveSite(site)}
                                className="text-red-500 dark:text-red-400 text-xs font-medium hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Sites Preview */}
                    <div className="mt-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {availableSites.slice(3, 7).map((site) => (
                            <div
                              key={site}
                              className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800 overflow-hidden"
                            >
                              <img
                                src={getFaviconUrl(site) || "/placeholder.svg"}
                                alt={`${site} icon`}
                                className="w-4 h-4"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src =
                                    "https://www.google.com/s2/favicons?domain=example.com&sz=128"
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowAvailableSites(true)}
                          className="text-xs text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium cursor-pointer"
                        >
                          +{availableSites.length - 3} more
                        </button>
                      </div>
                      <button
                        onClick={() => setShowAvailableSites(true)}
                        className="w-full p-2 rounded-lg bg-[#6366F1] dark:bg-indigo-600 cursor-pointer text-white hover:bg-[#5457E5] dark:hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center group"
                      >
                        <Plus className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium">Add More Sites</span>
                      </button>
                    </div>

                    {/* Sites Dialog */}
                    {showAvailableSites && (
                      <>
                        <div
                          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                          onClick={() => setShowAvailableSites(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 w-full max-w-sm shadow-lg dark:shadow-slate-900/50">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-sm font-semibold dark:text-slate-200">Add or remov Sites to Track</h3>
                              <button
                                onClick={() => setShowAvailableSites(false)}
                                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                              >
                                <X className="w-4 h-4 " />
                              </button>
                            </div>

                            {/* Available Sites List */}
                            <div className="mb-4 max-h-60 overflow-y-auto">
                              {availableSites.map((site) => (
                                <div
                                  key={site}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                                  onClick={() => handleAddSite(site)}
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={getFaviconUrl(site) || "/placeholder.svg"}
                                      alt={`${site} icon`}
                                      className="w-4 h-4 mr-2"
                                      onError={(e) => {
                                        ;(e.target as HTMLImageElement).src =
                                          "https://www.google.com/s2/favicons?domain=example.com&sz=128"
                                      }}
                                    />
                                    <span className="text-sm dark:text-slate-200">{site}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemoveSite(site)
                                    }}
                                    className="text-red-500 dark:text-red-400 text-xs font-medium hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
                                  >
                                    Remove
                                  </button>{" "}
                                </div>
                              ))}
                            </div>

                            {/* Custom URL Input */}
                            <div className="mb-4">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={customUrl}
                                  onChange={(e) => setCustomUrl(e.target.value)}
                                  placeholder="Enter website URL"
                                  className="flex-1 text-xs p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6366F1] dark:focus:ring-indigo-400"
                                />
                                <button
                                  onClick={handleAddCustomUrl}
                                  className="px-3 py-2 bg-[#6366F1] dark:bg-indigo-600 text-white text-xs cursor-pointer rounded-lg hover:bg-[#5457E5] dark:hover:bg-indigo-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-slate-800/20">
                Insights view coming soon
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-slate-800/20">
            Extension is not active
          </div>
        )}
      </div>
    </div>
  )
}

export default App

