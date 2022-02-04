'use strict';
const { getCategoryTermsFromKeywords } = require('../nr-graphql-helpers');

test('getCategoryTermsFromKeywords returns undefined if no keywords are provided', () => {
  const mockKeywords = undefined;
  const categoriesFromKeywords = getCategoryTermsFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(undefined);
});

test('getCategoryTermsFromKeywords returns undefined if no keywords match a category', () => {
  const mockKeywords = ['python', 'apm', 'http'];
  const categoriesFromKeywords = getCategoryTermsFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(undefined);
});

test('getCategoryTermsFromKeywords returns 1 categoryTerm given a set of keywords where a keyword belong to 1 category', () => {
  const mockKeywords = ['python', 'azure'];
  const categoriesFromKeywords = getCategoryTermsFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(['azure']);
});

test('getCategoryTermsFromKeywords returns 2 categoryTerms given a set of keywords where keywords belong to 2 categories', () => {
  const mockKeywords = ['python', 'os', 'containers'];
  const categoriesFromKeywords = getCategoryTermsFromKeywords(mockKeywords);

  expect(categoriesFromKeywords).toEqual(['os', 'containers']);
});
