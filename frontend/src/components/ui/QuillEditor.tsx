'use client';

import { forwardRef, useRef, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
// import ReactQuill from 'react-quill-new';

// type OriginalProps = React.ComponentProps<typeof RawReactQuill>;

// type ExtendedProps = OriginalProps & {
//   forwardedRef?: React.ForwardedRef<any>;
// };

// const RawReactQuill  = dynamic(
//   () => import('react-quill-new').then(mod => mod.default),
//   { ssr: false }    // 서버 렌더링 완전 비활성화
// );

// const ReactQuill = forwardRef<any, ExtendedProps>(
//   (props, ref) => <RawReactQuill {...props} forwardedRef={ref} />
// );

const RawReactQuill = dynamic(
  () =>
    import('react-quill-new').then((mod) => {
      const Forwarded = forwardRef<any, React.ComponentProps<typeof mod.default>>(
        (props, ref) => <mod.default {...props} ref={ref} />
      );
      // 개발자 도구에 보일 이름 지정
      Forwarded.displayName = 'RawReactQuill';
      return Forwarded;
    }),
  { ssr: false }
);

const ReactQuill = RawReactQuill;

// 개발자 도구에 보일 이름 지정
// ReactQuill.displayName = 'ReactQuill';

export default function QuillEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (val: string) => void;
}) {

const quillRef = useRef<any>(null);

// ① 이미지 업로드 핸들러
const handleImageUpload = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('quill', file);

    try {
      const res = await fetch('/api/upload/quill', {
        method: 'POST',
        body: form,
        credentials: 'include'
      });
      const data = await res.json();
      const url = data.url as string;
      // 에디터에 이미지 삽입
      if (!quillRef.current) return;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', url);
      // 커서를 이미지 뒤로 이동
      editor.setSelection(range.index + 1);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };
};


// ① 툴바 옵션 정의
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // 헤더 드롭다운: h1, h2, 일반 텍스트
        [{ header: [1, 2, 3, false] }],
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
        // 스크립트(Script) 아래첨자, 윗첨자
        [{ script: 'sub' }, { script: 'super' }],
        // 정렬
        [{ align: [] }],
        // 오른쪽에서 왼쪽으로 쓰기
        [{ direction: 'rtl' }],
        // 링크, 이미지, 비디오 삽입
        ['link', 'image', 'video'],
        // 인용구, 코드 블록
        ['blockquote','code-block'],
        // 서식 초기화
        ['clean'],
      ],
      handlers: {
        // image 버튼 클릭 시 handleImageUpload 실행
        image: handleImageUpload,
      },
    },
    // imageResize: { modules: [ 'Resize', 'DisplaySize', 'Toolbar' ] },
  }), [])

  // 지원 포맷 정의
  const formats = useMemo(() => [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'script',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block',
  ], [])

  // 한글 조합이 끝나는 시점에만 부모로 전달
  // 입력할때마다 랜더링되는 것 방지
  const handleCompositionEnd = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const html = editor.root.innerHTML;
    onChange(html);
  }, [onChange]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const root = editor.root; // contentEditable div
    root.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      root.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, [handleCompositionEnd]);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      defaultValue={defaultValue}
      modules={modules}
      formats={formats}
      placeholder="내용을 입력하세요…"
      onChange={onChange}
    />
  );
}
