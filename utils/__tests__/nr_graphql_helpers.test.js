'use strict';
import * as nrGraphQlHelpers from '../lib/nr-graphql-helpers';
import { chunk } from '../lib/nr-graphql-helpers';

nrGraphQlHelpers.fetchNRGraphqlResults = jest.fn();

describe('getCategoryTermsFromKeywords', () => {

  beforeEach(() => {
    jest.resetAllMocks();

    // set up return values of data from graphql
    nrGraphQlHelpers.fetchNRGraphqlResults.mockImplementation(() => ({
      data: {
        actor: {
          nr1Catalog: {
            categories: [
              {
                displayName: 'Infrastructure & OS',
                terms: ['os', 'infrastructure'],
              },
              {
                displayName: 'Azure',
                terms: ['azure'],
              },
              {
                displayName: 'Kubernetes & containers',
                terms: ['kubernetes', 'containers'],
              },
            ],
          },
        },
      },
    }));
  })

  test('getCategoryTermsFromKeywords returns undefined if no keywords are provided', async () => {
    const mockKeywords = undefined;

    const categoriesFromKeywords = await nrGraphQlHelpers.getCategoryTermsFromKeywords(
      mockKeywords
    );

    expect(nrGraphQlHelpers.fetchNRGraphqlResults).toHaveBeenCalledTimes(1);
    expect(categoriesFromKeywords).toEqual(undefined);
  });

  test('getCategoryTermsFromKeywords returns undefined if no keywords match a category', async () => {
    const mockKeywords = ['python', 'apm', 'http'];
    const categoriesFromKeywords = await nrGraphQlHelpers.getCategoryTermsFromKeywords(
      mockKeywords
    );

    expect(nrGraphQlHelpers.fetchNRGraphqlResults).toHaveBeenCalledTimes(1);
    expect(categoriesFromKeywords).toEqual(undefined);
  });

  test('getCategoryTermsFromKeywords returns 1 categoryTerm given a set of keywords where a keyword belong to 1 category', async () => {
    const mockKeywords = ['python', 'azure'];
    const categoriesFromKeywords = await nrGraphQlHelpers.getCategoryTermsFromKeywords(
      mockKeywords
    );

    expect(nrGraphQlHelpers.fetchNRGraphqlResults).toHaveBeenCalledTimes(1);
    expect(categoriesFromKeywords).toEqual(['azure']);
  });

  test('getCategoryTermsFromKeywords returns 2 categoryTerms given a set of keywords where keywords belong to 2 categories', async () => {
    const mockKeywords = ['python', 'os', 'containers'];
    const categoriesFromKeywords = await nrGraphQlHelpers.getCategoryTermsFromKeywords(
      mockKeywords
    );

    expect(nrGraphQlHelpers.fetchNRGraphqlResults).toHaveBeenCalledTimes(1);
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
