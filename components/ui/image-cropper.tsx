import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";

// Returns a Promise that resolves with a new Blob object, representing the
// specified image encoded as a JPEG and cropped to the specified coordinates.
async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  zoom: number
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.drawImage(
    image,
    safeArea / 2 - (image.width * zoom) / 2,
    safeArea / 2 - (image.height * zoom) / 2,
    image.width * zoom,
    image.height * zoom
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.putImageData(data, 0 - safeArea / 2 + crop.x, 0 - safeArea / 2 + crop.y);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
  });
}

// Creates a new HTMLImageElement containing the specified URL.
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

interface ImageCropperProps {
  imageSrc: string;
  isOpen: boolean;
  onCropComplete: (blob: Blob) => void;
}

export const ImageCropper = ({
  imageSrc,
  isOpen,
  onCropComplete,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);

  const onCrop = useCallback(async () => {
    const croppedImageBlob = await getCroppedImg(imageSrc, crop, zoom);
    onCropComplete(croppedImageBlob);
  }, [crop, zoom, imageSrc, onCropComplete]);

  return (
    <Dialog open={isOpen} onRequestClose={onCrop}>
      <DialogContent>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, croppedAreaPixels) => {
            console.log(croppedArea, croppedAreaPixels);
          }}
        />
      </DialogContent>
      <DialogFooter>
        <Button onClick={onCrop}>Done</Button>
      </DialogFooter>
    </Dialog>
  );
};
