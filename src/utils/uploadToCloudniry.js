const cloud_name = "dhdavx7gh";
const upload_preset = "social";

export const uploadToCloudniry = async (pics, fileType) => {
  // Ensure we have the actual file object
  const fileToUpload = pics instanceof FileList ? pics[0] : pics;

  if (fileToUpload && fileType) {
    const data = new FormData();
    data.append("file", fileToUpload);
    data.append("upload_preset", upload_preset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/${fileType}/upload`,
        { method: "post", body: data }
      );
      
      const fileData = await res.json();
      
      if (fileData.secure_url) {
        console.log("Upload Result (Secure):", fileData.secure_url);
        return fileData.secure_url;
      } else if (fileData.url) {
        return fileData.url.replace("http://", "https://");
      } else {
        console.error("Cloudinary Error:", fileData.error?.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  } else {
    console.log("Error: Missing file or fileType. Received:", { fileToUpload, fileType });
  }
};
