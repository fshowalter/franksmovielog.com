/**
 * Card component displaying a movie genres.
 * @param props - Component props
 * @param props.genres - The genres to display
 * @returns Styled genres component
 */
export function CardGenres({
  genres,
}: {
  genres: string[];
}): React.JSX.Element {
  return (
    <div
      className={`
        mt-auto font-sans text-xs leading-4 tracking-wider text-subtle
        laptop:tracking-wide
      `}
    >
      {genres.map((genre, index) => {
        if (index === 0) {
          return <span key={genre}>{genre}</span>;
        }

        return <span key={genre}>, {genre}</span>;
      })}
    </div>
  );
}
