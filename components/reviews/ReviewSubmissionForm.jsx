import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Star, StarOutline, Check, AlertTriangle, Loader } from 'lucide-react';

const ReviewSubmissionForm = ({ reservation, onReviewSubmitted }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    pros: '',
    cons: '',
    recommendation: false,
    overall_rating: 0,
    vehicle_rating: 0,
    service_rating: 0,
    value_rating: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Check if user can submit review
  useEffect(() => {
    if (!reservation || reservation.status !== 'completed') {
      setError('You can only review completed reservations.');
      return;
    }
    
    // Check if review already exists
    checkExistingReview();
  }, [reservation]);

  const checkExistingReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reviews?customer_id=${reservation.customer_id}&reservation_id=${reservation.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setError('You have already submitted a review for this reservation.');
          setSubmitted(true);
        }
      }
    } catch (err) {
      console.error('Error checking existing review:', err);
    }
  };

  const StarRating = ({ value, onChange, label, disabled = false }) => {
    const [hoverValue, setHoverValue] = useState(0);
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              className={`p-1 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-yellow-400'}`}
              onMouseEnter={() => !disabled && setHoverValue(star)}
              onMouseLeave={() => !disabled && setHoverValue(0)}
              onClick={() => !disabled && onChange(star)}
            >
              {(hoverValue || value) >= star ? (
                <Star className="w-8 h-8 fill-current text-yellow-400" />
              ) : (
                <StarOutline className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {value > 0 ? `${value}/5` : 'Not rated'}
          </span>
        </div>
        {validationErrors[`${label.toLowerCase()}_rating`] && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors[`${label.toLowerCase()}_rating`]}
          </p>
        )}
      </div>
    );
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters long';
    }
    
    if (!formData.comment.trim()) {
      errors.comment = 'Review comment is required';
    } else if (formData.comment.length < 20) {
      errors.comment = 'Comment must be at least 20 characters long';
    }
    
    if (formData.overall_rating === 0) {
      errors.overall_rating = 'Overall rating is required';
    }
    
    if (formData.vehicle_rating === 0) {
      errors.vehicle_rating = 'Vehicle rating is required';
    }
    
    if (formData.service_rating === 0) {
      errors.service_rating = 'Service rating is required';
    }
    
    if (formData.value_rating === 0) {
      errors.value_rating = 'Value rating is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        ...formData,
        reservation_id: reservation.id
      };
      
      // Optimistic UI update
      const optimisticReview = {
        ...reviewData,
        id: `temp-${Date.now()}`,
        customer_first_name: reservation.customer_first_name || 'You',
        customer_last_name: reservation.customer_last_name || '',
        vehicle_make: reservation.vehicle_make,
        vehicle_model: reservation.vehicle_model,
        vehicle_year: reservation.vehicle_year,
        agency_name: reservation.agency_name,
        status: 'submitting',
        created_at: new Date().toISOString(),
        helpful_votes: 0,
        total_votes: 0,
        verified: true,
        response_count: 0
      };
      
      // Immediately update the UI
      if (onReviewSubmitted) {
        onReviewSubmitted(optimisticReview);
      }
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        
        // Update with real review data
        if (onReviewSubmitted) {
          onReviewSubmitted(result.review, optimisticReview.id);
        }
        
        // Show success message and redirect after delay
        setTimeout(() => {
          router.push('/customer/reservations');
        }, 2000);
        
      } else {
        setError(result.error || 'Failed to submit review');
        
        // Remove optimistic review on error
        if (onReviewSubmitted) {
          onReviewSubmitted(null, optimisticReview.id, true);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Network error. Please try again.');
      
      // Remove optimistic review on error
      if (onReviewSubmitted) {
        onReviewSubmitted(null, optimisticReview.id, true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!reservation) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              No Reservation Selected
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Please select a completed reservation to review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
        <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Review Submitted Successfully!
        </h3>
        <p className="text-sm text-green-700 mb-4">
          Thank you for your feedback. Your review is now under moderation and will be published soon.
        </p>
        <button
          onClick={() => router.push('/customer/reservations')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Back to Reservations
        </button>
      </div>
    );
  }

  if (error && !submitted) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Unable to Submit Review
            </h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">
            {reservation.vehicle_year} {reservation.vehicle_make} {reservation.vehicle_model}
          </h3>
          <p className="text-sm text-gray-600">
            Rented from {reservation.agency_name} • {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ratings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StarRating
            value={formData.overall_rating}
            onChange={(rating) => handleInputChange('overall_rating', rating)}
            label="Overall Experience"
            disabled={isSubmitting}
          />
          
          <StarRating
            value={formData.vehicle_rating}
            onChange={(rating) => handleInputChange('vehicle_rating', rating)}
            label="Vehicle Quality"
            disabled={isSubmitting}
          />
          
          <StarRating
            value={formData.service_rating}
            onChange={(rating) => handleInputChange('service_rating', rating)}
            label="Service Quality"
            disabled={isSubmitting}
          />
          
          <StarRating
            value={formData.value_rating}
            onChange={(rating) => handleInputChange('value_rating', rating)}
            label="Value for Money"
            disabled={isSubmitting}
          />
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Summarize your experience..."
            maxLength={200}
          />
          <div className="flex justify-between mt-1">
            {validationErrors.title && (
              <p className="text-sm text-red-600">{validationErrors.title}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.title.length}/200 characters
            </p>
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            disabled={isSubmitting}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Share your detailed experience with this rental..."
            maxLength={2000}
          />
          <div className="flex justify-between mt-1">
            {validationErrors.comment && (
              <p className="text-sm text-red-600">{validationErrors.comment}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.comment.length}/2000 characters
            </p>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
              What did you like? (Pros)
            </label>
            <textarea
              id="pros"
              value={formData.pros}
              onChange={(e) => handleInputChange('pros', e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="List the positive aspects..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.pros.length}/500 characters
            </p>
          </div>
          
          <div>
            <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
              What could be improved? (Cons)
            </label>
            <textarea
              id="cons"
              value={formData.cons}
              onChange={(e) => handleInputChange('cons', e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="List areas for improvement..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.cons.length}/500 characters
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center">
          <input
            id="recommendation"
            type="checkbox"
            checked={formData.recommendation}
            onChange={(e) => handleInputChange('recommendation', e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="recommendation" className="ml-2 block text-sm text-gray-900">
            I would recommend this rental to others
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSubmissionForm;
