"use client";

import { useTransition, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/submit-review";

export default function ReviewForm({ placeId }: { placeId: string }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        formData.append("placeId", placeId);
        formData.append("rating", rating.toString());

        startTransition(async () => {
            await submitReview(formData);
            // Reset form
            setRating(0);
            setHover(0);
            (document.getElementById("review-form") as HTMLFormElement).reset();
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                เขียนรีวิว
            </h3>
            <form id="review-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        คะแนน
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hover || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-white/20"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-white/80 mb-2">
                        ชื่อของคุณ (ไม่บังคับ)
                    </label>
                    <input
                        type="text"
                        name="author"
                        id="author"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        placeholder="ชื่อของคุณ..."
                    />
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-white/80 mb-2">
                        ความคิดเห็น
                    </label>
                    <textarea
                        name="comment"
                        id="comment"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        placeholder="เล่าประสบการณ์ของคุณ..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isPending || rating === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "กำลังส่ง..." : "ส่งรีวิว"}
                </button>
            </form>
        </div>
    );
}
