'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  () => import('react-quill-new'), 
  { ssr: false }
);

export default function QuillEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {

// ① 툴바 옵션 정의
  const modules = {
    toolbar: [
      // 헤더 드롭다운: h1, h2, 일반 텍스트
      [{ header: [1, 2, false] }],
      // 글꼴 선택 드롭다운
      [{ font: [] }],
      // 글자 크기 선택 드롭다운
      [{ size: ['small', false, 'large', 'huge'] }],
      // 서식 버튼들
      ['bold', 'italic', 'underline', 'strike'],
      // 컬러 피커: 글자색, 배경색
      [{ color: [] }, { background: [] }],
      // 리스트, 들여쓰기
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      // 정렬
      [{ align: [] }],
      // 링크, 이미지, 비디오 삽입
      ['link', 'image', 'video'],
      // 코드 블록
      ['code-block'],
      // 서식 초기화
      ['clean'],
    ],
  };

  // ② 지원 포맷 정의
  const formats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align',
    'link', 'image', 'video',
    'code-block',
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="내용을 입력하세요…"
    />
  );
}
