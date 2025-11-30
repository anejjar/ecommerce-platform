'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  authorName: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

interface ProductReviewsConfig {
  productId: string;
  showRatingSummary?: boolean;
  showIndividualReviews?: boolean;
  reviewsPerPage?: number;
  sortOrder?: 'newest' | 'oldest' | 'highest' | 'lowest';
  showReviewForm?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface ProductReviewsProps {
  config: ProductReviewsConfig;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ config }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingSummary, setRatingSummary] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const {
    productId,
    showRatingSummary = true,
    showIndividualReviews = true,
    reviewsPerPage = 10,
    sortOrder = 'newest',
    showReviewForm = false,
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '800px',
  } = config;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);

          // Calculate rating summary
          if (data.length > 0) {
            const total = data.length;
            const sum = data.reduce((acc: number, r: Review) => acc + r.rating, 0);
            const average = sum / total;
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            data.forEach((r: Review) => {
              distribution[r.rating as keyof typeof distribution]++;
            });
            setRatingSummary({ average, total, distribution });
          }
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const displayReviews = sortedReviews.slice(0, reviewsPerPage);

  if (loading) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4" style={{ maxWidth }}>
        {showRatingSummary && ratingSummary.total > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{ratingSummary.average.toFixed(1)}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(ratingSummary.average)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{ratingSummary.total} reviews</p>
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingSummary.distribution[rating as keyof typeof ratingSummary.distribution];
                const percentage = ratingSummary.total > 0 ? (count / ratingSummary.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-12">{rating} star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showIndividualReviews && (
          <div className="space-y-6">
            {displayReviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet.</p>
            ) : (
              displayReviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {review.verifiedPurchase && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && <h4 className="font-semibold">{review.title}</h4>}
                      <p className="text-sm text-gray-600">
                        by {review.authorName} • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {showReviewForm && (
          <div className="mt-8 p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <p className="text-sm text-gray-600">Review form coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

