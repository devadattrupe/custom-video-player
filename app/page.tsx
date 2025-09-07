import { CustomVideoPlayer } from "@/components/custom-video-player"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Custom Video Player</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A sophisticated video player with advanced controls, keyboard shortcuts, and a sleek dark theme design.
          </p>
        </div>

        <div className="space-y-6">
          <CustomVideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="/placeholder.svg?height=400&width=800&text=Big Buck Bunny"
            title="Big Buck Bunny - Sample Video"
            className="aspect-video"
          />

          <CustomVideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            poster="/placeholder.svg?height=400&width=800&text=Elephants Dream"
            title="Elephants Dream - Another Sample"
            className="aspect-video"
          />

          <div className="bg-card rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Play/Pause:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skip Back 10s:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skip Forward 10s:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume Up:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume Down:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mute/Unmute:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">M</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fullscreen:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">F</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Custom progress bar with precise seeking</li>
              <li>• Volume control with visual slider</li>
              <li>• Playback speed adjustment (0.5x to 2x)</li>
              <li>• Fullscreen support with native browser API</li>
              <li>• Auto-hiding controls during playback</li>
              <li>• Comprehensive keyboard shortcuts</li>
              <li>• Loading states and smooth transitions</li>
              <li>• Responsive design for all screen sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
