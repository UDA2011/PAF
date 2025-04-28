package com.example.skillfy.milestonepost;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.example.skillfy.comment.CommentDto;
import com.example.skillfy.template.TemplateData;
import com.example.skillfy.template.TemplateType;

@Data
@AllArgsConstructor
public class MilestonePostDto {
    private String milestonePostId;
    private String authorId;
    private String authorName;
    private LocalDateTime postedDate;
    private String profileImageUrl;
    private String skill;
    private String title;
    private TemplateType templateType;
    private TemplateData templateData;
    private Set<String> likedUserIds;
    private int noOfLikes;
    private List<CommentDto> comments;
}
