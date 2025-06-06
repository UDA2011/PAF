package com.example.skillfy.skillpost;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.example.skillfy.comment.CommentDto;

@Data
@AllArgsConstructor
public class SkillPostDto {
    private String skillPostId;
    private String authorId;
    private String authorName;
    private String authorProfileImageUrl;
    private ArrayList<String> skillPostImageUrls;
    private String skillPostVideoUrl;
    private String skillPostVideoThumbnailUrl;
    private Integer videoDurationSeconds;
    private String skillName;
    private String title;
    private String description;
    private int noOfLikes;
    private Set<String> likedUserIds;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
}
