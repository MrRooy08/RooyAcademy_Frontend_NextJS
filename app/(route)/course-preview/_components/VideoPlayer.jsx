import React from 'react'

function VideoPlayer({videoUrl}) {
  return (
    <div className="relative w-full pb-[56.25%] "> {/* Tỷ lệ 16:9 */}
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoUrl}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    
  )
}

export default VideoPlayer