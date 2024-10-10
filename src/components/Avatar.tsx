import type { AvatarImageProps } from "~/api/avatars";

type AvatarProps = {
  className?: string;
  height: number;
  imageProps: AvatarImageProps | null;
  loading: "eager" | "lazy";
  name: string;
  width: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Avatar({
  className,
  imageProps,
  name,
  ...rest
}: AvatarProps): JSX.Element {
  if (imageProps) {
    return <img alt={name} {...imageProps} {...rest} className={className} />;
  }

  return (
    <div data-pagefind-meta="image:/assets/default_avatar.svg">
      <div className={className} data-pagefind-meta={`image_alt:${name}`}>
        <svg
          fill="var(--bg-canvas)"
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
