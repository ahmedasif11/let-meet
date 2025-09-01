export const getConnectionColor = (quality: string) => {
  switch (quality) {
    case 'good':
      return 'text-green-500';
    case 'poor':
      return 'text-yellow-500';
    case 'disconnected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
