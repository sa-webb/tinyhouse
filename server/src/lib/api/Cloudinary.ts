import cloudinary from "cloudinary";

export const Cloudinary = {
  upload: async (image: string) => {
    const res = await cloudinary.v2.uploader.upload(image, {
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      cloud_namme: process.env.CLOUDINARY_NAME,
      folder: "TH_Assets/",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    }, function(){});

    return res.secure_url;
  },
};
