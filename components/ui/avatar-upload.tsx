import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";

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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreview(existingAvatar);
      return;
    }

    // Create a blob URL representing the image file
    const fileUrl = URL.createObjectURL(e.target.files[0]);

    setPreview(fileUrl);

    if (onChange) {
      onChange(e);
    }
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
          // <img
          //   className="h-24 w-24 rounded-full mb-4"
          //   src={preview}
          //   alt="Avatar Preview"
          // />
        )}
      </label>
    </div>
  );
};
