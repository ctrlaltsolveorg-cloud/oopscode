"use server";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file size (e.g., max 200MB for Catbox)
  if (file.size > 200 * 1024 * 1024) {
    return { error: "File too large. Max 200MB." };
  }

  const catboxFormData = new FormData();
  catboxFormData.append("reqtype", "fileupload");
  catboxFormData.append("fileToUpload", file);

  try {
    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    if (!response.ok) {
      return { error: "Failed to upload to Catbox" };
    }

    const url = await response.text();
    if (!url.startsWith("http")) {
      return { error: "Invalid response from host: " + url };
    }

    return { url: url.trim() };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Something went wrong during upload" };
  }
}
