export const labelInTwoString = (label: string) => {
  const splitedLabel = label.split(' ');
  switch (splitedLabel.length) {
    case 1:
      return splitedLabel[0].substr(0, 2);
      break;
    default:
      return splitedLabel[0].charAt(0) + splitedLabel[1].charAt(0);
      break;
  }
};
