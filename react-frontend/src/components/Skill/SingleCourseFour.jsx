import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatDate } from "../../util/formatDate";

const SingleCourseFour = (props) => {
  const {
    skillPostId,
    authorId,
    authorName,
    authorProfileImageUrl,
    skillPostImageUrls = [],
    skillPostVideoUrl,
    skillPostVideoThumbnailUrl,
    videoDurationSeconds,
    skillName,
    title,
    description,
    noOfLikes,
    likedUserIds,
    comments = [],
    createdAt,
  } = props;

  // Use either original or new props based on what's provided
  const postId = skillPostId;
  const userId = authorId;
  const postSkill = skillName;
  const postTitle = title;
  const postAuthor = authorName;
  const postAuthorImg = authorProfileImageUrl;
  const postLikes = noOfLikes;
  const postComments = comments || [];
  const postDescription = description;

  // Format video duration
  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="inner-course">
      <div className="case-img">
        <Link to="#" className="cate-w">
          {postSkill}
        </Link>

        {/* Display video thumbnail or first image */}
        {skillPostVideoUrl ? (
          <div className="video-container">
            <img
              src={skillPostVideoThumbnailUrl || ""}
              alt={`${postTitle} video thumbnail`}
            />
            {/* <div className="video-duration">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            <span>{formatDuration(videoDurationSeconds)}</span>
                        </div> */}
          </div>
        ) : (
          <img src={skillPostImageUrls[0]} alt={postTitle} />
        )}
      </div>

      <div className="case-content" style={{ margingBottom: "20px" }}>
        {/* Show date if available, maintaining original style */}
        {/* {createdAt && (
                    <div className="post-date" style={{ fontSize: '14px', color: 'red', marginBottom:"20px" }}>
                        {formatDate(createdAt)}
                    </div>
                )} */}

        <ul className="meta-course">
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-thumbs-up"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            {postLikes} Likes
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-message-circle"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
            </svg>
            {postComments.length} Comments
          </li>
        </ul>

        <h4 className="case-title">
          {/* <Link to={`/skill-feed/${postId}`} style={{ fontWeight: 600, color:"black"}}>
                        {postTitle}
                    </Link> */}
          <a href={`/skill-feed/${postId}`}>{postTitle}</a>
        </h4>

        {/* Show description excerpt if available */}
        {/* {postDescription && (
                    <div className="post-description">
                        {postDescription.length > 100
                            ? `${postDescription.substring(0, 100)}...`
                            : postDescription
                        }
                    </div>
                )} */}

        <div
          className="react__user"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "40px",
          }}
        >
          <Link
            to={`/author/${userId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Handle image path like the original component */}
            {postAuthorImg &&
            postAuthorImg.startsWith &&
            postAuthorImg.startsWith("http") ? (
              <img
                src={postAuthorImg}
                alt="user"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            ) : (
              postAuthorImg && (
                <img
                  src={
                    postAuthorImg && postAuthorImg.startsWith?.("http")
                      ? postAuthorImg
                      : postAuthorImg || "../../assets/images/profile1.jpg"
                  }
                  alt="user"
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  onError={(e) => {
                    // Prevent infinite loop
                    if (
                      e.target.src !==
                      window.location.origin + "/default-user.png"
                    ) {
                      e.target.onerror = null;
                      e.target.src = "../../assets/images/profile1.jpg";
                    }
                  }}
                />
              )
            )}
            <span
              style={{ marginLeft: "3px", color: "#5b5f64", fontSize: "16px" }}
            >
              {postAuthor}
            </span>
          </Link>
          {createdAt && (
            <div
              className="post-date"
              style={{ fontSize: "14px", color: "red" }}
            >
              {formatDate(createdAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SingleCourseFour.propTypes = {
  skillPostId: PropTypes.string,
  authorId: PropTypes.string,
  authorName: PropTypes.string,
  authorProfileImageUrl: PropTypes.string,
  skillPostImageUrls: PropTypes.arrayOf(PropTypes.string),
  skillPostVideoUrl: PropTypes.string,
  skillPostVideoThumbnailUrl: PropTypes.string,
  videoDurationSeconds: PropTypes.number,
  skillName: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  noOfLikes: PropTypes.number,
  likedUserIds: PropTypes.arrayOf(PropTypes.string),
  comments: PropTypes.array,
  createdAt: PropTypes.string,
};

export default SingleCourseFour;
