import React, { useEffect } from 'react'

export default function Notification({ message, onClear, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, onClear, duration])

  if (!message) return null

  return (
    <>
      <div className="notification fixed top-0 left-0 w-full bg-red-500 text-white p-4 text-center z-50">
        {message}
      </div>
      <style jsx>{`
        .notification {
          animation: slideDown 0.5s ease-out;
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}