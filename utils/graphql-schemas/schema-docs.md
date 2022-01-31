# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Objects](#objects)
    * [Nr1CatalogActorStitchedFields](#nr1catalogactorstitchedfields)
    * [Nr1CatalogAllSupportedEntityTypes](#nr1catalogallsupportedentitytypes)
    * [Nr1CatalogAuthor](#nr1catalogauthor)
    * [Nr1CatalogCategory](#nr1catalogcategory)
    * [Nr1CatalogCategoryFacet](#nr1catalogcategoryfacet)
    * [Nr1CatalogCommunityContactChannel](#nr1catalogcommunitycontactchannel)
    * [Nr1CatalogComponentFacet](#nr1catalogcomponentfacet)
    * [Nr1CatalogCreateQuickstartResult](#nr1catalogcreatequickstartresult)
    * [Nr1CatalogEmailContactChannel](#nr1catalogemailcontactchannel)
    * [Nr1CatalogIcon](#nr1catalogicon)
    * [Nr1CatalogInstallPlan](#nr1cataloginstallplan)
    * [Nr1CatalogInstallPlanStep](#nr1cataloginstallplanstep)
    * [Nr1CatalogInstallPlanTarget](#nr1cataloginstallplantarget)
    * [Nr1CatalogIssuesContactChannel](#nr1catalogissuescontactchannel)
    * [Nr1CatalogLauncher](#nr1cataloglauncher)
    * [Nr1CatalogLauncherMetadata](#nr1cataloglaunchermetadata)
    * [Nr1CatalogLinkInstallPlanDirective](#nr1cataloglinkinstallplandirective)
    * [Nr1CatalogNerdlet](#nr1catalognerdlet)
    * [Nr1CatalogNerdletInstallPlanDirective](#nr1catalognerdletinstallplandirective)
    * [Nr1CatalogNerdletMetadata](#nr1catalognerdletmetadata)
    * [Nr1CatalogNerdpack](#nr1catalognerdpack)
    * [Nr1CatalogNerdpackMetadata](#nr1catalognerdpackmetadata)
    * [Nr1CatalogNoSupportedEntityTypes](#nr1catalognosupportedentitytypes)
    * [Nr1CatalogQuickstart](#nr1catalogquickstart)
    * [Nr1CatalogQuickstartAlert](#nr1catalogquickstartalert)
    * [Nr1CatalogQuickstartAlertCondition](#nr1catalogquickstartalertcondition)
    * [Nr1CatalogQuickstartAlertConditionMetadata](#nr1catalogquickstartalertconditionmetadata)
    * [Nr1CatalogQuickstartAlertMetadata](#nr1catalogquickstartalertmetadata)
    * [Nr1CatalogQuickstartDashboard](#nr1catalogquickstartdashboard)
    * [Nr1CatalogQuickstartDashboardMetadata](#nr1catalogquickstartdashboardmetadata)
    * [Nr1CatalogQuickstartDocumentation](#nr1catalogquickstartdocumentation)
    * [Nr1CatalogQuickstartDocumentationMetadata](#nr1catalogquickstartdocumentationmetadata)
    * [Nr1CatalogQuickstartInstallPlan](#nr1catalogquickstartinstallplan)
    * [Nr1CatalogQuickstartInstallPlanMetadata](#nr1catalogquickstartinstallplanmetadata)
    * [Nr1CatalogQuickstartMetadata](#nr1catalogquickstartmetadata)
    * [Nr1CatalogQuickstartsListing](#nr1catalogquickstartslisting)
    * [Nr1CatalogReleaseNote](#nr1catalogreleasenote)
    * [Nr1CatalogScreenshot](#nr1catalogscreenshot)
    * [Nr1CatalogSearchFacets](#nr1catalogsearchfacets)
    * [Nr1CatalogSearchResponse](#nr1catalogsearchresponse)
    * [Nr1CatalogSpecificSupportedEntityTypes](#nr1catalogspecificsupportedentitytypes)
    * [Nr1CatalogSubmitInstallPlanStepResult](#nr1catalogsubmitinstallplanstepresult)
    * [Nr1CatalogSubmitMetadataError](#nr1catalogsubmitmetadataerror)
    * [Nr1CatalogSubmitMetadataResult](#nr1catalogsubmitmetadataresult)
    * [Nr1CatalogSubmitQuickstartResult](#nr1catalogsubmitquickstartresult)
    * [Nr1CatalogSupportChannels](#nr1catalogsupportchannels)
    * [Nr1CatalogTargetedInstallPlanDirective](#nr1catalogtargetedinstallplandirective)
    * [Nr1CatalogUpdateQuickstartResult](#nr1catalogupdatequickstartresult)
    * [Nr1CatalogVisualization](#nr1catalogvisualization)
    * [Nr1CatalogVisualizationMetadata](#nr1catalogvisualizationmetadata)
  * [Inputs](#inputs)
    * [Nr1CatalogAuthorInput](#nr1catalogauthorinput)
    * [Nr1CatalogCommunityContactChannelInput](#nr1catalogcommunitycontactchannelinput)
    * [Nr1CatalogEmailContactChannelInput](#nr1catalogemailcontactchannelinput)
    * [Nr1CatalogInstallPlanDirectiveInput](#nr1cataloginstallplandirectiveinput)
    * [Nr1CatalogInstallPlanStepInput](#nr1cataloginstallplanstepinput)
    * [Nr1CatalogInstallPlanTargetInput](#nr1cataloginstallplantargetinput)
    * [Nr1CatalogIssuesContactChannelInput](#nr1catalogissuescontactchannelinput)
    * [Nr1CatalogLinkDirectiveInput](#nr1cataloglinkdirectiveinput)
    * [Nr1CatalogNerdletDirectiveInput](#nr1catalognerdletdirectiveinput)
    * [Nr1CatalogQuickstartMetadataAlertConditionInput](#nr1catalogquickstartmetadataalertconditioninput)
    * [Nr1CatalogQuickstartMetadataDashboardInput](#nr1catalogquickstartmetadatadashboardinput)
    * [Nr1CatalogQuickstartMetadataDocumentationInput](#nr1catalogquickstartmetadatadocumentationinput)
    * [Nr1CatalogQuickstartMetadataInput](#nr1catalogquickstartmetadatainput)
    * [Nr1CatalogScreenshotInput](#nr1catalogscreenshotinput)
    * [Nr1CatalogSearchFilter](#nr1catalogsearchfilter)
    * [Nr1CatalogSubmitMetadataInput](#nr1catalogsubmitmetadatainput)
    * [Nr1CatalogSupportInput](#nr1catalogsupportinput)
    * [Nr1CatalogTargetedDirectiveInput](#nr1catalogtargeteddirectiveinput)
  * [Enums](#enums)
    * [Nr1CatalogInstallPlanDestination](#nr1cataloginstallplandestination)
    * [Nr1CatalogInstallPlanDirectiveMode](#nr1cataloginstallplandirectivemode)
    * [Nr1CatalogInstallPlanOperatingSystem](#nr1cataloginstallplanoperatingsystem)
    * [Nr1CatalogInstallPlanTargetType](#nr1cataloginstallplantargettype)
    * [Nr1CatalogInstallerType](#nr1cataloginstallertype)
    * [Nr1CatalogMutationResult](#nr1catalogmutationresult)
    * [Nr1CatalogNerdpackVisibility](#nr1catalognerdpackvisibility)
    * [Nr1CatalogQuickstartAlertConditionType](#nr1catalogquickstartalertconditiontype)
    * [Nr1CatalogRenderFormat](#nr1catalogrenderformat)
    * [Nr1CatalogSearchComponentType](#nr1catalogsearchcomponenttype)
    * [Nr1CatalogSearchResultType](#nr1catalogsearchresulttype)
    * [Nr1CatalogSearchSortOption](#nr1catalogsearchsortoption)
    * [Nr1CatalogSubmitMetadataErrorType](#nr1catalogsubmitmetadataerrortype)
    * [Nr1CatalogSupportLevel](#nr1catalogsupportlevel)
    * [Nr1CatalogSupportedEntityTypesMode](#nr1catalogsupportedentitytypesmode)
  * [Scalars](#scalars)
    * [Nr1CatalogRawConfiguration](#nr1catalograwconfiguration)
    * [Nr1CatalogRawNerdletState](#nr1catalograwnerdletstate)
  * [Interfaces](#interfaces)
    * [Nr1CatalogInstallPlanDirective](#nr1cataloginstallplandirective)
    * [Nr1CatalogInstaller](#nr1cataloginstaller)
    * [Nr1CatalogNerdpackItem](#nr1catalognerdpackitem)
    * [Nr1CatalogNerdpackItemMetadata](#nr1catalognerdpackitemmetadata)
    * [Nr1CatalogPreview](#nr1catalogpreview)
    * [Nr1CatalogQuickstartComponent](#nr1catalogquickstartcomponent)
    * [Nr1CatalogQuickstartComponentMetadata](#nr1catalogquickstartcomponentmetadata)
    * [Nr1CatalogSupportedEntityTypes](#nr1catalogsupportedentitytypes)
  * [Unions](#unions)
    * [Nr1CatalogSearchResult](#nr1catalogsearchresult)

</details>

## Objects

### Nr1CatalogActorStitchedFields



---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[<a href="#nr1catalogcategory">Nr1CatalogCategory</a>!]</td>
<td>

List of available categories for filtering and searching

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdpack</strong></td>
<td valign="top"><a href="#nr1catalognerdpack">Nr1CatalogNerdpack</a></td>
<td>

Information related to a deployed Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top">ID!</td>
<td>

The ID associated with the Nerdpack

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdpacks</strong></td>
<td valign="top">[<a href="#nr1catalognerdpack">Nr1CatalogNerdpack</a>!]</td>
<td>

List of nerdpacks available in the catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quickstart</strong></td>
<td valign="top"><a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a></td>
<td>

Catalog information related to a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top">ID!</td>
<td>

The ID associated with the quickstart

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quickstarts</strong></td>
<td valign="top"><a href="#nr1catalogquickstartslisting">Nr1CatalogQuickstartsListing</a></td>
<td>

List of Quickstarts available in New Relic I/O

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">String</td>
<td>

Cursor for pagination. Supplied by a previous Quickstarts query.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>search</strong></td>
<td valign="top"><a href="#nr1catalogsearchresponse">Nr1CatalogSearchResponse</a></td>
<td>

Search for items in the catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">String</td>
<td>

Cursor for pagination. Supplied by a previous search.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top"><a href="#nr1catalogsearchfilter">Nr1CatalogSearchFilter</a></td>
<td>

Set of filters to apply to the search

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">query</td>
<td valign="top">String</td>
<td>

Search query string

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">sortBy</td>
<td valign="top"><a href="#nr1catalogsearchsortoption">Nr1CatalogSearchSortOption</a></td>
<td>

Method used to sort the search results

</td>
</tr>
</tbody>
</table>

### Nr1CatalogAllSupportedEntityTypes

Specifies the supported entity types to be all entity types

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1catalogsupportedentitytypesmode">Nr1CatalogSupportedEntityTypesMode</a>!</td>
<td>

The level of support entity types. Always set to ALL

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogAuthor

Information about an author

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top">String!</td>
<td>

The name of the author

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogCategory

A thematic grouping for catalog items

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human readable name of the category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top">String!</td>
<td>

The url friendly name of the category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>terms</strong></td>
<td valign="top">[String!]!</td>
<td>

A list of terms that match catalog items to this category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogCategoryFacet

Information about a facet count on a category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top">Int!</td>
<td>

The count of results for this category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The category's display name

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogCommunityContactChannel

A contact channel where users can get support via the community

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL linking to a website for support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogComponentFacet

Information about a facet count on a component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>component</strong></td>
<td valign="top"><a href="#nr1catalogsearchcomponenttype">Nr1CatalogSearchComponentType</a>!</td>
<td>

The type of component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top">Int!</td>
<td>

The count of results for this component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogCreateQuickstartResult

Information about the mutation result when creating quickstart metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>quickstart</strong></td>
<td valign="top"><a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a></td>
<td>

The quickstart created as a result of running the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogEmailContactChannel

A contact channel where users can get support via email

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>address</strong></td>
<td valign="top">String!</td>
<td>

The email address for email support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogIcon

Information about an icon

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The publicly accessible URL for the icon

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlan

An installer that uses install plan steps

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>steps</strong></td>
<td valign="top">[<a href="#nr1cataloginstallplanstep">Nr1CatalogInstallPlanStep</a>!]!</td>
<td>

The list of install plan steps necessary to execute the installation of the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallertype">Nr1CatalogInstallerType</a>!</td>
<td>

The type of installer

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanStep

Information pertaining to a specific step in the installation plan

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fallback</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirective">Nr1CatalogInstallPlanDirective</a></td>
<td>

Provides context about how the fallback install plan step should proceed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heading</strong></td>
<td valign="top">String!</td>
<td>

Used as a heading for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>primary</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirective">Nr1CatalogInstallPlanDirective</a>!</td>
<td>

Provides context about how the primary install plan step should proceed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>target</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantarget">Nr1CatalogInstallPlanTarget</a>!</td>
<td>

Provides context about where the install will occur

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanTarget

Represents the location of an install

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>destination</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandestination">Nr1CatalogInstallPlanDestination</a>!</td>
<td>

Provides context on the location the install will take place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>os</strong></td>
<td valign="top">[<a href="#nr1cataloginstallplanoperatingsystem">Nr1CatalogInstallPlanOperatingSystem</a>!]!</td>
<td>

Provides context for the operating system that will be targeted

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargettype">Nr1CatalogInstallPlanTargetType</a>!</td>
<td>

Provides context for the type of installation that will take place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogIssuesContactChannel

A contact channel where users can get support via the repository issues page

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL linking to the repository issues page

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogLauncher

Information about a launcher in a Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the launcher.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1cataloglaunchermetadata">Nr1CatalogLauncherMetadata</a></td>
<td>

Metadata associated with the launcher

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogLauncherMetadata

Metadata information for a launcher

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the launcher.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the launcher.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top"><a href="#nr1catalogicon">Nr1CatalogIcon</a></td>
<td>

The corresponding icon for the launcher.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the launcher, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogLinkInstallPlanDirective

Information about a link install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a>!</td>
<td>

The mode of the install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL of the external link used to guide the user through installation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdlet

Information about a Nerdlet in a Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the Nerdlet.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalognerdletmetadata">Nr1CatalogNerdletMetadata</a></td>
<td>

Metadata associated with the Nerdlet

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdletInstallPlanDirective

Information about a targeted install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a>!</td>
<td>

The mode of the install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdletId</strong></td>
<td valign="top">ID!</td>
<td>

The nerdlet ID used to guide the user through installation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdletState</strong></td>
<td valign="top"><a href="#nr1catalograwnerdletstate">Nr1CatalogRawNerdletState</a></td>
<td>

The nerdlet state used to intialize the nerdlet

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdletMetadata

Metadata information for a Nerdlet

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the Nerdlet.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the Nerdlet.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the Nerdlet, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>supportedEntityTypes</strong></td>
<td valign="top"><a href="#nr1catalogsupportedentitytypes">Nr1CatalogSupportedEntityTypes</a></td>
<td>

The supported entity types by the Nerdlet.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdpack

Information about the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalognerdpackmetadata">Nr1CatalogNerdpackMetadata</a></td>
<td>

Metadata associated with the Nerdpack that is available in the New Relic One Catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>visibility</strong></td>
<td valign="top"><a href="#nr1catalognerdpackvisibility">Nr1CatalogNerdpackVisibility</a>!</td>
<td>

Indicates the visibility of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdpackMetadata

Metadata associated with the Nerdpack that is available in the New Relic One Catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>additionalInfo</strong></td>
<td valign="top">String</td>
<td>

Additional information about the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">format</td>
<td valign="top"><a href="#nr1catalogrenderformat">Nr1CatalogRenderFormat</a></td>
<td>

The output format for the additional information

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[<a href="#nr1catalogcategory">Nr1CatalogCategory</a>!]!</td>
<td>

The list of categories for filtering, searching, and grouping associated with the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]!</td>
<td>

The list of category terms associated with the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the New Relic One Nerdpack. Used throughout the platform when displaying the Nerdpack.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>details</strong></td>
<td valign="top">String</td>
<td>

The long form description used in the catalog to detail the functionality of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the Nerdpack. Used throughout the New Relic One platform when displaying the Nerdpack.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>documentation</strong></td>
<td valign="top">String</td>
<td>

Additional documentation for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">format</td>
<td valign="top"><a href="#nr1catalogrenderformat">Nr1CatalogRenderFormat</a></td>
<td>

The output format for the documentation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top"><a href="#nr1catalogicon">Nr1CatalogIcon</a></td>
<td>

The corresponding icon for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>includedArtifactTypes</strong></td>
<td valign="top">[String]</td>
<td>

The types of artifacts (e.g. nerdlet, launcher, etc) contained in the nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]!</td>
<td>

The list of keywords for filtering and searching

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdpackItems</strong></td>
<td valign="top">[<a href="#nr1catalognerdpackitem">Nr1CatalogNerdpackItem</a>!]!</td>
<td>

Information related to items in the nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the Nerdpack, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>publishDate</strong></td>
<td valign="top">DateTime</td>
<td>

The date the Nerdpack was published

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>releaseDate</strong> ⚠️</td>
<td valign="top">DateTime</td>
<td>

The date the Nerdpack was deployed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use publishDate instead.

</blockquote>
</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top">String</td>
<td>

The URL to the repository where the source code for the Nerdpack can be found.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>support</strong></td>
<td valign="top"><a href="#nr1catalogsupportchannels">Nr1CatalogSupportChannels</a>!</td>
<td>

Contact information to get support for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tagline</strong></td>
<td valign="top">String</td>
<td>

A tagline for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top">SemVer!</td>
<td>

The nerdpack version the metadata corresponds with

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>whatsNew</strong></td>
<td valign="top"><a href="#nr1catalogreleasenote">Nr1CatalogReleaseNote</a></td>
<td>

A description of changes for this version of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNoSupportedEntityTypes

Specifies the supported entity types to be no entity types

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1catalogsupportedentitytypesmode">Nr1CatalogSupportedEntityTypesMode</a>!</td>
<td>

The level of support entity types. Always set to NONE

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstart

Information about the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>featured</strong></td>
<td valign="top">Boolean!</td>
<td>

Determines if this is a featured quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartmetadata">Nr1CatalogQuickstartMetadata</a></td>
<td>

Metadata associated with the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

Specifies the URL where the source definition for the quickstart can be found

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>supportLevel</strong></td>
<td valign="top"><a href="#nr1catalogsupportlevel">Nr1CatalogSupportLevel</a>!</td>
<td>

Level of support expected for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlert

Information about an alert in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong> ⚠️</td>
<td valign="top">ID!</td>
<td>

The unique identifier for the alert

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong> ⚠️</td>
<td valign="top"><a href="#nr1catalogquickstartalertmetadata">Nr1CatalogQuickstartAlertMetadata</a>!</td>
<td>

Metadata associated with the alert

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertCondition

Information about an alert condition in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the alert condition

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditionmetadata">Nr1CatalogQuickstartAlertConditionMetadata</a>!</td>
<td>

Metadata associated with the alert condition

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertConditionMetadata

Metadata associated with the alert condition in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the alert condition

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the alert condition

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditiontype">Nr1CatalogQuickstartAlertConditionType</a>!</td>
<td>

Determines the type of alert condition that will be created

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertMetadata

Metadata associated with the alert in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong> ⚠️</td>
<td valign="top">String</td>
<td>

A short form description for the alert.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong> ⚠️</td>
<td valign="top">String</td>
<td>

The human-readable name for the alert.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDashboard

Information about a dashboard in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the dashboard

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartdashboardmetadata">Nr1CatalogQuickstartDashboardMetadata</a>!</td>
<td>

Metadata associated with the dashboard

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDashboardMetadata

Metadata associated with the dashboard in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the dashboard.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the dashboard.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the dashboard, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDocumentation

Information about a documentation component in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartdocumentationmetadata">Nr1CatalogQuickstartDocumentationMetadata</a>!</td>
<td>

Metadata associated with the dashboard

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDocumentationMetadata

Metadata associated with the documentation component in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the documentation component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the documentation component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The documentation URL

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartInstallPlan

Information about an install plan component in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong> ⚠️</td>
<td valign="top"><a href="#nr1catalogquickstartinstallplanmetadata">Nr1CatalogQuickstartInstallPlanMetadata</a>!</td>
<td>

Metadata associated with the install plan

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use installer instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartInstallPlanMetadata

Metadata associated with the install plan in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong> ⚠️</td>
<td valign="top">String</td>
<td>

A short form description for the documentation component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use installer instead.

</blockquote>
</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong> ⚠️</td>
<td valign="top">String</td>
<td>

The human-readable name for the install plan component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use installer instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadata

Metadata associated with the quickstart that is available in New Relic I/O

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authors</strong></td>
<td valign="top">[<a href="#nr1catalogauthor">Nr1CatalogAuthor</a>!]!</td>
<td>

Authors for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[<a href="#nr1catalogcategory">Nr1CatalogCategory</a>!]!</td>
<td>

The list of categories for filtering, searching, and grouping associated with the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]!</td>
<td>

The list of category terms associated with the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the quickstart. Used throughout the platform when displaying the quickstart.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the quickstart. Used throughout the New Relic One platform when displaying the quickstart.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top"><a href="#nr1catalogicon">Nr1CatalogIcon</a></td>
<td>

The corresponding icon for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>installer</strong></td>
<td valign="top"><a href="#nr1cataloginstaller">Nr1CatalogInstaller</a></td>
<td>

Information about how a quickstart is installed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]!</td>
<td>

A list of keywords for filtering and searching

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quickstartComponents</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartcomponent">Nr1CatalogQuickstartComponent</a>!]!</td>
<td>

List of components in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top">String!</td>
<td>

The URL friendly name of the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>summary</strong></td>
<td valign="top">String</td>
<td>

A short summary detailing the functionality of the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartsListing

Paginated information about Quickstarts

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>nextCursor</strong></td>
<td valign="top">String</td>
<td>

Cursor used to fetch the next set of results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>results</strong></td>
<td valign="top">[<a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a>!]!</td>
<td>

The list of quickstart results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top">Int!</td>
<td>

The total number of quickstart results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogReleaseNote

Information about the changes made to the metadata for a version of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>changes</strong></td>
<td valign="top">String!</td>
<td>

The description of changes made for this version of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top">SemVer!</td>
<td>

The version of the Nerdpack the changes correspond with

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogScreenshot

Information about the publicly accessible screenshot

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The publicly accessible URL for the screenshot

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchFacets

Information about facets from a search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[<a href="#nr1catalogcategoryfacet">Nr1CatalogCategoryFacet</a>!]!</td>
<td>

Facet counts for each category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>components</strong></td>
<td valign="top">[<a href="#nr1catalogcomponentfacet">Nr1CatalogComponentFacet</a>!]!</td>
<td>

Facet counts for each component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>featured</strong></td>
<td valign="top">Int!</td>
<td>

Count of the number of featured results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchResponse

Information about results returned from a search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>facets</strong></td>
<td valign="top"><a href="#nr1catalogsearchfacets">Nr1CatalogSearchFacets</a>!</td>
<td>

Get count information about the filters

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nextCursor</strong></td>
<td valign="top">String</td>
<td>

Cursor used to fetch the next set of results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>results</strong></td>
<td valign="top">[<a href="#nr1catalogsearchresult">Nr1CatalogSearchResult</a>!]!</td>
<td>

The list of search results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top">Int!</td>
<td>

The total number of results that match the search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSpecificSupportedEntityTypes

Specifies the supported entity types to be a specific subset of entity types

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>entityTypes</strong></td>
<td valign="top">[DomainType!]!</td>
<td>

The list of support entity types.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1catalogsupportedentitytypesmode">Nr1CatalogSupportedEntityTypesMode</a>!</td>
<td>

The level of support entity types. Always set to SPECIFIC

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitInstallPlanStepResult

Information about the mutation result when submitting install plan metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>installPlanStep</strong></td>
<td valign="top"><a href="#nr1cataloginstallplanstep">Nr1CatalogInstallPlanStep</a></td>
<td>

The install plan step with updated information as a result of running the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitMetadataError

Information about the error that occurred as a result of submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String!</td>
<td>

A human-readable description of the error when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>field</strong></td>
<td valign="top">[String!]</td>
<td>

The field that caused the error when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1catalogsubmitmetadataerrortype">Nr1CatalogSubmitMetadataErrorType</a>!</td>
<td>

The type of error that occurred when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitMetadataResult

Information about the mutation result when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>errors</strong></td>
<td valign="top">[<a href="#nr1catalogsubmitmetadataerror">Nr1CatalogSubmitMetadataError</a>!]</td>
<td>

A list of errors that may have occurred as a result of submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdpack</strong></td>
<td valign="top"><a href="#nr1catalognerdpack">Nr1CatalogNerdpack</a></td>
<td>

The Nerdpack with updated information as a result of running the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>result</strong></td>
<td valign="top"><a href="#nr1catalogmutationresult">Nr1CatalogMutationResult</a>!</td>
<td>

The mutation result when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitQuickstartResult

Information about the mutation result when updating quickstart metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>quickstart</strong></td>
<td valign="top"><a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a></td>
<td>

The quickstart with updated information as a result of running the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSupportChannels

A container for the various support channels

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>community</strong></td>
<td valign="top"><a href="#nr1catalogcommunitycontactchannel">Nr1CatalogCommunityContactChannel</a></td>
<td>

A support channel available via the community

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#nr1catalogemailcontactchannel">Nr1CatalogEmailContactChannel</a></td>
<td>

A support channel available via email

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>issues</strong></td>
<td valign="top"><a href="#nr1catalogissuescontactchannel">Nr1CatalogIssuesContactChannel</a></td>
<td>

A support channel available via an issues page

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogTargetedInstallPlanDirective

Information about a targeted install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a>!</td>
<td>

The mode of the install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>recipeName</strong></td>
<td valign="top">String!</td>
<td>

The name of the recipe used for the installation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogUpdateQuickstartResult

Information about the mutation result when updating quickstart metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>quickstart</strong></td>
<td valign="top"><a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a></td>
<td>

The quickstart with updated information as a result of running the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogVisualization

Information about a visualization in a Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the visualization.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogvisualizationmetadata">Nr1CatalogVisualizationMetadata</a></td>
<td>

Metadata associated with the visualization

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogVisualizationMetadata

Metadata information for a visualization

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the visualization.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the visualization.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the visualization, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

## Inputs

### Nr1CatalogAuthorInput

Information about an author

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top">String!</td>
<td>

The name of the author

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogCommunityContactChannelInput

Details about the contact channel where users can get support via the web

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL linking to the website where users can get web support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogEmailContactChannelInput

Details about the contact channel where users can get support via email

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>address</strong></td>
<td valign="top">String!</td>
<td>

The email address where users can get email support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanDirectiveInput

Set of attributes which represent how an install takes place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>destination</strong></td>
<td valign="top">String</td>
<td>

Value that pairs with the mode to enable the installation step. Supported values are a recipe_name, nerdlet_id, or a link

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>link</strong></td>
<td valign="top"><a href="#nr1cataloglinkdirectiveinput">Nr1CatalogLinkDirectiveInput</a></td>
<td>

Link information for this directive. Cannot be used with nerdlet or targeted directives.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a></td>
<td>

The type of installation that will take place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdlet</strong></td>
<td valign="top"><a href="#nr1catalognerdletdirectiveinput">Nr1CatalogNerdletDirectiveInput</a></td>
<td>

Nerdlet information for this directive. Cannot be used with link or targeted directives.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>targeted</strong></td>
<td valign="top"><a href="#nr1catalogtargeteddirectiveinput">Nr1CatalogTargetedDirectiveInput</a></td>
<td>

Targeted information for this directive. Cannot be used with link or nerdlet directives.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanStepInput

Metadata associated with a specific step in the install plan

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String!</td>
<td>

A short form description for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fallback</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectiveinput">Nr1CatalogInstallPlanDirectiveInput</a></td>
<td>

Provides context about how the fallback install plan step should proceed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heading</strong></td>
<td valign="top">String!</td>
<td>

Used as a heading for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the install plan step

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>primary</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectiveinput">Nr1CatalogInstallPlanDirectiveInput</a>!</td>
<td>

Provides context about how the primary install plan step should proceed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>target</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargetinput">Nr1CatalogInstallPlanTargetInput</a>!</td>
<td>

Provides context about where the install will occur

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanTargetInput

Represents the location of an install

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>destination</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandestination">Nr1CatalogInstallPlanDestination</a>!</td>
<td>

Provides context on the location the install will take place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>os</strong></td>
<td valign="top">[<a href="#nr1cataloginstallplanoperatingsystem">Nr1CatalogInstallPlanOperatingSystem</a>!]</td>
<td>

Operating system for the install

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargettype">Nr1CatalogInstallPlanTargetType</a>!</td>
<td>

Provides context for the type of installation that will take place

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogIssuesContactChannelInput

Details about the contact channel where users can get support via the repository issues page

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL linking the repository issues page where users can get support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogLinkDirectiveInput

Link information for a directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The URL to use for this directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdletDirectiveInput

Nerdlet information for a directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>nerdletId</strong></td>
<td valign="top">String!</td>
<td>

The ID of the nerdlet to use for this directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdletState</strong></td>
<td valign="top"><a href="#nr1catalograwnerdletstate">Nr1CatalogRawNerdletState</a></td>
<td>

The initial state to be passed to a nerdlet

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataAlertConditionInput

Metadata associated with the alert condition in this quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the alert condition.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the alert condition. Used throughout the New Relic One platform when displaying the alert condition.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rawConfiguration</strong></td>
<td valign="top"><a href="#nr1catalograwconfiguration">Nr1CatalogRawConfiguration</a>!</td>
<td>

The raw JSON configuration for the alert condition

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

The source of the alert configuration

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditiontype">Nr1CatalogQuickstartAlertConditionType</a>!</td>
<td>

Determines the type of alert condition that will be created

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataDashboardInput

Metadata associated with the dashboard in this quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the dashboard.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the dashboard. Used throughout the New Relic One platform when displaying the dashboard.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rawConfiguration</strong></td>
<td valign="top"><a href="#nr1catalograwconfiguration">Nr1CatalogRawConfiguration</a>!</td>
<td>

The raw JSON configuration for the dashboard

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>screenshots</strong></td>
<td valign="top">[<a href="#nr1catalogscreenshotinput">Nr1CatalogScreenshotInput</a>!]</td>
<td>

A list of previews for the dashboard, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

The source of the dashboard configuration

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataDocumentationInput

Metadata associated with the documentation in this quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String!</td>
<td>

A short form description for the documentation component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the documentation component. Used throughout the New Relic One platform when displaying the documentation component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The documentation URL

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataInput

Metadata associated with the quickstart that will be available in New Relic Instant Observability

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>alertConditions</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartmetadataalertconditioninput">Nr1CatalogQuickstartMetadataAlertConditionInput</a>!]</td>
<td>

A list of alert condition components that are included in the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authors</strong></td>
<td valign="top">[<a href="#nr1catalogauthorinput">Nr1CatalogAuthorInput</a>!]!</td>
<td>

Authors for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]</td>
<td>

The list of category terms associated with the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dashboards</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartmetadatadashboardinput">Nr1CatalogQuickstartMetadataDashboardInput</a>!]</td>
<td>

A list of dashboard components that are included in the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String!</td>
<td>

A short form description for the quickstart. Used throughout the platform when displaying the quickstart.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the quickstart. Used throughout the New Relic One platform when displaying the quickstart.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>documentation</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartmetadatadocumentationinput">Nr1CatalogQuickstartMetadataDocumentationInput</a>!]</td>
<td>

A list of documentation components that are included in the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top">String!</td>
<td>

The public url of an icon for the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>installPlanStepIds</strong></td>
<td valign="top">[ID!]</td>
<td>

A list of install plan step ids corresponding to the steps of the installation plan

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]</td>
<td>

A list of keywords for filtering and searching

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

Specifies the URL where the source definition for the quickstart can be found

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>summary</strong></td>
<td valign="top">String!</td>
<td>

A short summary detailing the functionality of the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogScreenshotInput

Information about the publicly accessible screenshot

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The publicly accessible URL for the screenshot

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchFilter

Criteria for applying filters to a search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[String!]</td>
<td>

Filter the search results that match any in a list of category terms

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>category</strong></td>
<td valign="top">String</td>
<td>

Filter the search results by a particular category

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>components</strong></td>
<td valign="top">[<a href="#nr1catalogsearchcomponenttype">Nr1CatalogSearchComponentType</a>!]</td>
<td>

Filter the search results that contain a set of component types

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>types</strong></td>
<td valign="top">[<a href="#nr1catalogsearchresulttype">Nr1CatalogSearchResultType</a>!]</td>
<td>

Filter the search results that are of a specific type

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitMetadataInput

Metadata associated with the Nerdpack that will be available in the New Relic One Catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>additionalInfo</strong></td>
<td valign="top">String</td>
<td>

Additional information relevant for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]</td>
<td>

A list of terms for category grouping when filtering and searching the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>details</strong></td>
<td valign="top">String</td>
<td>

A long form description used in the catalog to detail the functionality of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>documentation</strong></td>
<td valign="top">String</td>
<td>

Additional documentation relevant for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]</td>
<td>

A list of keywords for filtering and searching the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>repository</strong></td>
<td valign="top">String</td>
<td>

A URL that links to the repository where the source code for this Nerdpack can be found

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>support</strong></td>
<td valign="top"><a href="#nr1catalogsupportinput">Nr1CatalogSupportInput</a></td>
<td>

Support channels where users can contact you to get support for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tagline</strong></td>
<td valign="top">String</td>
<td>

A tagline for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top">SemVer!</td>
<td>

The version of the Nerdpack that will be associated with this metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>whatsNew</strong></td>
<td valign="top">String</td>
<td>

A description of changes describing what changed for this version of the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSupportInput

A container specifying the various types support channels

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>community</strong></td>
<td valign="top"><a href="#nr1catalogcommunitycontactchannelinput">Nr1CatalogCommunityContactChannelInput</a></td>
<td>

A support channel where users can get support via the community

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#nr1catalogemailcontactchannelinput">Nr1CatalogEmailContactChannelInput</a></td>
<td>

A support channel where users can get support via email

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>issues</strong></td>
<td valign="top"><a href="#nr1catalogissuescontactchannelinput">Nr1CatalogIssuesContactChannelInput</a></td>
<td>

A support channel where users can get support via issues

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogTargetedDirectiveInput

Targeted information for a directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>recipeName</strong></td>
<td valign="top">String!</td>
<td>

The recipe name to use for this directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

## Enums

### Nr1CatalogInstallPlanDestination

Possible destinations for the install plan target

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>APPLICATION</strong></td>
<td>

Application (APM) install

</td>
</tr>
<tr>
<td valign="top"><strong>CLOUD</strong></td>
<td>

Cloud provider install

</td>
</tr>
<tr>
<td valign="top"><strong>HOST</strong></td>
<td>

Host install

</td>
</tr>
<tr>
<td valign="top"><strong>KUBERNETES</strong></td>
<td>

Kubernetes install

</td>
</tr>
<tr>
<td valign="top"><strong>UNKNOWN</strong></td>
<td>

Unknown install - special case when the target where the install takes place is unknown (such as guided install)

</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanDirectiveMode

Possible modes for an install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>LINK</strong></td>
<td>

Directs the installation toward an external link

</td>
</tr>
<tr>
<td valign="top"><strong>NERDLET</strong></td>
<td>

Directs the installation to open a stacked Nerdlet to perform the installation

</td>
</tr>
<tr>
<td valign="top"><strong>TARGETED</strong></td>
<td>

Directs the installation toward a specific target

</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanOperatingSystem

Possible types for the install plan operating system

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>DARWIN</strong></td>
<td>

Mac operating system

</td>
</tr>
<tr>
<td valign="top"><strong>LINUX</strong></td>
<td>

Linux operating system

</td>
</tr>
<tr>
<td valign="top"><strong>WINDOWS</strong></td>
<td>

Windows operating system

</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanTargetType

Possible types for the install plan target

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>AGENT</strong></td>
<td>

Agent install

</td>
</tr>
<tr>
<td valign="top"><strong>INTEGRATION</strong></td>
<td>

Integration install

</td>
</tr>
<tr>
<td valign="top"><strong>ON_HOST_INTEGRATION</strong></td>
<td>

On host integration install

</td>
</tr>
<tr>
<td valign="top"><strong>UNKNOWN</strong></td>
<td>

Unknown install - special case when the target where the install takes place is unknown (such as guided install)

</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallerType

Type of installer

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>INSTALL_PLAN</strong></td>
<td>

Install plan

</td>
</tr>
</tbody>
</table>

### Nr1CatalogMutationResult

Outcome of the mutation

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ERROR</strong></td>
<td>

The mutation failed

</td>
</tr>
<tr>
<td valign="top"><strong>OK</strong></td>
<td>

The mutation was processed successfully

</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdpackVisibility

Possible visibilities for the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>GLOBAL</strong></td>
<td>

Indicates the Nerdpack is available globally across all accounts

</td>
</tr>
<tr>
<td valign="top"><strong>OWNER_AND_ALLOWED</strong></td>
<td>

Indicates the Nerdpack is only available to the owning and allowed accounts

</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertConditionType

Possible types of configured alert conditions

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>BASELINE</strong></td>
<td>

A baseline alert condition

</td>
</tr>
<tr>
<td valign="top"><strong>OUTLIER</strong> ⚠️</td>
<td>

An outlier alert condition

<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

Outlier alert conditions are no longer supported

</blockquote>
</td>
</tr>
<tr>
<td valign="top"><strong>STATIC</strong></td>
<td>

A static alert condition

</td>
</tr>
</tbody>
</table>

### Nr1CatalogRenderFormat

Supported rendering formats for data

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>MARKDOWN</strong></td>
<td>

Renders the output in Markdown

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchComponentType

Possible component types to filter the search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ALERTS</strong></td>
<td>

Filter search results that contain alerts

</td>
</tr>
<tr>
<td valign="top"><strong>APPS</strong></td>
<td>

Filter search results that contain apps

</td>
</tr>
<tr>
<td valign="top"><strong>DASHBOARDS</strong></td>
<td>

Filter search results that contain dashboards

</td>
</tr>
<tr>
<td valign="top"><strong>DATA_SOURCES</strong></td>
<td>

Filter search results that contain data sources

</td>
</tr>
<tr>
<td valign="top"><strong>VISUALIZATIONS</strong></td>
<td>

Filter search results that contain visualizations

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchResultType

Possible search result types used to filter search results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>NERDPACK</strong></td>
<td>

Filter search results by nerdpacks

</td>
</tr>
<tr>
<td valign="top"><strong>QUICKSTART</strong></td>
<td>

Filter search results by quickstarts

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSearchSortOption

Possible options to sort search results

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ALPHABETICAL</strong></td>
<td>

Sort the search results alphabetically

</td>
</tr>
<tr>
<td valign="top"><strong>POPULARITY</strong></td>
<td>

Sort the search results by most popular

</td>
</tr>
<tr>
<td valign="top"><strong>RELEVANCE</strong></td>
<td>

Sort the search results by the most relevant to the search query

</td>
</tr>
<tr>
<td valign="top"><strong>REVERSE_ALPHABETICAL</strong></td>
<td>

Sort the search results alphabetically in reverse order

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSubmitMetadataErrorType

The type of error that occurred during the mutation when submitting metadata

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>NERDPACK_NOT_FOUND</strong></td>
<td>

The Nerdpack cannot be found

</td>
</tr>
<tr>
<td valign="top"><strong>SERVER_ERROR</strong></td>
<td>

Something went wrong in the service

</td>
</tr>
<tr>
<td valign="top"><strong>UNAUTHORIZED</strong></td>
<td>

The user does not have permission to update the metadata for the Nerdpack

</td>
</tr>
<tr>
<td valign="top"><strong>UNSUPPORTED_TYPE</strong></td>
<td>

The type of the Nerdpack is not supported in the New Relic One Catalog

</td>
</tr>
<tr>
<td valign="top"><strong>VALIDATION_FAILED</strong></td>
<td>

The submitted metadata is not valid and needs to be corrected to be accepted

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSupportLevel

Possible levels of support

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>COMMUNITY</strong></td>
<td>

Community supported

</td>
</tr>
<tr>
<td valign="top"><strong>ENTERPRISE</strong></td>
<td>

Enterprise supported

</td>
</tr>
<tr>
<td valign="top"><strong>NEW_RELIC</strong></td>
<td>

New Relic supported

</td>
</tr>
<tr>
<td valign="top"><strong>VERIFIED</strong></td>
<td>

Partner supported

</td>
</tr>
</tbody>
</table>

### Nr1CatalogSupportedEntityTypesMode

Possible modes for supported entity types

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ALL</strong></td>
<td>

Indicates that all entity types are supported

</td>
</tr>
<tr>
<td valign="top"><strong>NONE</strong></td>
<td>

Indicates that no entity types are supported

</td>
</tr>
<tr>
<td valign="top"><strong>SPECIFIC</strong></td>
<td>

Indicates that a specific set of entity types are supported

</td>
</tr>
</tbody>
</table>

## Scalars

### Nr1CatalogRawConfiguration

Represents raw JSON configuration data

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(flag:`DevEx/nrio_mutations`)



### Nr1CatalogRawNerdletState

Represents JSON nerdlet state data

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)




## Interfaces


### Nr1CatalogInstallPlanDirective

Information about an install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a>!</td>
<td>

The mode of the install plan directive

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstaller

Information about how a quickstart is installed

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallertype">Nr1CatalogInstallerType</a>!</td>
<td>

The type of installer

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdpackItem

Information about an item in a Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the Nerdpack item.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalognerdpackitemmetadata">Nr1CatalogNerdpackItemMetadata</a></td>
<td>

Metadata associated with the Nerdpack item

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogNerdpackItemMetadata

Metadata information for an item in a Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the Nerdpack item.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the Nerdpack item.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[<a href="#nr1catalogpreview">Nr1CatalogPreview</a>!]!</td>
<td>

A list of previews for the Nerdpack item, such as screenshots.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogPreview

Specifies fields required for types that implement the ability to display a media preview in the New Relic One Catalog

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The publicly accessible URL for the preview

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartComponent

Information about a component in a quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartcomponentmetadata">Nr1CatalogQuickstartComponentMetadata</a>!</td>
<td>

Metadata associated with the quickstart component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartComponentMetadata

Information related to the metadata attached to a quickstart component

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the quickstart component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the quickstart component.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogSupportedEntityTypes

Specifies fields required for types that implement the ability to determine the level of supported entity types.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1catalogsupportedentitytypesmode">Nr1CatalogSupportedEntityTypesMode</a>!</td>
<td>

Determines the supported entity type mode.

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



</td>
</tr>
</tbody>
</table>

## Unions

### Nr1CatalogSearchResult

A result returned when executing a search

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)



<table>
<thead>
<th align="left">Type</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong><a href="#nr1catalognerdpack">Nr1CatalogNerdpack</a></strong></td>
<td valign="top">Information about the Nerdpack

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)

</td>
</tr>
<tr>
<td valign="top"><strong><a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a></strong></td>
<td valign="top">Information about the quickstart

---
**NR Internal** | [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY) | visibility(customer)

</td>
</tr>
</tbody>
</table>
