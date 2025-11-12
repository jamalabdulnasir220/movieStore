import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role !== "admin") {
      return res.json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    next();
  } catch (error) {
    console.error("Error in admin protection middleware:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
