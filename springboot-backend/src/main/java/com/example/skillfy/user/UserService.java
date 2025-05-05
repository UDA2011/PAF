package com.example.skillfy.user;

import com.example.skillfy.enrollment.EnrollmentService;
import com.example.skillfy.exception.ResourceNotFoundException;
import com.example.skillfy.milestonepost.MilestonePost;
import com.example.skillfy.milestonepost.MilestonePostService;
import com.example.skillfy.notification.NotificationDto;
import com.example.skillfy.notification.NotificationMapper;
import com.example.skillfy.notification.NotificationService;
import com.example.skillfy.notification.NotificationType;
import com.example.skillfy.roadmap.Roadmap;
import com.example.skillfy.roadmap.RoadmapService;
import com.example.skillfy.skillpost.SkillPost;
import com.example.skillfy.skillpost.SkillPostService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;
    private final MilestonePostService milestonePostService;
    private final EnrollmentService enrollmentService;
    private final RoadmapService roadmapService;
    private final SkillPostService skillPostService;


    public void createOrUpdateUserFromOAuth(String googleId, String email, String name, String profileImageUrl) {
        userRepository.findByGoogleId(googleId)
                .map(existingUser -> {
                    // Update existing user
                    existingUser.setEmail(email);
                    existingUser.setName(name);
                    existingUser.setProfileImageUrl(profileImageUrl);
                    existingUser.setLastLoginAt(LocalDateTime.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // Create new user
                    User newUser = new User(
                            new ObjectId(),
                            email,
                            name,
                            profileImageUrl,
                            googleId,
                            new ArrayList<ObjectId>(),
                            new ArrayList<ObjectId>(),
                            "",
                            LocalDateTime.now(),
                            LocalDateTime.now()
                    );
                    return userRepository.save(newUser);
                });
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User findByGoogleId(String googleId) {
        return this.userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found given with Google Id"));
    }

    public void deleteByEmail(String email) {
        User user = this.findByEmail(email);

        this.userRepository.deleteById(user.getId().toString());
    }

    @Transactional
    public boolean deleteUserById(String userId) {
        User userToDelete = findById(userId);
        if (userToDelete == null) {
            return false;
        }

        ObjectId userObjectId = userToDelete.getId();
        String userIdStr = userObjectId.toString();

        // Delete all milestone posts created by the user
        List<MilestonePost> userMilestonePosts = milestonePostService.findByUserId(userIdStr);
        for (MilestonePost post : userMilestonePosts) {
            milestonePostService.delete(post.getMilestonePostId().toHexString());
        }

        // Remove user's likes from other milestone posts
        List<MilestonePost> likedMilestonePosts = milestonePostService.findLikedByUser(userIdStr);
        for (MilestonePost post : likedMilestonePosts) {
            milestonePostService.removeLike(post.getMilestonePostId().toHexString(), userIdStr);
        }

        //  Delete user's comments from other milestone posts
        milestonePostService.deleteAllCommentsByUserId(userIdStr);


        // Delete all user enrollments
        enrollmentService.deleteAllEnrollmentsByUserId(userIdStr);


        // Delete all roadmaps created by the user
        List<Roadmap> userRoadmaps = roadmapService.getRoadmapsByAuthor(userIdStr);
        for (Roadmap roadmap : userRoadmaps) {
            roadmapService.deleteRoadmap(roadmap.getId().toHexString());
        }

        // Remove user's likes from other roadmaps
        List<Roadmap> likedRoadmaps = roadmapService.getLikedRoadmaps(userIdStr);
        for (Roadmap roadmap : likedRoadmaps) {
            roadmapService.removeLike(roadmap.getId().toHexString(), userIdStr);
        }

        // Delete user's comments from other roadmaps
        roadmapService.deleteCommentsByUserId(userIdStr);


        // Delete all skill posts created by the user
        List<SkillPost> skillPosts = skillPostService.findLikedByUser(userIdStr);
        for (SkillPost skillPost : skillPosts) {
            skillPostService.delete(skillPost.getSkillPostId().toHexString());
        }

        // Remove user's likes from other skill posts
        List<SkillPost> likedSkillPosts = skillPostService.findLikedByUser(userIdStr);
        for (SkillPost skillPost : likedSkillPosts) {
            skillPostService.removeLike(skillPost.getSkillPostId().toHexString(), userIdStr);
        }

        // Delete user's comments from other skill posts
        skillPostService.deleteAllCommentsByUserId(userIdStr);


        // Remove user from others' followers/following lists
        List<User> followers = getUserFollowers(userIdStr);
        for (User follower : followers) {
            unfollowUser(follower.getId().toString(), userIdStr);
        }

        List<User> following = getUserFollowing(userIdStr);
        for (User followed : following) {
            unfollowUser(userIdStr, followed.getId().toString());
        }

        // Delete notifications related to this user
        notificationService.deleteAllNotificationsByUser(userIdStr);

        //Delete the user
        userRepository.deleteById(userIdStr);

        return true;
    }

    public User findById(String id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User followUser(String currentUserId, String userIdToFollow) {
        if (currentUserId.equals(userIdToFollow)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }

        User currentUser = findById(currentUserId);
        User userToFollow = findById(userIdToFollow);

        ObjectId userToFollowObjectId = userToFollow.getId();

        if (currentUser.getFollowing() == null) {
            currentUser.setFollowing(new ArrayList<>());
        }

        if (!currentUser.getFollowing().contains(userToFollowObjectId)) {
            currentUser.getFollowing().add(userToFollowObjectId);
            userRepository.save(currentUser);
        }

        if (userToFollow.getFollowers() == null) {
            userToFollow.setFollowers(new ArrayList<>());
        }

        if (!userToFollow.getFollowers().contains(new ObjectId(currentUserId))) {
            userToFollow.getFollowers().add(new ObjectId(currentUserId));
            userRepository.save(userToFollow);

            String notificationText = " started following you.";
            NotificationDto notificationDto = new NotificationDto(
                    null,
                    userToFollow.getId().toHexString(),
                    currentUser.getName(),
                    null,
                    NotificationType.FOLLOW,
                    notificationText,
                    LocalDateTime.now(),
                    false
            );

            notificationService.create(notificationMapper.toEntity(notificationDto));

        }

        return currentUser;
    }

    public User unfollowUser(String currentUserId, String userIdToUnfollow) {
        User currentUser = findById(currentUserId);
        User userToUnfollow = findById(userIdToUnfollow);

        ObjectId userToUnfollowObjectId = userToUnfollow.getId();

        if (currentUser.getFollowing() != null) {
            currentUser.getFollowing().remove(userToUnfollowObjectId);
            userRepository.save(currentUser);
        }

        if (userToUnfollow.getFollowers() != null) {
            userToUnfollow.getFollowers().remove(new ObjectId(currentUserId));
            userRepository.save(userToUnfollow);
        }

        return currentUser;
    }

    public List<User> getUserFollowers(String userId) {
        User user = findById(userId);
        List<ObjectId> followerIds = user.getFollowers();

        if (followerIds == null || followerIds.isEmpty()) {
            return new ArrayList<>();
        }

        return followerIds.stream()
                .map(id -> userRepository.findById(id.toString())
                        .orElse(null))
                .filter(follower -> follower != null)
                .collect(Collectors.toList());
    }

    public List<User> getUserFollowing(String userId) {
        User user = findById(userId);
        List<ObjectId> followingIds = user.getFollowing();

        if (followingIds == null || followingIds.isEmpty()) {
            return new ArrayList<>();
        }

        return followingIds.stream()
                .map(id -> userRepository.findById(id.toString())
                        .orElse(null))
                .filter(following -> following != null)
                .collect(Collectors.toList());
    }

    public User updateBio(String userId, String newBio) {
        User user = findById(userId);
        user.setBio(newBio);
        return userRepository.save(user);
    }


    // Search users by email, name or bio (case‐insensitive).
    public List<User> searchUsers(String searchTerm) {
        return userRepository
                .findByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrBioContainingIgnoreCase(
                        searchTerm, searchTerm, searchTerm
                );
    }

}
