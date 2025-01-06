'use client'

import { useState, useEffect } from 'react'

type FadeTransitionProps = {
  children: React.ReactNode;
  show: boolean;
}

export function FadeTransition({ children, show }: FadeTransitionProps) {
  const [render, setRender] = useState(show)

  useEffect(() => {
    if (show) setRender(true)
  }, [show])

  const onAnimationEnd = () => {
    if (!show) setRender(false)
  }

  return (
    render && (
      <div
        style={{
          animation: `${show ? 'fadeIn' : 'fadeOut'} 0.3s ease-in-out`,
          opacity: show ? 1 : 0,
        }}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  )
}

