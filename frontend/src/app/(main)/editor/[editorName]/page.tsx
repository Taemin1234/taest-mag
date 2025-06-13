import { fetchPostsByEditor } from '@/lib/api'
import PostList from '@/components/PostList'

interface PostPageProps {
  params: { editorName: string }
}

export default async function EditorPage(props : PostPageProps) {

  const { editorName } = await props.params;

  // url에 한글이나 특수문자가 있으면 자동으로 인코딩한다.
  // url 파라미터 디코딩
  const editor = decodeURIComponent(editorName);

  const editorPosts = await fetchPostsByEditor(editorName)

  return (
    <main>
      <div>
        {editor}
      </div>
      <div>
        <p>게시물 보기</p>
        <PostList posts={editorPosts} />
      </div>
    </main>
  );
}