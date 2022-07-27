# Salesforce Logfile Event Monitoring



# **Summary**

This document contains the specs for logfile events from salesforce. Since Salesforce does not allow any third party agents/sensors to be installed on their cloud, the logfile monitoring seems to be the next best approach to monitor a salesforce organization and have an understanding of performance, security, and other aspects of the platform.


We use Salesforce's EventLogFile add-on which represents event log files for event monitoring. The event monitoring product gathers information about Salesforce org’s operational events, which could be used to analyze usage trends and user behavior. Additionally it captures the platform performance and certain aspects of the platform security.


By default New Relic captures all event logfiles, and all attributes within those log files. The collector agent has 2 modes for collecting salesforce data:

- As logs in NRDB Log event type
- As events saved as separate event types in NRDB

If you need to ignore certain attributes in any event types, you could use the mapping yaml file of the logfile event collector to do so.


Salesforce Docs Links

- [Object Reference for Salesforce and Lightning Platform](https://resources.docs.salesforce.com/234/latest/en-us/sfdc/pdf/object_reference.pdf)
- [EventLogFile Supported Event Types](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_supportedeventtypes.htm) 



API version info:

- Currently on version 54.0.
- [This version of the API](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_supportedeventtypes.htm) supports 57 event types. Note that in version 54.0 "API Event Type" was renamed to "SOAP API Event Type".
- New event types and metrics are added over time in new releases.
- Some of the event types(and metrics within event types) do not exist in older API versions.
- If significant, the API document (or metric description) will point out the API version in which the feature / metric was introduced.


# **Common Event Metrics**

Salesforce events include metrics which help identify the data and enable admins to connect the dots. In general the following metrics are useful for identifying events, where they come from, and the user who generated the event:

- EVENT\_TYPE: The type of event being captured. In cases where all events are captured as log events in NRDB, this metric comes very handy to filter the data for specific event types. 
- ORGANIZATION\_ID: Every record in every event type contains ORGANIZATION\_ID to which it belongs.
- SESSION\_KEY: All relevant event types contain a SESSION\_KEY. This is the user's unique session id. This value can be used to identify all user events within a session. When a user logs out and logs back in again, a new session is started.
- LOGIN\_KEY: All relevant event types contain LOGIN\_KEY. This key ties together all events in a given user's login session. It starts with a login event and ends with either a logout event or the user session expiring.
- REQUEST\_ID: All event types except one (OneCommerceUsage) contain this metric. All events within a transaction share the same REQUEST\_ID.
- USER\_ID: Except "ApexUnexpectedException" and "CORS Violation Record (CVR)" all event types contain the USER\_ID who caused an event to be generated.
- CLIENT\_IP: In the current version of the event log monitoring API 40 of event types which are relevant to requests that are made by users, contain CLIENT\_IP which helps identify the location of the user who performed an action on the platform.

These metrics help identify activities within the system. You could potentially use these metrics to categorize events based on specific organization, user, session, location, and request, filter all events that belong to certain transaction, or login session.
# **
# **Salesforce Event Categories**

We categorize SFDC events to 3 main areas for visualizing the information

- Security
  - Login and Logout
  - Reports
  - Data Downloads / Exports
  - Package installation
  - Platform encryption

- Platform
  - Performance
  - Transaction
  - Browser
  - Usage tracking
  - Troubleshooting

- User
  - Interactions
  - User related activities
  - Troubleshooting


**Note:** some of the event types may overlap and be used in multiple categories. This document focuses on the security category.


Here is a complete list of event types that are captured from Salesforce using New Relic EventLogFile Monitoring:

- [Apex Callout Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apexcallout.htm)
- [Apex Execution Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apexexecution.htm)
- [Apex REST API Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apexrestapi.htm)
- [Apex SOAP Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apexsoap.htm)
- [Apex Trigger Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apextrigger.htm)
- [Apex Unexpected Exception Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apexunexpectedexception.htm)
- [API Total Usage](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_apitotalusage.htm)
- [Asynchronous Report Run Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_asyncreportrun.htm)
- [Aura Request Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_lightning_component.htm)
- [Bulk API Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_bulkapi.htm)
- [Bulk API 2.0 Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_bulkapi2.htm)
- [Change Set Operation Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_changesetoperation.htm)
- [Concurrent Long-Running Apex Limit Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_concurrentlongrunningapexlimit.htm)
- [Console Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_console.htm)
- [Content Distribution Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_contentdistribution.htm)
- [Content Document Link Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_contentdocument.htm)
- [Content Transfer Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_contenttransfer.htm)
- [Continuation Callout Summary Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_continuationcalloutsummary.htm)
- [CORS Violation Record Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_cors_violation.htm)
- [Dashboard Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_dashboard.htm)
- [Document Attachment Downloads Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_documentattach.htm)
- [External Cross-Org Callout Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_externalcrossorgcallout.htm)
- [External Custom Apex Callout Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_externalcustomapexcallout.htm)
- [External OData Callout Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_externalodatacallout.htm)
- [Flow Execution Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_flowexecution.htm)
- [Insecure External Assets Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_insecureexternalassets.htm)
- [Knowledge Article View Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_knowledgearticleview.htm)
- [Lightning Error Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_lightningerror.htm)
- [Lightning Interaction Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_lightninginteraction.htm)
- [Lightning Page View Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_lightningpageview.htm)
- [Lightning Performance Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_lightningperformance.htm)
- [Login Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_login.htm)
- [Login As Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_loginas.htm)
- [Logout Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_logout.htm)
- [Metadata API Operation Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_metadataapi.htm)
- [Multiblock Report Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_multiblock.htm)
- [Named Credential Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_namedcredential.htm)
- [One Commerce Usage Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_onecommerceusage.htm)
- [Package Install Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_packageinstall.htm)
- [Platform Encryption Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_platformencryption.htm)
- [Queued Execution Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_queuedexec.htm)
- [Report Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_report.htm)
- [Report Export Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_reportexport.htm)
- [REST API Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_restapi.htm)
- [Sandbox Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_sandbox.htm)
- [Search Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_search.htm)
- [Search Click Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_searchclick.htm)
- [Sites Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_sites.htm)
- [SOAP API Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_api.htm) – (added in v54.0)
- [Time-Based Workflow Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_timebasedworkflow.htm)
- [Transaction Security Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_transaction.htm)
- [URI Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_uri.htm)
- [Visualforce Request Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_visualforce.htm)
- [Wave Change Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_wavechange.htm)
- [Wave Download Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_wavedownload.htm)
- [Wave Interaction Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_waveinteraction.htm)
- [Wave Performance Event Type](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventlogfile_waveperformance.htm)
## **Security**
##


The security aspect of Salesforce involves a number of event types that are emitted when a piece of sensitive data is accessed by users in the system. This includes accessing or exporting reports, downloading or attaching data, logging into the system (as self or as a substitute user), etc.

Here are the event types that help analyze Salesforce security aspect and activities performed by users:

- **Content Distribution:** information about content distributions and deliveries to users
- **Content Document Link:** sharing information for content documents
- **Content Transfer:** information about content transfers, such as downloads, uploads, and previews. This information includes events performed on files and attachments to records
- **Document Attachment Downloads:** details of document and attachment downloads
- **Insecure External Assets:** information about external assets such as images or videos accessed by users over an insecure HTTP protocol. The event lists all your Salesforce pages that contain assets hosted insecurely on third-party sites that users loaded with a Chrome, Firefox, Microsoft Edge, or Safari browser. The INSECURE\_URI field contains the URI being used to load the asset insecurely
- **Login:** details about your org’s user login history
- **Login As:** details about what a Salesforce admin did while logged in as another user
- **Logout:** details of user logouts. Help in determining the login session duration
- **Named Credential:** information about Apex callouts that use named credentials as their endpoints. Use this event type to audit the installed managed packages that use named credentials. If you don’t recognize the package namespace in the named credential event log file, then you can investigate whether a security breach has occurred
- **Platform Encryption:** information about tenant secret and derived encryption key usage
- **Report:** information about what happened when a user ran a report. This event type includes all activity that's in the Report Export event type, plus more. For example, it has user activity for reports exported as both Formatted Report and Details Only output
- **Report Export:** details about reports that a user exported. For example, this event type captures when a user exports a report as Details Only output. But it doesn’t capture reports that users export as Formatted Report or XLSX Detail output. For that data, see the Report event type
- **Transaction Security:** details about policy execution
- **Wave Download:** downloads made from lens explorations and dashboard widgets in the Tableau CRM user interface. A Wave Download event type is captured when a user downloads images ( .png ), Microsoft® Excel® data ( .xls ), or comma-separated values ( .csv ) files

Our approach for security observability is to visualize the sensitive data to identify security breaches and anomalies. This information can be broken down by specific Salesforce organization, further down by specific user, location, login key, session key, and request. 


###
###
### Security Use Cases

Here are some use cases for analyzing the data from the security point of view.

#### Who viewed or exported what reports and when

- **Objective:** Get list of users who viewed reports, and find out when they ran these reports. Report events provide information about reports that were executed or exported, including the user information who ran the report (user id, organization, location), the session and login information of the user, and the report id, name, row count, URI, rendering type (web, email, excel, etc.). 
- **Pseudo Query:** FROM Report, ReportExport UNIQUE COUNT (attribute URI, attribute USER\_ID), LOGIN timestamp, LOGOUT timestamp GROUP BY attribute USER\_ID, attribute URI, attribute LOGIN\_KEY, attribute SESSION\_KEY
- **Observation:**
  - For any report or report export that was executed get the report URI's, USER\_ID who executed the report, the SESSION\_KEY, and login duration.
  - If you see any sensitive report URI get the details of all events using additional queries and drill down to get more context.
- **Additional queries:**
  - Count of each report URI:
    - FROM ReportExport SELECT COUNT(events) GROUP BY attribute REPORT\_DESCRIPTION 
    - FROM Report, ReportExport COUNT (events) GROUP BY URI
  - If necessary, run the query on all other event types to capture any other activity by the user/session
    - FROM (All Event Types)  SELECT URI WHERE attribute LOGIN\_KEY = <LOGIN\_KEY> GROUP BY (USER\_ID, LOGIN\_KEY)
  - Report duration details:
    - FROM Report SELECT min(RUN\_TIME/1000) as 'MIN Run Time', max(RUN\_TIME/1000) as 'MAX Run Time', average(RUN\_TIME/1000) as 'AVG Run Time', COUNT(events) GROUP BY ( EVENT\_TYPE, REPORT\_ID)
- **Why should I care:** View the users and their sessions id's over time to get a better understanding of:
  - Who viewed sensitive reports
  - When did they run the report
  - How often did they run the report
  - What was the report ID and/or URI
  - What data was included in the report
- **What to look for:** The main NRQL provides a complete list of users with their login sessions and reports they ran
  - You could also get the number of times users ran any of the reports based on the report URI, or in case of exports by report description
  - If you see a suspicious login session (LOGIN\_KEY) you could further run a NRQL filtered by that login session to understand what else the user did during the login session
  - Get details on the report min/max/avg duration of the report

#### Where data was accessed (Who is logging in and where does s/he access the data from)

- **Objective:** Get the location of the user (IP Address) where data was accessed. This could be any API, REST, SOAP, Bulk API, or other types of events
- **Pseudo Query:** FROM Login, LoginAs COUNT(events) GROUP BY attribute CLIENT\_IP, attribute USER\_ID
- **Observation:**
  - Start by checking users and their locations (IP address) where they logged into the platform
  - If you see unexpected (high) number of login sessions or lengthy sessions for a specific user or location run further queries below for additional details

- **Additional queries:**
  - Login durations for suspicious LOGIN\_KEY
    - FROM Login, Logout SELECT earliest(timestamp) as 'login time', latest(timestamp)as 'logout time' WHERE LOGIN\_KEY = <LOGIN\_KEY> GROUP BY ( EVENT\_TYPE, USER\_ID, LOGIN\_KEY
  - Session details (events) for specific LOGIN\_KEY
    - FROM Login, Logout, ApexCallout, ApexRestApi, ApexSoap, API, AsyncReportRun, LightningPageView SELECT events WHERE attribute LOGIN\_KEY = <LOGIN\_KEY>
    - FROM Login, Logout, ApexCallout, ApexRestApi, ApexSoap, API, AsyncReportRun, LightningPageView SELECT events WHERE attribute LOGIN\_KEY = <LOGIN\_KEY> GROUP BY (EVENT\_TYPE, CLIENT\_IP)
- **Why should I care:** Get details on what activities the user performed during a login session
  - When you see suspicious activity, one of the first things you need to know is who that user was. The other important piece of information is where they logged in from.
  - You could extend the query and group by the EVENT\_TYPE, and CLIENT\_IP metrics to see which events were performed by a specific user, and where they were executed from.
- **What to look for:** It is important to understand this information and check the user's history to see if his/her activities are normal and part of their day to day responsibilities, or is this an anomaly.

#### When a user changes data (a record) using the UI

- **Objective:** record changes to data by a user
- **Pseudo Query:** FROM LightningError, LightningInteraction, LightningPerformance COUNT(events) WHERE attribute UI\_EVENT\_SOURCE in ('SecurityError', 'create', 'delete', 'update') and attribute UI\_EVENT\_TYPE in ('crud') GROUP BY (EVENT\_TYPE, USER\_ID, LOGIN\_KEY, UI\_EVENT\_SOURCE, UI\_EVENT\_TYPE)
- **Observation:**
  - Get a list of all user logins who made changes to data during their login session
  - For any suspicious login session run further queries to get details of the events for a specific session
- **Additional queries:**
  - Get more details for a specific user or a suspicious activity
    - FROM LightningError, LightningInteraction, LightningPerformance SELECT \* WHERE attribute UI\_EVENT\_SOURCE in ('SecurityError', 'create', 'delete', 'update') and attribute UI\_EVENT\_TYPE in ('crud')   and attribute LOGIN\_KEY = <LOGIN\_KEY>
- **Why should I care:** Detect when a user creates, accesses, updates, or deletes a record within a sensitive table, or a user's action generates security errors..
- **What to look for:** Check if the query returns any events.
  - Look for USER\_ID, and the crud operation.
  - See if anything is out of norm,(e.g. particular user accesses the platform from an unexpected location or IP, and deletes records in an account or patent database

#### Who in your org is performing actions related to Platform Encryption administration

- **Objective:** Who in the organization accessed platform encryption data
- **Pseudo Query:** FROM PlatformEncryption SELECT COUNT(events)  GROUP BY  (attribute LOGIN\_KEY, attribute ACTION, attribute KEY\_TYPE, attribute METHOD)
- **Observation:**
  - For any returned row from PlatformEncryption event type check the encryption ACTION, KEY\_TYPE and METHOD attribute values to identify the type of tenant secrets and any changes in tenant secret Active state.
  - If a suspicious LOGIN\_KEY or activity is included in the returned data, drill down further into the actions performed  by that login key (and user)
- **Additional queries:**
  - FROM 'PlatformEncryption' SELECT \* WHERE LOGIN\_KEY = <LOGIN\_KEY> since 1 week ago limit max
  - FROM Login SELECT \* WHERE USER\_ID = <USER\_ID>
  - The first query would give you information such as the login id, login key, client's IP address, encryption action, session and request details, which enables you to get a clearer understanding as to what actions where taken, by whom, and where from.
  - The second query provides information on all sessions for a user,and user's email address.
- **Why should I care:** Platform Encryption event contains information about tenant secret and derived encryption key usage. 
  - Three key metrics (ACTION, KEY\_TYPE, and METHOD) provide information on where and for what action the tenant secret originated from, what type of tenant secret it is, and identify changes in tenant secret active state.
  - This event type provides information of how encrypted data was used and who used it.
- **What to look for:** Check the initial query result to see if there are any platform encryption events
  - Look for KEY\_TYPE to see what type of data was encrypted, decrypted, accessed by a user
  - Understand the change in tenant secret Active state. For example,how tenant secrets become active or inactive when they were exported.

#### Which admins logged in as another user and the actions the admin took as that user. 

- **Objective:** Login As events contain details about what a Salesforce admin did while logged in as another user.
- **Pseudo Query:** FROM LoginAs COUNT(events) GROUP BY (USER\_ID, LOGIN\_KEY)
- **Observation:**
  - Get a list of admin users with login session information who used this salesforce feature to login to the platform as another person
  - Refine the query to get all LOGIN\_KEYs in all relevant EVENT\_TYPEs for a specific user id
  - If you observe a suspicious activity, use the LOGIN\_KEY of the suspicious activity from the previous query results, and get a list of all events for a specific  LOGIN\_KEY to see the details only for the suspicious login session.
- **Additional queries:**
  - FROM URI, AuraRequest, LoginAs, LightningPerformance, LightningInteraction, PlatformEncryption, ApexExecution, ApexTrigger, API, Search, LightningPageView, FlowExecution, VisualforceRequest, Logout, QueuedExecution, ApexCallout, Login, NamedCredential, ExternalCrossOrgCallout  SELECT count(events) WHERE attribute USER\_ID =<USER\_ID> GROUP BY (attribute EVENT\_TYPE, attribute LOGIN\_KEY)
  - FROM URI, AuraRequest, LoginAs, LightningPerformance, LightningInteraction, PlatformEncryption, ApexExecution, ApexTrigger, API, Search, LightningPageView, FlowExecution, VisualforceRequest, Logout, QueuedExecution, ApexCallout, Login, NamedCredential, ExternalCrossOrgCallout  SELECT events WHERE attribute LOGIN\_KEY = <LOGIN\_KEY>
- **Why should I care:** See which of the administrators logged in as another user and what actions they performed.
- **What to look for:** Get more information about the impersonating administrator and his/her activity while logged in as another user.
  - First thing is to identify the administrator who impersonated another user. DELEGATED\_USER\_ID and DELEGATED\_USER\_NAME would give you the information about the impersonating administrator.
  - Then capture LOGIN\_SESSIONs returned by the initial query and check in all other event types to see what was performed by the impersonating administrator.

#### How long it takes for Lightning pages to load

- **Objective:** Find the latency of Lightning page loads.
- **Pseudo Query:** GROM LightningPageView SHOW HISTOGRAM(attribute DURATION, 30sec, 7 BUCKETS) GROUP BY (PAGE\_URL)
- **Observation:**
  - Find pages that violate the SLA. Create a heatmap of top 15 pages that take longer than others to load, break it down into 7 buckets from 0 to 30 seconds, and group by PAGE\_URL attribute .
  - Refine the query to get a trending of the page load over time. This will tell you whether the page always takes longer than normal to load, or is it under certain conditions that causes the page to take longer to load.
  - Drill down further by checking the offending page URLs by IP address, user, and login session, to see if you can find patterns in long page loads
- **Additional queries:**
  - FROM LightningPageView  SHOW average(DURATION)/count(event)  TIMESERIES 
  - Or if you need to check a specific page, refine your query as below:
    - FROM LightningPageView  SHOW average(DURATION)/count(event)  WHERE attribute PAGE\_URL = <PAGE\_URL>  TIMESERIES
- **Why should I care:** The heatmap is a convenient tool to identify top URLs that take longer than others to load. 
  - The cause of the slowness could have to do with a specific user,  the location where the user accesses the page, a specific user behavior, etc.
  - Heatmap will provide the information you need to pinpoint URL's that cause the SLA to be violated, and help fix the issue.
- **What to look for:** Start by running a query that generates a histogram of durations broken down into 7 buckets.
  - If you the histogram shows large durations in some areas, let's say 15 second duration, drill down to that area, and generate a heatmap by grouping the data based on PAGE\_URL attribute.
  - Pinpoint the offending page URLs that take longer to load.
  - Depending on the previous query result you can further run queries filtered by any of the following metrics to get more context and find trends that help resolve issues (USER\_ID, CLIENT\_IP, CLIENT\_GEO)
  - Try to find trends based on the following metrics
    - CONNECTION\_TYPE
    - DEVICE\_ID
    - DEVICE\_MODEL
    - DEVICE\_PLATFORM
    - OS\_NAME
    - PREV\_PAGE\_URL
