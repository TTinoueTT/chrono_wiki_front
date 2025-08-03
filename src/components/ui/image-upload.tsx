"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, onChange, onBlur, disabled, className }, ref) => {
    const [preview, setPreview] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // プレビュー画像の生成
    React.useEffect(() => {
      if (value) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(value);
      } else {
        setPreview(null);
      }
    }, [value]);

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          // 画像ファイルのみ受け入れ
          if (file.type.startsWith("image/")) {
            onChange?.(file);
            onBlur?.();
          }
        }
      },
      [onChange, onBlur]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      },
      maxFiles: 1,
      disabled,
    });

    const handleRemove = () => {
      onChange?.(null);
      setPreview(null);
      onBlur?.();
    };

    const handleFileSelect = () => {
      // 既にファイルが選択されている場合は選択を解除
      if (value) {
        handleRemove();
        return;
      }
      // ファイルが選択されていない場合はファイル選択ダイアログを開く
      inputRef.current?.click();
    };

    const handleDropzoneClick = (e: React.MouseEvent) => {
      // ドロップゾーンがクリックされた時の処理
      if (value && !isDragActive) {
        e.preventDefault();
        e.stopPropagation();
        handleRemove();
      }
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <div
          {...getRootProps()}
          onClick={handleDropzoneClick}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
            value && !isDragActive && "border-blue-500 bg-blue-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} ref={inputRef} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">
              ここに画像をドロップしてください
            </p>
          ) : value ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                クリックして選択を解除
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={handleFileSelect}
              >
                選択解除
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                画像をドラッグ&ドロップするか、クリックして選択してください
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={handleFileSelect}
              >
                ファイルを選択
              </Button>
            </div>
          )}
        </div>

        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="プレビュー"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {value && (
          <p className="text-xs text-gray-500">
            ファイル名: {value.name} ({(value.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
