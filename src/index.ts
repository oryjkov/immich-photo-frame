import { getRandom, AssetResponseDto, viewAsset, AssetMediaSize, getAllAlbums, AlbumResponseDto } from '@immich/sdk';

async function getRandomImage() {
  const imgElement = document.getElementById("random-photo") as HTMLImageElement;

  let assets = await getRandom({ count: 3 });
  if (assets.length == 0) {
    return;
  }

  let asset: AssetResponseDto | null = null;

  while (true) {
    try {
      let assets = await getRandom({ count: 1 });
      asset = assets[0];
      if (asset.type === "IMAGE" && !asset.isArchived) {
        break;
      }
    } catch (error) {
      console.error("Error fetching random asset:", error);
    }
  }

  if (asset) {
    let albums = await getAllAlbums({ assetId: asset.id });
    let imageBlob = await viewAsset({ id: asset.id, size: AssetMediaSize.Preview });

    // Update image if already loaded
    if (imgElement.complete) {
      displayImageWithOverlay(imgElement, imageBlob, asset, albums);
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

function displayImageWithOverlay(imgElement: HTMLImageElement, imageBlob: Blob, asset: AssetResponseDto, albums: AlbumResponseDto[]) {
  const imageWrapper = imgElement.parentElement;
  if (imageWrapper === null) {
    return;
  }

  imgElement.src = URL.createObjectURL(imageBlob);

  // Clear any existing overlay elements (optional)
  const existingOverlays =
    imageWrapper.querySelectorAll(".image-overlay");
  existingOverlays.forEach((overlay) => overlay.remove());

  // Get formatted location (if available)
  const locationString = getFormattedLocation(asset);

  const albumOverlay = imageWrapper.querySelector(".album-overlay") as HTMLElement;
  if (albumOverlay !== null) {
    if (albums.length > 0) {
      albumOverlay.textContent = albums.map(a => a.albumName).join(", ");
      albumOverlay.style.display = "block";
    } else {
      albumOverlay.style.display = "none";
    }
  }

  // Update location overlay (if location available)
  const locationOverlay = imageWrapper.querySelector(".location-overlay") as HTMLElement;
  if (locationOverlay !== null) {
    if (locationString) {
      locationOverlay.textContent = locationString;
      locationOverlay.style.display = "block"; // Show location overlay
    } else {
      locationOverlay.style.display = "none"; // Hide location overlay if no location
    }
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
