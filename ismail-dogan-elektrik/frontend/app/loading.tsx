export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-cyber-dark-700" />
          
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neon-blue-500 animate-spin" />
          
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-neon-blue-500/20 animate-pulse" />
          
          {/* Center dot */}
          <div className="absolute inset-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-neon-blue-400" />
        </div>

        {/* Loading text */}
        <p className="text-gray-400 font-medium">Yükleniyor...</p>

        {/* Electric animation dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-neon-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-neon-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-neon-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
