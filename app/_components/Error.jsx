"use client"
import { useState, useEffect } from "react"

export default function CenterErrorPage({
  errorCode = "404",
  title = "Trang không tìm thấy",
  message = "Xin lỗi, trang bạn đang tìm kiếm không tồn tại.",
  type = "error",
  showBackButton = true,
  onBack,
  animation = "bounceIn",
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getTypeConfig = () => {
    switch (type) {
      case "error":
        return {
          emoji: "😱",
          bgGradient: "from-red-50 to-pink-50",
          accentColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
          borderColor: "border-red-200",
        }
      case "warning":
        return {
          emoji: "⚠️",
          bgGradient: "from-yellow-50 to-orange-50",
          accentColor: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          borderColor: "border-yellow-200",
        }
      case "success":
        return {
          emoji: "🎉",
          bgGradient: "from-green-50 to-emerald-50",
          accentColor: "text-green-600",
          buttonColor: "bg-green-600 hover:bg-green-700",
          borderColor: "border-green-200",
        }
      case "sad":
        return {
          emoji: "😢",
          bgGradient: "from-gray-50 to-slate-100",
          accentColor: "text-gray-600",
          buttonColor: "bg-gray-500 hover:bg-gray-600",
          borderColor: "border-gray-200",
        }
      case "info":
        return {
          emoji: "💡",
          bgGradient: "from-blue-50 to-cyan-50",
          accentColor: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          borderColor: "border-blue-200",
        }
      default:
        return {
          emoji: "😱",
          bgGradient: "from-red-50 to-pink-50",
          accentColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
          borderColor: "border-red-200",
        }
    }
  }

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0"

    switch (animation) {
      case "slideIn":
        return "animate-slideIn"
      case "bounceIn":
        return "animate-bounceIn"
      case "fadeIn":
        return "animate-fadeIn"
      case "shakeIn":
        return "animate-shakeIn"
      default:
        return "animate-bounceIn"
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const config = getTypeConfig()

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shakeIn {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          25% {
            transform: translateX(10px);
          }
          50% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(2px);
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 7% {
            transform: rotateZ(0);
          }
          15% {
            transform: rotateZ(-15deg);
          }
          20% {
            transform: rotateZ(10deg);
          }
          25% {
            transform: rotateZ(-10deg);
          }
          30% {
            transform: rotateZ(6deg);
          }
          35% {
            transform: rotateZ(-4deg);
          }
          40%, 100% {
            transform: rotateZ(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shakeIn {
          animation: shakeIn 0.7s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full animate-float"></div>
          <div
            className="absolute top-1/4 right-20 w-16 h-16 bg-white/20 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/25 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-10 w-24 h-24 bg-white/15 rounded-full animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className={`relative z-10 text-center max-w-md w-full ${getAnimationClass()}`}>
          {/* Error Code */}
          <div className="mb-8">
            <div className={`text-8xl md:text-9xl font-bold ${config.accentColor} mb-4 animate-wiggle`}>
              {config.emoji}
            </div>
            <div className={`text-6xl md:text-7xl font-bold ${config.accentColor} mb-2`}>{errorCode}</div>
          </div>

          {/* Content Card */}
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 ${config.borderColor} mb-8`}
          >
            <h1 className={`text-2xl md:text-3xl font-bold ${config.accentColor} mb-4`}>{title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{message}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className={`${config.buttonColor} text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Quay lại
                </button>
              )}

              <button
                onClick={() => (window.location.href = "/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Trang chủ
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-gray-500 text-sm">
            <p>Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với chúng tôi.</p>
          </div>
        </div>
      </div>
    </>
  )
}
