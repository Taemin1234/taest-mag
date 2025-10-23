'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}/views`, { method: 'POST' })
      .catch(console.error)
  }, [slug])

  return null  // 화면엔 아무것도 렌더링하지 않음
}