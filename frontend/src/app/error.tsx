'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-10">
      <h2>문제가 발생했어요 😢</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        다시 시도하기
      </button>
    </div>
  );
}
