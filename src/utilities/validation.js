const regularExpression = {
  numberAndLatin: /^[A-Za-z][A-Za-z0-9]*$/g,
  allLetterTypes: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/g,
  allTypesAndOverSix: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/g,
};
const { numberAndLatin, allLetterTypes, allTypesAndOverSix } = regularExpression;

export const isNumberAndLatin = (str) => {
  return numberAndLatin.test(str);
};

export const isAllTypes = (str) => {
  return allLetterTypes.test(str);
};

export const isAllTypesOverSix = (str) => {
  return allTypesAndOverSix.test(str);
};

export const isLengthOver = (number, str) => {
  return str.length > number;
};

export const isLongerThan = (number, str) => {
  return str.length >= number;
};

export const isLengthBelow = (number, str) => {
  return str.length < number;
};

export const isShorterThan = (number, str) => {
  return str.length <= number;
};

export const isMatch = (valueOne, valueTwo) => {
  return valueOne === valueTwo;
};
