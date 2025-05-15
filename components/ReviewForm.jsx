import React, { useState, useRef } from 'react';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    content: '',
    photo: null,
  });

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      photo: formData.photo ? URL.createObjectURL(formData.photo) : null,
    };

    onSubmit(newReview);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>Leave a review</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.inputLabel}>
            Name *
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={styles.input}
            />
          </label>

          <label className={styles.inputLabel}>
            E-mail
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your e-mail"
              className={styles.input}
            />
          </label>

          <label className={styles.inputLabel}>
            Rating
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={formData.rating >= star ? styles.filled : ''}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </label>

          <label className={styles.inputLabel}>
            Review title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter review title"
              className={styles.input}
            />
          </label>

          <label className={styles.inputLabel}>
            Review
            <textarea
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your review"
              className={styles.textarea}
            />
          </label>

          <label className={styles.inputLabel}>
            Upload a photo of how it looks (optional)
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              className={styles.uploadBox}
              onClick={() => fileInputRef.current.click()}
            >
              <img src="/camera-icon.png" alt="Upload" className={styles.cameraIcon} />
            </div>
          </label>

          <button type="submit" className={styles.submitBtn}>
            Submit review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
