import { fetchPostsByEditor } from '@/lib/api'


interface PostPageProps {
  params: { editorName: string }
}

export default async function EditorPage(props : PostPageProps) {

  const { editorName } = await props.params;

  // url에 한글이나 특수문자가 있으면 자동으로 인코딩한다.
  // url 파라미터 디코딩
  const editor = decodeURIComponent(editorName);

  const editorPosts = await fetchPostsByEditor(editorName)

  console.log(editorPosts)

  return <div>
    {editor}
  </div>;
}