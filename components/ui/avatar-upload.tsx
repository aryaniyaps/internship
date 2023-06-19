import * as React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter } from "./dialog";

interface AvatarUploadProps {
  avatarURL: string;
  onAvatarChange: (newAvatar: Blob) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarURL,
  onAvatarChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [crop, setCrop] = React.useState<Crop>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    unit: "px",
  });
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [upImg, setUpImg] = React.useState(avatarURL);
  const [completedCrop, setCompletedCrop] = React.useState<Crop | null>(null);

  const onImageLoad = (img: HTMLImageElement) => {
    imgRef.current = img;
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
      setIsOpen(true);
    }
  };

  const onCropComplete = (crop: Crop) => {
    setCompletedCrop(crop);
    console.log("CROP COMPLETED");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (completedCrop) {
      await generateCrop(completedCrop);
    }
  };

  const generateCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
      onAvatarChange(croppedImageBlob);
      setIsOpen(false);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  return (
    <div>
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={onSelectFile}
          accept="image/*"
        />
        <Avatar className="h-24 w-24">
          <AvatarImage src={upImg} alt="@aryaniyaps" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </label>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <ReactCrop
            aspect={1}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
            ruleOfThirds
          >
            <img src={upImg} ref={onImageLoad} />
          </ReactCrop>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
