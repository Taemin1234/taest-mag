import Link from 'next/link';

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-3xl font-bold mb-4">404 - 페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-6">요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있어요.</p>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  