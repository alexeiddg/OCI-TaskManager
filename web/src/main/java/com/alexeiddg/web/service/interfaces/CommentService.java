package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {
    Optional<Comment> getCommentById(Long commentId);
    Comment saveComment(Comment comment);
    void deleteComment(Long commentId);

    // Retrieving Comments
    List<Comment> getCommentsByTask(Long taskId);
    List<Comment> getCommentsByUser(Long userId);

    // Comment Updates
    Comment editComment(Long commentId, String newCommentText);
}
