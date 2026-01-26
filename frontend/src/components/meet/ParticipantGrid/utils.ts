export const getGridClasses = (count: number) => {
  switch (count) {
    case 1:
      return 'grid-cols-1 grid-rows-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1';
    case 3:
      return 'grid-cols-2 grid-rows-2';
    case 4:
      return 'grid-cols-2 grid-rows-2';
    default:
      return 'grid-cols-2 grid-rows-2';
  }
};

export const getParticipantSize = (count: number) => {
  if (count === 1) return 'h-full';
  if (count === 2) return 'h-48 md:h-64';
  return 'h-32 md:h-48';
};
