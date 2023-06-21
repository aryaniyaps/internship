import Image from "next/image";
import * as React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter } from "./dialog";

interface AvatarUploadProps extends React.HTMLProps<HTMLInputElement> {
  username: string;
  avatarURL: string;
  onAvatarChange: (newAvatar: Blob) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  username,
  avatarURL,
  onAvatarChange,
  disabled,
}) => {
  const [crop, setCrop] = React.useState<Crop>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    unit: "px",
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(avatarURL);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const onImageLoad = (img: HTMLImageElement) => {
    imgRef.current = img;
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setSelectedImage(reader.result as string)
      );
      reader.readAsDataURL(e.target.files[0]);
      // clear the selected file
      e.target.value = "";
      setIsOpen(true);
    }
  };

  const onCropComplete = (crop: Crop) => {
    setCrop(crop);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    await generateCrop(crop);
  };

  const generateCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
      onAvatarChange(croppedImageBlob);
      setPreview(URL.createObjectURL(croppedImageBlob));
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
      <label className="cursor-pointer w-full text-center">
        <input
          type="file"
          className="absolute hidden"
          onChange={onSelectFile}
          disabled={disabled}
          accept="image/png, image/jpeg"
        />
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview} loading="eager" alt={`@${username}`} />
          <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </label>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col justify-center items-center gap-6">
          <ReactCrop
            aspect={1}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
            ruleOfThirds
            circularCrop
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                ref={onImageLoad}
                className="w-auto h-auto object-contain"
                width={400}
                height={400}
                alt="selected image"
              />
            )}
          </ReactCrop>
          <DialogFooter className="flex gap-2 items-center">
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
