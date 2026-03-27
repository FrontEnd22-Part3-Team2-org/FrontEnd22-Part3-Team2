import { Textarea } from '@/components/common/Input';
import { createCommentAction } from '@/actions/comment';

interface CommentsProps {
  cardId: number;
  columnId: number;
  dashboardId: number;
}

export default function CommentsForm({
  cardId,
  columnId,
  dashboardId,
}: CommentsProps) {
  return (
    <>
      <form
        action={(formData) =>
          createCommentAction(formData, columnId, dashboardId)
        }
      >
        <input type="hidden" name="cardId" value={cardId} />
        <Textarea label="댓글" placeholder="댓글 작성하기" />

        {/* <input type="hidden" name="columnId" value={columnId} />
        <input type="hidden" name="dashboardId" value={dashboardId} /> */}
        {/* <textarea name="content" id=""></textarea>
        <button type="submit">작성</button> */}
      </form>
    </>
  );
}
