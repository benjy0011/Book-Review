// Submit review
document.addEventListener('DOMContentLoaded', async() => {
    // Extract book ID from URL
    const bookId = window.location.pathname.split('/').pop();
    await loadBookDetails(bookId); // Load book details on page load

    // Show the delete confirmation
    const deleteModal = document.getElementById('deleteModal');
    const deleteButton = document.getElementById('deleteButton');
    const closeModal = document.getElementById('closeModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const returnButton = document.getElementById('returnButton');

    returnButton.addEventListener('click', () => {
        window.history.back();
    })

    deleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'flex'; // Show modal
    });

    // Close modal on clcking the close icon or cnacel button
    closeModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    // Confirm delete action
    confirmDelete.addEventListener('click', async () => {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Book deleted successfully!');
            window.location.href = '/books'; // Redirect to main page
        } else {
            alert('Failed to delete the book.');
        }
    });

    // Event listener for submitting a review
    document.getElementById('submitReview').addEventListener('click', async () => {
        const review = document.getElementById('reviewInput').value; // Get review
        const rating = document.getElementById('ratingValue').value; // Get selected rating

        // Check if rating was selected
        if (!rating) {
            alert('Please select a rating before submitting your review');
            return;
        }

        // Submit review via POST request
        const responseRev = await fetch(`/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ bookId, review })
        });

        // Submit rating via POST request
        const responseRat = await fetch(`/api/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ bookId, rating })
        });

        if (responseRev.ok && responseRat) {
            document.getElementById('reviewInput').value = ''; // Clear review input
            document.getElementById('ratingValue').value = ''; // Reset rating

            // Reset stars to unfilled
            document.querySelectorAll('.rating-input i').forEach(star => {
                star.classList.remove('selected');
            });

            loadReviews(bookId); // Reload reviews of curent book dynamically

            await updateAverageRating(bookId); // Update the displayed average rating dynamically
        } else {
            alert('Error adding review.');
        }
    });
});

// Function to load book details
async function loadBookDetails(bookId) {
    const response = await fetch(`/api/books/${bookId}`);
    const bookData = await response.json();

    console.log(bookData);

    // Populate the DOM with book details
    document.getElementById('book-cover').src = bookData.book.BookImage;
    document.getElementById('book-title').innerText = bookData.book.BookName;
    document.getElementById('book-author').innerText = bookData.book.BookAuthor;
    document.getElementById('book-description').innerText = bookData.book.Description;

    displayAverageRating(bookData.averageRating); // Display average rating stars
    loadReviews(bookId); // Load existing reviews
}

// Function to fetch and update the average rating dynamically
async function updateAverageRating(bookId) {
    const response = await fetch(`/api/books/${bookId}`);
    const bookData = await response.json();

    displayAverageRating(bookData.averageRating); // Display average rating stars
}

// Function to Display Average Rating in Stars
function displayAverageRating(rating) {
    const ratingContainer = document.getElementById('rating-container');
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;

    // Generate star icon
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="ri-star-fill"></i>';
    }
    if (halfStar) {
        stars += '<i class="ri-star-half-fill"></i>';
    }
    for (let i = fullStars + halfStar; i < 5; i++) {
        stars += '<i class="ri-star-line"></i>';
    }

    // Add rating in numerical form
    stars += `<span class="rating-number details">(${rating}/5.0)</span>`;

    ratingContainer.innerHTML = stars; // Display stars in rating container
}

// Function to load existing reviews for the book
async function loadReviews(bookId) {
    try {
        const response = await fetch(`/api/reviews/book/${bookId}`);
        const reviewsData = await response.json();

        // Log the full response to check its structure
        console.log('Full Reviews Response:', reviewsData);

        // Assuming the actual reviews array is inside an object
        const reviews = reviewsData.reviews; // Adjust this based on the actual response structure

        // Check if reviews is an array
        if (!Array.isArray(reviews)) {
            console.error("Expected an array of reviews, but received:", reviews);
            return;
        }

        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = ''; // Clear existing reviews

        // Display a message if no reviews are available
        if (reviews.length === 0) {
            const noReviewsMessage = document.createElement('p');
            noReviewsMessage.innerText = "No reviews yet.";
            reviewsContainer.appendChild(noReviewsMessage);
            return;
        }

        // Display each review if available
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item'); // Add the new CSS class
            reviewElement.innerText = `${review.review}`;
            reviewsContainer.appendChild(reviewElement);
        });

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}
