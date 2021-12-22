export default VALIDATE_QUICKSTART_MUTATION = `# gql 
mutation (
  $dryRun: Boolean
  $id: ID!
  $quickstartMetadata: Nr1CatalogQuickstartMetadataInput!
) {
    nr1CatalogUpdateQuickstart(
      dryRun: $dryRun
      id: $id
      quickstartMetadata: $quickstartMetadata
    ) {
        quickstart {
          id
        }
      }
  }
`;
