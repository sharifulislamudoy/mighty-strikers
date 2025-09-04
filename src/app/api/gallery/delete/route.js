import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function DELETE(request) {
    try {
        const { db } = await connectToDatabase();
        const galleryCollection = db.collection("gallery");

        const { imageId } = await request.json();

        if (!imageId) {
            return Response.json({ message: "Image ID is required" }, { status: 400 });
        }

        // delete image by _id
        const result = await galleryCollection.deleteOne({ _id: new ObjectId(imageId) });

        if (result.deletedCount === 0) {
            return Response.json({ message: "Image not found" }, { status: 404 });
        }

        return Response.json({ message: "Image deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Gallery deletion error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
