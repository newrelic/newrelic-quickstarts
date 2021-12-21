export default VALIDATE_QUICKSTART_MUTATION = `# gql 
mutation (
  $dryRun: Boolean
  $quickstartMetadata: Nr1CatalogQuickstartMetadataInput!
) {
    nr1CatalogCreateQuickstart(
      dryRun: $dryRun 
      quickstartMetadata: $quickstartMetadata
    ) {
        quickstart {
          id
        }
      }
  }
`;
