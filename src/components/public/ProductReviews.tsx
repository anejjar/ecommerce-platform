'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: '5',
    title: '',
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchReviews();
        setShowForm(false);
        setFormData({ rating: '5', title: '', comment: '' });
        toast.success(t('reviews.submitSuccess') || 'Review submitted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || t('reviews.submitError') || 'Failed to submit review');
      }
    } catch (error) {
      toast.error(t('errors.somethingWentWrong') || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('reviews.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{averageRating}</div>
              {renderStars(Math.round(parseFloat(averageRating)))}
              <p className="text-sm text-gray-600 mt-2">
                {t('reviews.basedOn')} {reviews.length} {reviews.length !== 1 ? t('reviews.reviewCountPlural') : t('reviews.reviewCountSingular')}
              </p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{star} {t('reviews.star')}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          {session && !showForm && (
            <Button onClick={() => setShowForm(true)}>{t('reviews.writeReview')}</Button>
          )}

          {!session && (
            <p className="text-sm text-gray-600">
              {t('reviews.signInToReview')}
            </p>
          )}

          {/* Review Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-2">{t('reviews.rating')} *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="5">5 {t('reviews.stars')} - {t('reviews.excellent')}</option>
                  <option value="4">4 {t('reviews.stars')} - {t('reviews.good')}</option>
                  <option value="3">3 {t('reviews.stars')} - {t('reviews.average')}</option>
                  <option value="2">2 {t('reviews.stars')} - {t('reviews.poor')}</option>
                  <option value="1">1 {t('reviews.star')} - {t('reviews.terrible')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('reviews.reviewTitle')} ({t('common.optional')})
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={t('reviews.titlePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('reviews.review')} ({t('common.optional')})
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  placeholder={t('reviews.commentPlaceholder')}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('common.submitting') : t('reviews.submitReview')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t('reviews.noReviews')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {t('reviews.verifiedPurchase')}
                          </Badge>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-medium">{review.title}</h4>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {t('reviews.by')} {review.user.name || review.user.email.split('@')[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
