export const getRandomPosition = () => ({
  x: Math.random() * 80 + 10, // 10% to 90% from left
  y: Math.random() * 60 + 20, // 20% to 80% from top
});
