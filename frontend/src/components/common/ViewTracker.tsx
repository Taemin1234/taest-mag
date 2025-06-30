'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/posts/${slug}/views`, { method: 'POST' })
      .catch(console.error)
  }, [slug])

  return null  // 화면엔 아무것도 렌더링하지 않음
}
