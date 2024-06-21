// reviews.js

document.addEventListener('DOMContentLoaded', () => {
  fetch('reviewsData.json')
      .then(response => response.json())
      .then(data => {
          displayReviews(data);
      })
      .catch(error => console.error('Error fetching reviews:', error));
});

function displayReviews(reviews) {
  const reviewsContainer = document.getElementById('reviews-container');

  reviews.forEach(review => {
      const reviewDiv = document.createElement('div');
      reviewDiv.classList.add('review');

      const reviewerNameDiv = document.createElement('div');
      reviewerNameDiv.classList.add('reviewer-name');
      const iconImg = document.createElement('img');
      iconImg.src = review.source.icon;
      iconImg.classList.add('review-icon');
      reviewerNameDiv.innerHTML = `<strong>${escapeHTML(review.reviewer_name)}</strong> wrote a review at <strong>${escapeHTML(review.source.name)}</strong> on (${escapeHTML(review.date)})`;

      const ratingDiv = document.createElement('div');
      ratingDiv.classList.add('rating');
      ratingDiv.innerHTML = getStarRating(review.rating_review_score, 10);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      contentDiv.innerHTML = getHighlightedContent(review.content, review.analytics);

      reviewDiv.appendChild(iconImg);
      reviewDiv.appendChild(reviewerNameDiv);
      reviewDiv.appendChild(ratingDiv);
      reviewDiv.appendChild(contentDiv);

      reviewsContainer.appendChild(reviewDiv);
  });
}


function getHighlightedContent(content, analytics) {
  let highlightedContent = escapeHTML(content);

  analytics.forEach(analytic => {
      const highlightIndices = analytic.highlight_indices;
      const sentiment = analytic.sentiment.toLowerCase();
      if (!highlightIndices || highlightIndices.length === 0) {
          return;
      }

      highlightIndices.forEach(([start, end]) => {
          const highlightedText = escapeHTML(content.slice(start, end));
          const topic = analytic.topic;
          highlightedContent = highlightedContent.replace(highlightedText, `<span class="sentiment ${sentiment}" title="${topic}">${highlightedText}</span>`);
      });
  });

  return highlightedContent;
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function getStarRating(score, outOf) {
  const fullStar = '★';
  const emptyStar = '☆';
  const fullStars = Math.round(score / outOf * 5);
  const emptyStars = 5 - fullStars;
  
  return fullStar.repeat(fullStars) + emptyStar.repeat(emptyStars);
}