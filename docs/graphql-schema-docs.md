# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Objects](#objects)
    * [Nr1CatalogInstallAlertPolicyTemplateResult](#nr1cataloginstallalertpolicytemplateresult)
    * [Nr1CatalogInstallDashboardTemplateResult](#nr1cataloginstalldashboardtemplateresult)
    * [Nr1CatalogInstallPlan](#nr1cataloginstallplan)
    * [Nr1CatalogInstallPlanStep](#nr1cataloginstallplanstep)
    * [Nr1CatalogInstallPlanTarget](#nr1cataloginstallplantarget)
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
  * [Inputs](#inputs)
    * [Nr1CatalogInstallDirectiveInput](#nr1cataloginstalldirectiveinput)
    * [Nr1CatalogInstallPlanDirectiveInput](#nr1cataloginstallplandirectiveinput)
    * [Nr1CatalogInstallPlanStepInput](#nr1cataloginstallplanstepinput)
    * [Nr1CatalogInstallPlanTargetInput](#nr1cataloginstallplantargetinput)
    * [Nr1CatalogQuickstartMetadataAlertConditionInput](#nr1catalogquickstartmetadataalertconditioninput)
    * [Nr1CatalogQuickstartMetadataDashboardInput](#nr1catalogquickstartmetadatadashboardinput)
    * [Nr1CatalogQuickstartMetadataDocumentationInput](#nr1catalogquickstartmetadatadocumentationinput)
    * [Nr1CatalogQuickstartMetadataInput](#nr1catalogquickstartmetadatainput)
  * [Enums](#enums)
    * [Nr1CatalogInstallPlanDestination](#nr1cataloginstallplandestination)
    * [Nr1CatalogInstallPlanDirectiveMode](#nr1cataloginstallplandirectivemode)
    * [Nr1CatalogInstallPlanOperatingSystem](#nr1cataloginstallplanoperatingsystem)
    * [Nr1CatalogInstallPlanTargetType](#nr1cataloginstallplantargettype)
    * [Nr1CatalogInstallerType](#nr1cataloginstallertype)
    * [Nr1CatalogQuickstartAlertConditionType](#nr1catalogquickstartalertconditiontype)
  * [Interfaces](#interfaces)
    * [Nr1CatalogInstallPlanDirective](#nr1cataloginstallplandirective)
    * [Nr1CatalogInstaller](#nr1cataloginstaller)
    * [Nr1CatalogQuickstartComponent](#nr1catalogquickstartcomponent)
    * [Nr1CatalogQuickstartComponentMetadata](#nr1catalogquickstartcomponentmetadata)

</details>

## Objects

### Nr1CatalogInstallAlertPolicyTemplateResult

Information about the mutation result when installing an alert policy template * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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
<td colspan="2" valign="top"><strong>alertPolicyTemplate</strong></td>
<td valign="top">Nr1CatalogAlertPolicyTemplate!</td>
<td>

The template that was used for the installation * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>createdAlertPolicy</strong></td>
<td valign="top">Nr1CatalogAlertPolicyOutline!</td>
<td>

An outline of the created alert policy * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallDashboardTemplateResult

Information about the mutation result when installing a dashboard template * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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
<td colspan="2" valign="top"><strong>createdDashboard</strong></td>
<td valign="top">Nr1CatalogDashboardOutline!</td>
<td>

An outline of the created dashboard * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dashboardTemplate</strong></td>
<td valign="top">Nr1CatalogDashboardTemplate!</td>
<td>

The template that was used for the installation * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlan

An installer that uses install plan steps * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The list of install plan steps necessary to execute the installation of the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallertype">Nr1CatalogInstallerType</a>!</td>
<td>

The type of installer * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanStep

Information pertaining to a specific step in the installation plan * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fallback</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirective">Nr1CatalogInstallPlanDirective</a></td>
<td>

Provides context about how the fallback install plan step should proceed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heading</strong></td>
<td valign="top">String!</td>
<td>

Used as a heading for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>primary</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirective">Nr1CatalogInstallPlanDirective</a>!</td>
<td>

Provides context about how the primary install plan step should proceed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>target</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantarget">Nr1CatalogInstallPlanTarget</a>!</td>
<td>

Provides context about where the install will occur * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanTarget

Represents the location of an install * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Provides context on the location the install will take place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>os</strong></td>
<td valign="top">[<a href="#nr1cataloginstallplanoperatingsystem">Nr1CatalogInstallPlanOperatingSystem</a>!]!</td>
<td>

Provides context for the operating system that will be targeted * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargettype">Nr1CatalogInstallPlanTargetType</a>!</td>
<td>

Provides context for the type of installation that will take place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstart

Information about the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Determines if this is a featured quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartmetadata">Nr1CatalogQuickstartMetadata</a></td>
<td>

Metadata associated with the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

Specifies the URL where the source definition for the quickstart can be found * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>supportLevel</strong></td>
<td valign="top">Nr1CatalogSupportLevel!</td>
<td>

Level of support expected for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlert

Information about an alert in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The unique identifier for the alert * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



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

Metadata associated with the alert * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertCondition

Information about an alert condition in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The unique identifier for the alert condition * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditionmetadata">Nr1CatalogQuickstartAlertConditionMetadata</a>!</td>
<td>

Metadata associated with the alert condition * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertConditionMetadata

Metadata associated with the alert condition in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the alert condition * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the alert condition * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditiontype">Nr1CatalogQuickstartAlertConditionType</a>!</td>
<td>

Determines the type of alert condition that will be created * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartAlertMetadata

Metadata associated with the alert in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the alert. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



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

The human-readable name for the alert. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use Nr1CatalogQuickstartAlertCondition instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDashboard

Information about a dashboard in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The unique identifier for the dashboard * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metadata</strong></td>
<td valign="top"><a href="#nr1catalogquickstartdashboardmetadata">Nr1CatalogQuickstartDashboardMetadata</a>!</td>
<td>

Metadata associated with the dashboard * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDashboardMetadata

Metadata associated with the dashboard in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the dashboard. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the dashboard. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previews</strong></td>
<td valign="top">[Nr1CatalogPreview!]!</td>
<td>

A list of previews for the dashboard, such as screenshots. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDocumentation

Information about a documentation component in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Metadata associated with the dashboard * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartDocumentationMetadata

Metadata associated with the documentation component in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the documentation component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the documentation component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The documentation URL * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartInstallPlan

Information about an install plan component in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Metadata associated with the install plan * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use installer instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartInstallPlanMetadata

Metadata associated with the install plan in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the documentation component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



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

The human-readable name for the install plan component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



<p>⚠️ <strong>DEPRECATED</strong></p>
<blockquote>

This field is no longer supported. Please use installer instead.

</blockquote>
</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadata

Metadata associated with the quickstart that is available in New Relic I/O * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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
<td valign="top">[Nr1CatalogAuthor!]!</td>
<td>

Authors for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categories</strong></td>
<td valign="top">[Nr1CatalogCategory!]!</td>
<td>

The list of categories for filtering, searching, and grouping associated with the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]!</td>
<td>

The list of category terms associated with the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dataSources</strong></td>
<td valign="top">[Nr1CatalogDataSource!]!</td>
<td>

The list of data sources associated with the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String</td>
<td>

A short form description for the quickstart. Used throughout the platform when displaying the quickstart. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the quickstart. Used throughout the New Relic One platform when displaying the quickstart. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top">Nr1CatalogIcon</td>
<td>

The corresponding icon for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>installer</strong></td>
<td valign="top"><a href="#nr1cataloginstaller">Nr1CatalogInstaller</a></td>
<td>

Information about how a quickstart is installed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]!</td>
<td>

A list of keywords for filtering and searching * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quickstartComponents</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartcomponent">Nr1CatalogQuickstartComponent</a>!]!</td>
<td>

List of components in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top">String!</td>
<td>

The URL friendly name of the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>summary</strong></td>
<td valign="top">String</td>
<td>

A short summary detailing the functionality of the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartsListing

Paginated information about Quickstarts * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Cursor used to fetch the next set of results * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>results</strong></td>
<td valign="top">[<a href="#nr1catalogquickstart">Nr1CatalogQuickstart</a>!]!</td>
<td>

The list of quickstart results * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top">Int!</td>
<td>

The total number of quickstart results * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

## Inputs

### Nr1CatalogInstallDirectiveInput

Set of attributes which represent how an install takes place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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
<td colspan="2" valign="top"><strong>link</strong></td>
<td valign="top">Nr1CatalogLinkInstallDirectiveInput</td>
<td>

Link information for this directive. Cannot be used with a nerdlet directive. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdlet</strong></td>
<td valign="top">Nr1CatalogNerdletInstallDirectiveInput</td>
<td>

Nerdlet information for this directive. Cannot be used with a link directive. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanDirectiveInput

Set of attributes which represent how an install takes place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

Value that pairs with the mode to enable the installation step. Supported values are a recipe_name, nerdlet_id, or a link * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>link</strong></td>
<td valign="top">Nr1CatalogLinkDirectiveInput</td>
<td>

Link information for this directive. Cannot be used with nerdlet or targeted directives. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mode</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectivemode">Nr1CatalogInstallPlanDirectiveMode</a></td>
<td>

The type of installation that will take place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nerdlet</strong></td>
<td valign="top">Nr1CatalogNerdletDirectiveInput</td>
<td>

Nerdlet information for this directive. Cannot be used with link or targeted directives. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>targeted</strong></td>
<td valign="top">Nr1CatalogTargetedDirectiveInput</td>
<td>

Targeted information for this directive. Cannot be used with link or nerdlet directives. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanStepInput

Metadata associated with a specific step in the install plan * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

A short form description for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fallback</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectiveinput">Nr1CatalogInstallPlanDirectiveInput</a></td>
<td>

Provides context about how the fallback install plan step should proceed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heading</strong></td>
<td valign="top">String!</td>
<td>

Used as a heading for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top">ID!</td>
<td>

The unique identifier for the install plan step * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>primary</strong></td>
<td valign="top"><a href="#nr1cataloginstallplandirectiveinput">Nr1CatalogInstallPlanDirectiveInput</a>!</td>
<td>

Provides context about how the primary install plan step should proceed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>target</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargetinput">Nr1CatalogInstallPlanTargetInput</a>!</td>
<td>

Provides context about where the install will occur * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstallPlanTargetInput

Represents the location of an install * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

Provides context on the location the install will take place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>os</strong></td>
<td valign="top">[<a href="#nr1cataloginstallplanoperatingsystem">Nr1CatalogInstallPlanOperatingSystem</a>!]</td>
<td>

Operating system for the install * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1cataloginstallplantargettype">Nr1CatalogInstallPlanTargetType</a>!</td>
<td>

Provides context for the type of installation that will take place * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataAlertConditionInput

Metadata associated with the alert condition in this quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

A short form description for the alert condition. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the alert condition. Used throughout the New Relic One platform when displaying the alert condition. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rawConfiguration</strong></td>
<td valign="top">Nr1CatalogRawConfiguration!</td>
<td>

The raw JSON configuration for the alert condition * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

The source of the alert configuration * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#nr1catalogquickstartalertconditiontype">Nr1CatalogQuickstartAlertConditionType</a>!</td>
<td>

Determines the type of alert condition that will be created * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataDashboardInput

Metadata associated with the dashboard in this quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

A short form description for the dashboard. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the dashboard. Used throughout the New Relic One platform when displaying the dashboard. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rawConfiguration</strong></td>
<td valign="top">Nr1CatalogRawConfiguration!</td>
<td>

The raw JSON configuration for the dashboard * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>screenshots</strong></td>
<td valign="top">[Nr1CatalogScreenshotInput!]</td>
<td>

A list of previews for the dashboard, such as screenshots. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

The source of the dashboard configuration * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataDocumentationInput

Metadata associated with the documentation in this quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

A short form description for the documentation component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the documentation component. Used throughout the New Relic One platform when displaying the documentation component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top">String!</td>
<td>

The documentation URL * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartMetadataInput

Metadata associated with the quickstart that will be available in New Relic Instant Observability * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)




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

A list of alert condition components that are included in the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authors</strong></td>
<td valign="top">[Nr1CatalogAuthorInput!]!</td>
<td>

Authors for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>categoryTerms</strong></td>
<td valign="top">[String!]</td>
<td>

The list of category terms associated with the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dashboards</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartmetadatadashboardinput">Nr1CatalogQuickstartMetadataDashboardInput</a>!]</td>
<td>

A list of dashboard components that are included in the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dataSourceIds</strong></td>
<td valign="top">[ID!]</td>
<td>

A list of data source ids corresponding to the data sources associated with this quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top">String!</td>
<td>

A short form description for the quickstart. Used throughout the platform when displaying the quickstart. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String!</td>
<td>

The human-readable name for the quickstart. Used throughout the New Relic One platform when displaying the quickstart. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>documentation</strong></td>
<td valign="top">[<a href="#nr1catalogquickstartmetadatadocumentationinput">Nr1CatalogQuickstartMetadataDocumentationInput</a>!]</td>
<td>

A list of documentation components that are included in the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>icon</strong></td>
<td valign="top">String!</td>
<td>

The public url of an icon for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>installPlanStepIds</strong></td>
<td valign="top">[ID!]</td>
<td>

A list of install plan step ids corresponding to the steps of the installation plan * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>keywords</strong></td>
<td valign="top">[String!]</td>
<td>

A list of keywords for filtering and searching * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top">String</td>
<td>

The URL friendly name for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sourceUrl</strong></td>
<td valign="top">String</td>
<td>

Specifies the URL where the source definition for the quickstart can be found * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>summary</strong></td>
<td valign="top">String!</td>
<td>

A short summary detailing the functionality of the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>supportLevel</strong></td>
<td valign="top">Nr1CatalogSupportLevel</td>
<td>

Level of support for the quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(flag:`DevEx/nrio_mutations`)



</td>
</tr>
</tbody>
</table>

## Enums

### Nr1CatalogInstallPlanDestination

Possible destinations for the install plan target * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Possible modes for an install plan directive * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Possible types for the install plan operating system * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Possible types for the install plan target * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Type of installer * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

### Nr1CatalogQuickstartAlertConditionType

Possible types of configured alert conditions * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

## Interfaces


### Nr1CatalogInstallPlanDirective

Information about an install plan directive * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The mode of the install plan directive * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogInstaller

Information about how a quickstart is installed * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

The type of installer * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartComponent

Information about a component in a quickstart * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

Metadata associated with the quickstart component * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>

### Nr1CatalogQuickstartComponentMetadata

Information related to the metadata attached to a quickstart component * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)




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

A short form description for the quickstart component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>displayName</strong></td>
<td valign="top">String</td>
<td>

The human-readable name for the quickstart component. * [#help-nr1-dev-experience](https://newrelic.slack.com/archives/CPE597DNY)

* No repo link provided

 * visibility(customer)



</td>
</tr>
</tbody>
</table>
