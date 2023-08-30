export const randomIntFromInterval = ({ min, max }: { min: number, max: number }): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateNumberToDivide = (divisor: number): number => {
  return divisor * randomIntFromInterval({ min: 50, max: 500 });
};
