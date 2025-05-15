import React, { useState } from 'react';
import styles from './ReviewList.module.css';
import ReviewForm from './ReviewForm';

const ReviewList = ({ reviews }) => {
  const [allReviews, setAllReviews] = useState(reviews);
  const [selectedRating, setSelectedRating] = useState(null);
  const [likes, setLikes] = useState(Array(reviews.length).fill(0));
  const [dislikes, setDislikes] = useState(Array(reviews.length).fill(0));
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState('highest');
  const reviewsPerPage = 10;

  const handleAddReview = (newReview) => {
    setAllReviews((prev) => [newReview, ...prev]);
    setLikes((prev) => [0, ...prev]);
    setDislikes((prev) => [0, ...prev]);
    setShowForm(false);
    setCurrentPage(1);
  };

  const filteredReviews = selectedRating
    ? allReviews.filter((r) => r.rating === selectedRating)
    : allReviews;

  let sortedReviews = [...filteredReviews];
  if (sortOption === 'highest') {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'lowest') {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  } else if (sortOption === 'pictures') {
    sortedReviews = sortedReviews.filter((r) => r.photo);
  } else if (sortOption === 'helpful') {
    sortedReviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const total = allReviews.length;
  const average =
    total > 0
      ? (
          allReviews.reduce((acc, curr) => acc + curr.rating, 0) / total
        ).toFixed(1)
      : 0;

  const ratingsCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const handleRatingFilter = (star) => {
    setSelectedRating(star === selectedRating ? null : star);
    setCurrentPage(1);
  };

  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Customer Reviews</h2>

      <div className={styles.reviewTop}>
        <div className={styles.averageBlock}>
          <div className={styles.stars}>
            {'★'.repeat(Math.round(average))}
            {'☆'.repeat(5 - Math.round(average))}
          </div>
          <div className={styles.averageNumber}>{average}</div>
          <div className={styles.reviewCount}>Based on {total} reviews</div>

          <div className={styles.sortContainer}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="pictures">Only Pictures</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className={styles.bars}>
          {ratingsCount.map(({ star, count }) => {
            const width = total ? (count / total) * 100 : 0;
            return (
              <div key={star} className={styles.barRow}>
                <span className={styles.starText}>{'★'.repeat(star)}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className={styles.countText}>{count}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.buttonWrapper}>
          <button
            className={styles.leaveButton}
            onClick={() => setShowForm(true)}
          >
            Leave a review
          </button>
        </div>
      </div>

      {paginatedReviews.map((review, index) => (
        <div key={index} className={styles.reviewItem}>
          <div className={styles.reviewLeft}>
            <div className={styles.reviewStars}>{'★'.repeat(review.rating)}</div>
            <div className={styles.reviewerName}>{review.name}</div>
            <div className={styles.reviewDate}>{review.date}</div>
          </div>

          <div className={styles.reviewRight}>
            <div className={styles.reviewTitle}>{review.title}</div>
            <div className={styles.reviewContent}>{review.content}</div>
            {review.photo && (
              <img
                src={review.photo}
                alt="review"
                className={styles.reviewPhoto}
              />
            )}
            <div className={styles.helpfulSection}>
              <span className={styles.helpfulText}>Was this helpful?</span>

              <div className={styles.voteGroup}>
                <img
                  src="/thumbUp.jpg"
                  alt="Like"
                  className={styles.iconImage}
                  onClick={() => {
                    const updated = [...likes];
                    updated[index] += 1;
                    setLikes(updated);
                  }}
                />
                <span>{likes[index]}</span>
              </div>

              <div className={styles.voteGroup}>
                <img
                  src="/thumbDown.png"
                  alt="Dislike"
                  className={styles.iconImage}
                  onClick={() => {
                    const updated = [...dislikes];
                    updated[index] += 1;
                    setDislikes(updated);
                  }}
                />
                <span>{dislikes[index]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.activePage : ''
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              className={styles.arrowButton}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              →
            </button>
          )}
        </div>
      )}

      {showForm && (
        <ReviewForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
};

export default ReviewList;
