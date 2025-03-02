// Function to generate stars based on the rating
function generateStars(rating) {
    const filledStars = '\u2605'.repeat(Math.floor(rating)); // Filled stars (?)
    const emptyStars = '\u2606'.repeat(5 - Math.floor(rating)); // Empty stars (?)
    return filledStars + emptyStars;
}

// Function to fetch and display the caregiver list
async function fetchCaregivers() {
    const response = await fetch('api/get_caregivers.php');
    const caregivers = await response.json();

    const caregiverList = document.getElementById('caregiver-list');
    caregiverList.innerHTML = '';

    for (const caregiver of caregivers) {
        const rating = Number(caregiver.average_rating) || 0; // Default to 0 if no rating exists
        const stars = generateStars(rating);  // Generate the star rating

        // Fetch the latest review for this caregiver
        let latestReview = 'No reviews available.';
        try {
            const reviewResponse = await fetch(`api/get_reviews.php?caregiverID=${caregiver.memberID}&limit=1`);
            const reviews = await reviewResponse.json();
            if (reviews.length > 0) {
                latestReview = `"${reviews[0].comments}" - ${reviews[0].reviewer_name}`;
            }
        } catch (error) {
            console.error(`Error fetching the latest review for caregiver ${caregiver.memberID}:`, error);
        }

        // Create caregiver widget
        const widget = document.createElement('div');
        widget.className = 'caregiver-widget';
        widget.innerHTML = `
            <div class="caregiver-name">${caregiver.name}</div>
            <div class="caregiver-phone">${caregiver.phone}</div>
            <div class="caregiver-hours">Hours Available: ${caregiver.hoursavailable}</div>
            
            <div class="rating-container">
<span class="average-score">(${rating.toFixed(1)})</span>
                <span class="rating" onclick="showReviews(${caregiver.memberID})">${stars}</span>
            </div>
            <div class="caregiver-description">${latestReview}</div>
            
        `;
        caregiverList.appendChild(widget);
    }
}

// Function to show reviews for the clicked caregiver
async function showReviews(caregiverID) {
    const popup = document.getElementById('review-popup');
    const overlay = document.getElementById('review-popup-overlay');

    // Fetch the latest 10 reviews
    try {
        const response = await fetch(`api/get_reviews.php?caregiverID=${caregiverID}`);
        const reviews = await response.json();

        const popupContent = document.getElementById('review-popup-content');
        popupContent.innerHTML = '';

        if (reviews.length === 0) {
            popupContent.innerHTML = '<p>No reviews found.</p>';
        } else {
            reviews.forEach(review => {
                popupContent.innerHTML += `
                    <p><strong>${review.reviewer_name}</strong>: ${review.comments}</p>
                `;
            });
        }

        // Show the popup and overlay
        popup.style.display = 'block';
        overlay.style.display = 'block';
    } catch (error) {
console.error('Error fetching reviews:', error);
    }
}

// Function to close the review popup
function closePopup() {
    const popup = document.getElementById('review-popup');
    const overlay = document.getElementById('review-popup-overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

// Load caregiver list on page load
window.onload = fetchCaregivers;

