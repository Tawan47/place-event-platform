import { prisma } from "@/lib/prisma";
import { EventStatus, EventSourceType } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) {
        return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(event);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Verify place exists if placeId is changed
        if (body.placeId) {
            const place = await prisma.place.findUnique({
                where: { id: body.placeId },
            });
            if (!place) {
                return Response.json({ error: "Invalid Place ID" }, { status: 400 });
            }
        }

        const event = await prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                stationCode: body.stationCode,
                placeId: body.placeId,
                status: body.status as EventStatus,
            },
        });

        return Response.json(event);
    } catch (error) {
        return Response.json({ error: "Update event failed" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.event.delete({
            where: { id },
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "Delete event failed" }, { status: 500 });
    }
}
