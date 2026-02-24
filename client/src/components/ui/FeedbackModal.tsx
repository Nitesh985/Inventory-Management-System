import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../AppIcon";
import { createReview, getMyReview } from "@/api/reviews";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError("");
      setSubmitted(false);
      getMyReview()
        .then((res) => {
          if (res?.data) {
            setStars(res.data.stars);
            setContent(res.data.content);
          } else {
            setStars(0);
            setContent("");
          }
        })
        .catch(() => {
          setStars(0);
          setContent("");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (stars === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!content.trim()) {
      setError("Please write your feedback.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await createReview({ stars, content: content.trim() });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Share Feedback</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Icon name="Loader2" size={32} className="text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : submitted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={32} className="text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">Thank You!</h3>
                <p className="text-sm text-gray-600 mt-1">Your feedback has been submitted successfully.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStars(value)}
                      onMouseEnter={() => setHoveredStar(value)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Icon
                        name="Star"
                        size={32}
                        className={`transition-colors ${
                          value <= (hoveredStar || stars)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {stars > 0 && (
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      {stars === 1 && "Poor"}
                      {stars === 2 && "Fair"}
                      {stars === 3 && "Good"}
                      {stars === 4 && "Very Good"}
                      {stars === 5 && "Excellent"}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us what you think about Digital Khata..."
                  rows={4}
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none disabled:opacity-50 placeholder:text-gray-400"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400">{content.length}/1000</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FeedbackModal;
