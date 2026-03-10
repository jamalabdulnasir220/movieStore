import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No file provided" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "showqueue",
      resource_type: "image",
    });

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("uploadImage error", error);
    return res.json({
      success: false,
      message: "Failed to upload image",
    });
  }
};

