'use strict';
import { getCategoryTermsFromKeywords, chunk } from '../lib/nr-graphql-helpers';

describe('getCategoryTermsFromKeywords', () => {
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
});

describe('chunk', () => {
  it('returns empty array for chunk size of 0', () =>
    expect(chunk([1, 2, 3, 4], 0)).toEqual([]));
  it('returns empty array for chunk size less than 0', () =>
    expect(chunk([1, 2, 3, 4], -10)).toEqual([]));
  it('returns evenly sized chunks', () =>
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]));
  it('returns mostly evenly sized chunks', () =>
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]));
  it('handles empty array', () => expect(chunk([], 2)).toEqual([]));
  it('returns original array in one chunk when chunk size > array length', () =>
    expect(chunk([1, 2, 3, 4], 5)).toEqual([[1, 2, 3, 4]]));
});
