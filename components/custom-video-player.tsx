"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface CustomVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
}

export function CustomVideoPlayer({ src, poster, title = "Video Player", className }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current || hasError) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
        setHasError(true)
        setErrorMessage("Unable to play video")
      })
    }
  }

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  // Handle progress change
  const handleProgressChange = (value: number[]) => {
    if (!videoRef.current || hasError) return
    const newTime = (value[0] / 100) * duration
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const newVolume = value[0] / 100
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return

    if (isMuted) {
      videoRef.current.volume = volume
      setIsMuted(false)
    } else {
      videoRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (!videoRef.current || hasError) return
    videoRef.current.currentTime += seconds
  }

  // Change playback speed
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current || hasError) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  // Show controls temporarily
  const showControlsTemporarily = () => {
    setShowControls(true)

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
      setHasError(false)
    }
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }
    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setIsLoading(false)
      setHasError(true)
      setErrorMessage("Video failed to load. Please check the video source.")
    }
    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("volumechange", handleVolumeChange)
    video.addEventListener("error", handleError)
    video.addEventListener("loadstart", handleLoadStart)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("volumechange", handleVolumeChange)
      video.removeEventListener("error", handleError)
      video.removeEventListener("loadstart", handleLoadStart)
    }
  }, [])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipTime(-10)
          break
        case "ArrowRight":
          e.preventDefault()
          skipTime(10)
          break
        case "ArrowUp":
          e.preventDefault()
          handleVolumeChange([Math.min(100, (volume + 0.1) * 100)])
          break
        case "ArrowDown":
          e.preventDefault()
          handleVolumeChange([Math.max(0, (volume - 0.1) * 100)])
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [volume, isPlaying])

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-card rounded-lg overflow-hidden shadow-lg group",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
    >
      {/* Video Element */}
      <video ref={videoRef} src={src} poster={poster} className="w-full h-full object-cover" onClick={togglePlay} />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center text-center p-8">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Video Unavailable</h3>
          <p className="text-muted-foreground mb-4 max-w-md">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">Try using a valid video URL (MP4, WebM, or OGG format)</p>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 transition-opacity duration-300",
          showControls || hasError ? "opacity-100" : "opacity-0",
        )}
      >
        {!hasError && (
          <>
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[progressPercentage]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full"
                disabled={hasError}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-foreground hover:text-primary"
                  disabled={hasError}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Skip Backward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="text-foreground hover:text-primary"
                  disabled={hasError}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                {/* Skip Forward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="text-foreground hover:text-primary"
                  disabled={hasError}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-foreground hover:text-primary"
                    disabled={hasError}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      disabled={hasError}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Playback Speed */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground hover:text-primary"
                      disabled={hasError}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={playbackRate === rate ? "bg-accent" : ""}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-foreground hover:text-primary"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Title */}
        {title && (
          <div className="mt-2">
            <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
          </div>
        )}
      </div>
    </div>
  )
}
