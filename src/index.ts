import { getRandom, AssetResponseDto } from '@immich/sdk';

async function getRandomImage() {
  const imgElement = document.getElementById("random-photo") as HTMLImageElement;

  let asset: AssetResponseDto | null = null;

  while (true) {
    try {
      asset = (await getRandom({ count: 1 }))[0];
      if (asset.type === "IMAGE") {
        break;
      }
    } catch (error) {
      console.error("Error fetching random asset:", error);
    }
  }

  if (asset) {
    const imageEndpoint = "/api/asset/file/";
    const imageUrl = imageEndpoint + asset.id;
    fetch(imageUrl).catch((error) =>
      console.error("Error pre-fetching next image:", error),
    );

    // Update image if already loaded
    if (imgElement.complete) {
      imgElement.src = imageUrl;
      displayImageWithOverlay(imgElement, imageUrl, asset);
    }
  } else {
    console.warn("No image found in recent attempts.");
  }
}

function getFormattedDate(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function getFormattedLocation(asset: AssetResponseDto) {
  const locationParts = [];

  if (asset.exifInfo?.city) {
    locationParts.push(asset.exifInfo.city);
  }
  if (asset.exifInfo?.state) {
    locationParts.push(asset.exifInfo.state);
  }
  if (asset.exifInfo?.country) {
    locationParts.push(asset.exifInfo.country);
  }

  // Check if any location parts were added
  if (locationParts.length === 0) {
    return null; // Return null if no location information is available
  } else {
    return locationParts.join(", ");
  }
}

function displayImageWithOverlay(imgElement: HTMLImageElement, imageUrl: string, asset: AssetResponseDto) {
  const imageWrapper = imgElement.parentElement;
  if (imageWrapper === null) {
    return;
  }

  // Clear any existing overlay elements (optional)
  const existingOverlays =
    imageWrapper.querySelectorAll(".image-overlay");
  existingOverlays.forEach((overlay) => overlay.remove());

  // Set image source
  imgElement.src = imageUrl;

  // Get formatted location (if available)
  const locationString = getFormattedLocation(asset);

  // Update location overlay (if location available)
  const locationOverlay = imageWrapper.querySelector(".location-overlay") as HTMLElement;
  if (locationOverlay === null) {
    return;
  }
  if (locationString) {
    locationOverlay.textContent = locationString;
    locationOverlay.style.display = "block"; // Show location overlay
  } else {
    locationOverlay.style.display = "none"; // Hide location overlay if no location
  }

  // Update date overlay
  const dateOverlay = imageWrapper.querySelector(".date-overlay") as HTMLElement;
  if (dateOverlay === null) {
    return;
  }
  if (asset.exifInfo?.dateTimeOriginal != null) {
    dateOverlay.textContent = getFormattedDate(asset.exifInfo.dateTimeOriginal);
  }
  dateOverlay.style.display = "block"; // Show date overlay
}

getRandomImage(); // Get initial image
setInterval(getRandomImage, 30000); // Repeat every 30 seconds
