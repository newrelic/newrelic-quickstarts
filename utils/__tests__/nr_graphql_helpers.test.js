'use strict';
const { getCategoriesFromKeywords } = require('../nr-graphql-helpers');

test('getCategoriesFromKeywords returns undefined if no keywords are provided', () => {
  const mockKeywords = undefined;
  const categoriesFromKeywords = getCategoriesFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(undefined);
});

test('getCategoriesFromKeywords returns undefined if no keywords match a category', () => {
  const mockKeywords = ['python', 'apm', 'http'];
  const categoriesFromKeywords = getCategoriesFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(undefined);
});

test('getCategoriesFromKeywords returns 1 category given a set of keywords where a keyword belong to 1 category', () => {
  const mockKeywords = ['python', 'featured'];
  const categoriesFromKeywords = getCategoriesFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(['featured']);
});

test('getCategoriesFromKeywords returns 2 categories given a set of keywords where keywords belong to 2 categories', () => {
  const mockKeywords = ['python', 'featured', 'containers'];
  const categoriesFromKeywords = getCategoriesFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual([
    'featured',
    'kubernetes-and-containers',
  ]);
});
