'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/post/${slug}/views`, { method: 'POST' })
      .catch(console.error)
  }, [slug])

  return null  // 화면엔 아무것도 렌더링하지 않음
}

// 우드잡
// 우리들과 경찰아저씨의 700일 전쟁
// 리틀 포레스트 여름과 가을
// 기쿠지코의 여름

// 요노스케 이야기
// 썸머워즈

// 지금 만나러 갑니다.
// "비의 계절이 되면 돌아올게"

// 우드잡
// - 한여름, 산골에 뿌리 내린 뜨거운 청춘

// 우리들과 경찰 아저씨의 700일 전쟁
// - 쫓고 쫓기지만 같은 곳을 바라본다.

// 리틀 포레스트 여름과 가을
// - 계절을 요리하다.

// 먹고 사는 것에 집중