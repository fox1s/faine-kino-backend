export const authCodeCreator = () => {
  const rand = 100000 - 0.5 + Math.random() * (999999 - 100000 + 1);
  console.log(rand);

  return Math.round(rand);
};
