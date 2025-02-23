import {v2 as cloudanary} from "cloudinary";
import fs from "fs";

cloudanary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const prediction_list = [
    "earthquake", "human_damage", "land_slide", "riot", 
    "road_accident", "urban_fire", "water_disaster", "wild_fire"
];

const uploaOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudanary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File is uploaded to Cloudinary:", response.url);

        const classification = await classifyImage(response.url);

        return { response, classification };
    } catch (error) {
        console.error("Upload failed:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

// Function to call Python API for classification
const classifyImage = async (imageUrl) => {
    try {
        const apiUrl = "https://4246-2409-40e0-103e-1e85-e990-bf48-5224-7beb.ngrok-free.app/predict";

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: imageUrl })
        });

        const rawText = await res.text(); // Read response as text
        console.log("Raw API Response:", rawText);

        if (!res.ok) {
            console.error(`API Error (${res.status}): ${rawText}`);
            return "unknown";
        }

        return JSON.parse(rawText).prediction || "unknown";
    } catch (error) {
        console.error("Error in classification:", error);
        return "unknown";
    }
};

export { uploaOnCloudinary };