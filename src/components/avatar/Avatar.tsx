import type { AvatarImageProps } from "~/api/avatars";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  height: number;
  imageProps: AvatarImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
};

/**
 * Avatar image component with fallback placeholder.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.imageProps - Avatar image source and srcset
 * @returns Avatar image or SVG placeholder
 */
export function Avatar({
  className,
  imageProps,
  ...rest
}: AvatarProps): React.JSX.Element {
  if (imageProps) {
    return <img alt="" {...imageProps} {...rest} className={className} />;
  }

  return (
    <div>
      <div className={className}>
        <svg
          fill="var(--background-color-canvas)"
          viewBox="0 0 16 16"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
