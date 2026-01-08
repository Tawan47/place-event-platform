"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
    const placeId = formData.get("placeId") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    const author = formData.get("author") as string;

    if (!placeId || !rating) {
        throw new Error("Missing required fields");
    }

    await prisma.review.create({
        data: {
            placeId,
            rating,
            comment,
            author: author || "Anonymous",
        },
    });

    revalidatePath(`/places/${placeId}`);
}
