import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useComments } from "../../../hooks/useCalls";

interface CommentsProps {
  callId: number;
}

const Comments = ({ callId }: CommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const {
    comments,
    isLoadingComments,
    commentsError,
    addComment,
    isAddingComment,
  } = useComments(callId);

  const handleSubmitComment = () => {
    if (newComment.trim() && !isAddingComment) {
      addComment({ text: newComment.trim() });
      setNewComment("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (!callId) {
    return (
      <div className="max-w-[448px] w-full bg-[#FFFFFF] rounded-2xl flex items-center justify-center h-[200px]">
        <div className="text-[#9A9A9A] text-[14px]">
          Неможливо завантажити коментарі
        </div>
      </div>
    );
  }

  // Use real comments data if available, otherwise use fallback
  const commentsData =
    comments.length > 0 ? comments : isLoadingComments ? [] : [];

  return (
    <div className="max-w-[448px] w-full bg-[#FFFFFF] rounded-2xl flex flex-col h-[850px]">
      {/* Header */}
      <div className="p-6 pb-6">
        <h2 className="text-[#00101F] font-semibold text-[24px] leading-[100%]">
          Коментарі
        </h2>
      </div>

      {/* Comments List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {isLoadingComments ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#739C9C] mx-auto"></div>
              <p className="text-[#9A9A9A] mt-2">Завантаження коментарів...</p>
            </div>
          </div>
        ) : commentsError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500">Помилка завантаження коментарів</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-4">
            {commentsData.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 pb-4 border-b border-[#EAEAEA]"
              >
                <img
                  src={comment.admin.photo}
                  alt={comment.admin.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-[#00101F] font-semibold text-[16px] leading-[100%]">
                      {comment.admin.name}
                    </span>
                    <span className="text-[#9A9A9A] text-[14px] leading-[100%]">
                      {comment.created_human}
                    </span>
                  </div>
                  <div className="bg-[#F7F7F7] rounded-[8px] p-4">
                    <p className="text-[#00101F] text-[14px] leading-[120%]">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="p-6 pt-4 bg-white rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишіть коментар"
              className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-[12px] p-3 text-[14px] text-[#00101F] placeholder-[#9A9A9A] resize-none focus:outline-none focus:border-[#739C9C] transition-colors min-h-[48px] max-h-[120px]"
              rows={1}
            />
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isAddingComment}
            className="w-12 h-12 bg-[#739C9C] rounded-[12px] flex items-center justify-center text-white hover:bg-[#5F8888] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingComment ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <IoSend size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
