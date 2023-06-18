import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { ImageCropper } from "./image-cropper";

interface AvatarUploadProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  existingAvatar: string | null;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  existingAvatar,
  onChange,
  ...rest
}) => {
  const [preview, setPreview] = React.useState<string | null>(existingAvatar);
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreview(existingAvatar);
      return;
    }

    // Create a blob URL representing the image file
    const fileUrl = URL.createObjectURL(e.target.files[0]);

    // Do not set the preview directly, but open the cropping modal
    setSelectedImage(fileUrl);
    setCropModalOpen(true);
  };

  const onCropComplete = (croppedImageBlob: Blob) => {
    // Create a blob URL representing the cropped image
    const croppedImageUrl = URL.createObjectURL(croppedImageBlob);

    setPreview(croppedImageUrl);
    setCropModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*"
          {...rest}
        />
        {preview && (
          <Avatar className="h-24 w-24">
            <AvatarImage src={preview} alt="@aryaniyaps" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <ImageCropper
          isOpen={cropModalOpen}
          imageSrc={selectedImage!}
          onCropComplete={onCropComplete}
        />
      </label>
    </div>
  );
};
