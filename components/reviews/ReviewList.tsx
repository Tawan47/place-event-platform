import { Star } from "lucide-react";
import type { Review } from "@prisma/client";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg text-center">
                <p className="text-white/50">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเลย!</p>
            </div>
        );
    }

    const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg flex items-center justify-between">
                <div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-white/50 mb-1">/ 5</span>
                    </div>
                    <p className="text-sm text-white/50">{reviews.length} รีวิว</p>
                </div>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-6 h-6 ${star <= Math.round(averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-white/20"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-white">
                                {review.author || "Anonymous"}
                            </span>
                            <span className="text-xs text-white/30">
                                {new Date(review.createdAt).toLocaleDateString("th-TH")}
                            </span>
                        </div>
                        <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                        {review.comment && (
                            <p className="text-white/80 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
