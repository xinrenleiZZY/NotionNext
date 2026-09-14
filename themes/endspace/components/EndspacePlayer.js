import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconList,
  IconVolume,
} from '@tabler/icons-react'

/**
 * EndspacePlayer Component - Compact Sci-Fi Music Player for Endspace Theme
 * Integrates with widget.config.js settings
 * Has two states: expanded (full info) and collapsed (rotating cover when playing)
 * Tabler Icons for Futuristic Feel
 */
export const EndspacePlayer = ({ isExpanded }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const playOrderRef = useRef('random')
  const handleTrackEndRef = useRef(null)

  // Get configuration from widget.config.js
  const musicPlayerEnabled = siteConfig('MUSIC_PLAYER')
  const playOrder = siteConfig('MUSIC_PLAYER_ORDER')
  const audioList = siteConfig('MUSIC_PLAYER_AUDIO_LIST') || []

  const currentAudio = audioList[currentTrack] || {}
  playOrderRef.current = playOrder

  // Initialize audio element
  useEffect(() => {
    if (!musicPlayerEnabled || audioList.length === 0) return
    const audio = new Audio()
    audio.volume = 0.7
    audio.preload = 'metadata'
    audioRef.current = audio

    const onLoadedMetadata = () => {
      setIsLoading(false)
      setDuration(audio.duration || 0)
    }
    const onError = () => {
      console.error('Audio load error:', audio.error)
      setIsLoading(false)
      setHasError(true)
      setIsPlaying(false)
    }
    const onPlay = () => setIsLoading(false)
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)
    const onEnded = () => handleTrackEndRef.current?.()

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Load new track only when the track changes (不随 播放/暂停 重新加载)
  useEffect(() => {
    const audio = audioRef.current
    const track = audioList[currentTrack]
    if (!audio || !track?.url) return
    audio.src = track.url
    audio.load()
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setHasError(false)
    setIsLoading(true)
  }, [currentTrack])

  // 播放/暂停状态与 audio 元素同步（不会重头播放）
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioList[currentTrack]?.url) return
    if (isPlaying) {
      setIsLoading(true)
      audio.play().catch(e => {
        console.log('Play prevented:', e)
        setIsPlaying(false)
        setIsLoading(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])



  // Progress update
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const current = audioRef.current.currentTime
          const total = audioRef.current.duration || 1
          setCurrentTime(current)
          setProgress((current / total) * 100)
        }
      }, 200)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  // Close playlist when sidebar collapses
  useEffect(() => {
    if (!isExpanded) {
      setShowPlaylist(false)
    }
  }, [isExpanded])

  const handleTrackEnd = () => {
    if (audioList.length <= 1) {
      audioRef.current?.pause()
      setIsPlaying(false)
      return
    }
    if (playOrderRef.current === 'random') {
      let next = Math.floor(Math.random() * audioList.length)
      if (next === currentTrack) {
        next = (next + 1) % audioList.length
      }
      setCurrentTrack(next)
    } else {
      setCurrentTrack((prev) => (prev + 1) % audioList.length)
    }
  }
  handleTrackEndRef.current = handleTrackEnd

  const togglePlay = (e) => {
    e?.stopPropagation()
    setIsPlaying(prev => !prev)
  }

  const playNext = (e) => {
    e?.stopPropagation()
    if (playOrderRef.current === 'random') {
      let next = Math.floor(Math.random() * audioList.length)
      if (next === currentTrack) {
        next = (next + 1) % audioList.length
      }
      setCurrentTrack(next)
    } else {
      setCurrentTrack((prev) => (prev + 1) % audioList.length)
    }
  }

  const playPrev = (e) => {
    e?.stopPropagation()
    setCurrentTrack((prev) => (prev - 1 + audioList.length) % audioList.length)
  }

  const selectTrack = (index) => {
    setShowPlaylist(false)
    if (index === currentTrack) {
      setIsPlaying(true)
    } else {
      setCurrentTrack(index)
      setIsPlaying(true)
    }
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
    const target = percentage * audioRef.current.duration
    audioRef.current.currentTime = target
    setCurrentTime(target)
    setProgress(percentage * 100)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Don't render if disabled or no audio
  if (!musicPlayerEnabled || audioList.length === 0) {
    return null
  }

  // Collapsed State: 旋转圆盘（黑胶唱片）— 播放时旋转，悬停显示暂停/播放
  if (!isExpanded) {
    return (
      <div className="endspace-player-mini flex justify-center py-2">
        <div
          className="endspace-player-disc-wrap cursor-pointer group"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {/* 旋转圆盘本体（封面 + 中心孔） */}
          <div
            className={`endspace-player-disc ${isPlaying ? 'endspace-player-rotating' : ''}`}
          >
            <img
              src={currentAudio.cover || '/default-cover.jpg'}
              alt="Cover"
            />
            <span className="endspace-player-disc-hole" />
          </div>
          {/* 悬停/加载浮层（不随圆盘旋转） */}
          <div
            className={`endspace-player-disc-overlay ${isLoading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            {isLoading ? (
              <span className="endspace-player-spinner" />
            ) : isPlaying ? (
              <IconPlayerPause size={14} stroke={2} className="text-white" />
            ) : (
              <IconPlayerPlay size={14} stroke={2} className="text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>
    )
  }

  // Expanded State: 参考图风格 - 圆角卡片 + 紫色渐变播放按钮
  return (
    <div className="endspace-player-card mx-2 mb-2 px-3 py-3 relative">
      {/* 主内容行 */}
      <div className="flex gap-3 items-center">
        {/* 专辑封面 - 圆角矩形 */}
        <div className="endspace-player-cover relative flex-shrink-0 w-11 h-11">
          <img
            src={currentAudio.cover || '/default-cover.jpg'}
            alt="Album Cover"
            className={`w-full h-full object-cover transition-transform duration-300 ${isPlaying ? 'scale-105' : ''}`}
          />
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-[inherit]">
              <span className="text-[9px] leading-tight text-white/90 text-center px-0.5">加载失败</span>
            </div>
          )}
        </div>

        {/* 歌曲信息 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-sm font-bold text-[var(--endspace-text-primary)] truncate leading-tight">
            {currentAudio.name || 'Unknown Track'}
          </div>
          <div className="text-xs text-[var(--endspace-text-muted)] truncate mt-0.5 flex items-center gap-1.5">
            <span className="truncate">{currentAudio.artist || 'Unknown Artist'}</span>
            <span className="endspace-tag-green flex-shrink-0">FREE</span>
          </div>
          {/* 进度条 */}
          <div className="mt-1.5 flex items-center gap-2">
            <div
              className="endspace-player-progress-track flex-1 h-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="endspace-player-progress h-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-[var(--endspace-text-muted)] whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* 紫色渐变播放按钮（参考图核心视觉） */}
        <button
          onClick={togglePlay}
          className="endspace-player-btn-purple flex-shrink-0 w-10 h-10 flex items-center justify-center"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading && isPlaying ? (
            <span className="endspace-player-spinner" />
          ) : isPlaying ? (
            <IconPlayerPause size={16} stroke={2} className="text-white" />
          ) : (
            <IconPlayerPlay size={16} stroke={2} className="text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* 次级操作行：列表 + 上下首 */}
      <div className="mt-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <button
            onClick={playPrev}
            className="w-6 h-6 flex items-center justify-center text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)] transition-colors"
            title="Previous"
          >
            <IconPlayerTrackPrev size={12} stroke={1.5} />
          </button>
          <button
            onClick={playNext}
            className="w-6 h-6 flex items-center justify-center text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)] transition-colors"
            title="Next"
          >
            <IconPlayerTrackNext size={12} stroke={1.5} />
          </button>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowPlaylist(!showPlaylist) }}
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${showPlaylist ? 'bg-[var(--endspace-text-primary)] text-white' : 'text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)]'}`}
          title="Playlist"
        >
          <IconList size={13} stroke={1.5} />
        </button>
      </div>

      {/* 播放列表下拉 */}
      {showPlaylist && (
        <div className="mt-2 max-h-36 overflow-y-auto bg-[var(--endspace-bg-secondary)] rounded-lg">
          {audioList.map((audio, index) => (
            <div
              key={index}
              onClick={() => selectTrack(index)}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                index === currentTrack
                  ? 'bg-[var(--endspace-bg-tertiary)]'
                  : 'hover:bg-[var(--endspace-bg-tertiary)]'
              }`}
            >
              <div className={`text-xs truncate flex items-center gap-1.5 ${
                index === currentTrack ? 'text-[var(--endspace-text-primary)] font-medium' : 'text-[var(--endspace-text-secondary)]'
              }`}>
                {index === currentTrack && isPlaying && (
                  <IconVolume size={11} stroke={1.5} className="flex-shrink-0 text-[var(--endspace-brand-purple-to)]" />
                )}
                {index === currentTrack && !isPlaying && (
                  <IconPlayerPause size={11} stroke={1.5} className="flex-shrink-0" />
                )}
                {index !== currentTrack && (
                  <span className="w-3 text-center font-mono text-[9px] text-[var(--endspace-text-muted)] flex-shrink-0">{index + 1}</span>
                )}
                <span className="truncate">{audio.name}</span>
              </div>
              <div className="text-[10px] text-[var(--endspace-text-muted)] truncate pl-4 mt-0.5">
                {audio.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EndspacePlayer
