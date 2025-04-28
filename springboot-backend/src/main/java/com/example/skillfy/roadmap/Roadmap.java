package com.example.skillfy.roadmap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.skillfy.comment.Comment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document("roadmaps")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Roadmap {
    @Id private ObjectId id;
    private String title;
    private String description;
    private String category;
    private String authorId;
    private String authorName;
    private String authorImg;
    private LocalDateTime publishedDate;
    private int totalView;

    @Builder.Default
    private List<Week> weeks = new ArrayList<>();

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Builder.Default
    private Set<String> likedUserIds = new HashSet<>();

    @Builder.Default
    private int noOfLikes = 0;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Week {
        private int weekNumber;
        private String title;
        private String content;
    }
}