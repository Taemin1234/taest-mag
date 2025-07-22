'use client';

import { useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';

//SSR 방지용 Dynamic Import
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
)

export default function WebEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (val: string) => void;
}) {
  const editorRef = useRef<any>(null);

  const initialContent = useRef(defaultValue);

  // TinyMCE 이미지 업로드 핸들러 (blobInfo, progress)
  const handleImageUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const form = new FormData();
        form.append('webEditor', blobInfo.blob(), blobInfo.filename());
        const res = await fetch('/api/upload/webEditor', {
          method: 'POST',
          body: form,
          credentials: 'include',
        });
        const data = await res.json();
        // TinyMCE는 { location: ... } 형태의 응답을 기대함
        if (data.location) {
          resolve(data.location);
        } else if (data.url) {
          // 혹시 기존 응답이 url이라면 location으로 맞춰줌
          resolve(data.url);
        } else {
          reject('업로드 실패');
        }
      } catch (err) {
        reject('이미지 업로드 중 오류 발생');
      }
    });
  }, []);

  const initConfig = useMemo(() => ({
    // height: 800,
    menubar: 'file edit view insert format tools table help',
    plugins: [
      'advlist', 'anchor', 'autolink', 'autoresize', 'autosave', 'charmap', 'code', 'codesample',
      'directionality', 'emoticons', 'fullscreen', 'help', 'image', 'importcss', 'insertdatetime',
      'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars',
      'save', 'searchreplace', 'table', 'visualblocks', 'visualchars', 'wordcount'
    ],
    toolbar: [
      'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect',
      'alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist',
      'forecolor backcolor | removeformat | subscript superscript | charmap emoticons',
      'link image media codesample | table | pagebreak nonbreaking anchor',
      'insertdatetime | visualblocks visualchars code fullscreen preview',
      'ltr rtl | searchreplace | save | restoredraft | help'
    ].join(' | '),
    images_upload_handler: handleImageUpload,
    placeholder: '내용을 입력하세요…',
    language: 'ko_KR',
  }), []);
  

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialContent.current}
      init={initConfig}
      onEditorChange={onChange}
    />
  );
}
