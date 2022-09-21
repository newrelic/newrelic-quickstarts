# Customer experience bottom of the funnel analysis instructions 
![Customer experience quality foundation screen shot](../dashboards/om-bofu-analysis/om-bofu-analysis.png)

/dashboards/om-bofu-analysis/om-bofu-analysis.png

## Install the bottom of the funnel analysis dashboard
Follow the quickstart menu prompts to install the dashboard

## Configure the bottom of the funnel analysis dashboard
The default dashboard shows you:
- Performance for all desktop web pages on the BOFU - Desktop tab 
- Performance for all non desktop (mobile, tablet, unspecified) on the BOFU - Mobile and other tab 

### Edit the dashboard name
It helps to add the user journey name to the dashboard name for clarity and for ease of search. If you decide to measure multiple user journeys across multiple pages in a single dashboard, you can rename the dashboard then.

### Edit dashboard filters
Before proceding, make sure you are clear where your bottom of the funnel begins and ends. Use the [guide](https://docs.newrelic.com/docs/new-relic-solutions/observability-maturity/customer-experience/bottom-funnel-analysis-customer-journey-guide) in docs to help you decide. 
  
Expect queries to be the same on both tabs with the exception of device type. Mobile and tablet conversion rates are often half of what you see on desktop. Pulling this data out in its own dashboard page will help you identify opportunities to narrow the gap. 

The only chart that doesn't filter on device type is the one that checks the Synthetics monitor. Displaying on the mobile and other device page can be helpful for seeing everything in context but is optional. 
 
### Edit the conversion Funnel 
Update the Funnel query for your bottom of the funnel process
The structure of the funnel query is as follows: <br>
>FROM DATA_TYPE <br>
  SELECT funnel(COMMON_ATTRIBUTE, WHERE .. ACTION_A, .., WHERE .. ACTION_N) <br>
  SINCE 1 WEEK AGO <br>

COMMON_ATTRIBUTE - usually set to session.  You can capture conversions that happen over multiple sessions, by adding [custom attributes](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/setcustomattribute-browser-agent-api/), like customerId, to Browser.  

WHERE … ACTION - filters for the PageViews or AjaxRequests relevant to that step in the user’s journey.  

__Examples__  <br>
The following tracks conversions on the basis that a user converts in a single browser session (__PageViews__)
>FROM PageView SELECT funnel(session_id, <br>
      WHERE appName = ‘CustomerPortal’ and pageUrl like ‘%Checkout%’ AS ‘Begin Checkout’, <br>
      WHERE appName = ‘CustomerPortal’ and pageUrl like ‘%OrderConfirmed%’ AS ‘Order Confirmed’)<br>

The following tracks conversions on the basis that a user is authenticated by the time they begin checkout (__PageViews__)
>FROM PageView SELECT funnel(customerId, <br>
      WHERE appName = ‘CustomerPortal’ and pageUrl like ‘%Checkout%’ AS ‘Begin Checkout’, <br>
      WHERE appName = ‘CustomerPortal’ and pageUrl like ‘%OrderConfirmed%’ AS ‘Order Confirmed’)<br>

The same query as above but for a single page application (__AjaxRequests__)
>FROM AjaxRequest SELECT funnel(customerId, <br>
      WHERE appName = ‘CustomerPortal’ and requestUrl like ‘%Checkout%’ and httpResponseCode >= 200 and httpResponseCode < 300 AS ‘Begin Checkout’, <br>
      WHERE appName = ‘CustomerPortal’ and requestUrl like ‘%OrderConfirmed%’ and httpResponseCode >= 200 and httpResponseCode < 300 AS ‘Order Confirmed’)<br>

The funnel query pulls from a single data type. You won’t be able to combine PageViews and AjaxRequests in the same funnel.  If your bottom of the funnel flow includes a mix of PageViews and AjaxRequests you can capture the overall conversion rate by focusing on the PageViews at the start and the end.

### Synthetics Check
>FROM SyntheticCheck SELECT percentage(count(*),WHERE result = 'FAILED' ) AS 'Failed Checks' where monitorName = BOTF_MONITOR_NAME SINCE 1 WEEK AGO 

Change BOTF_MONITOR_NAME to match the synthetics monitor that validates the bottom of the funnel. If users have the option of signing up for an account or logging in during the bottom of the funnel, make sure you have synthetics checks that cover the different scenarios. In other words, have synthetics checks that validate complete flows where the user logs in or signs up at the beginning of user journey and have synthetics checks that validate scenarios where a user logs in or signs up at the end of the journey.  

### Revenue at Risk - Latency
>SELECT count(*) * CONVERSION_VALUE AS USD FROM PageView, AjaxRequest WHERE (REVENUE_AT_RISK_LATENCY_FILTER) AND  (timeToSettle > 2.0 OR backendDuration > 0.5) SINCE 1 WEEK AGO

If *revenue at risk* doesn't apply to your user journey you can retitle this to *cost risk* or *business risk*. Every user journey conversion has a value to the business. If you are not sure of the value of a conversion you can usually find industry average conversion values for different types of user journeys. If you cannot find someone in your organization who knows the answer you can set an arbitrary value until you get clarity.

REVENUE_AT_RISK_LATENCY_FILTER - You can filter both related pages and Ajax Requests using pageUrl.  The [pageUrl value in an AjaxRequest](https://docs.newrelic.com/attribute-dictionary/?dataSource=Browser+agent&event=AjaxRequest&attributeSearch=pageUrl) reflects the page the user was on when they initiated the request.  

CONVERSION_VALUE - set this to what your organization considers the average value of a conversion. Every user journey conversion has a value to the business. If you are not sure of the value of a conversion you can usually find industry average conversion values for different types of user journeys. If you cannot find someone in your organization who knows the answer you can set an arbitrary value until you get clarity. For ecommerce journeys you can use custom attributes to change the query to be more specific and use the value of what the end user is about to purchase.   

For example, instead of <br>
>SELECT count(*) * 6.0 AS USD FROM PageView, AjaxRequest WHERE (pageUrl LIKE '%checkout%' or pageUrl LIKE '%confirmOrder%') AND (timeToSettle ..

where 6.0 is the average value of a conversion

You could use
>SELECT sum(cartValue) AS USD FROM PageView, AjaxRequest WHERE (pageUrl LIKE '%checkout%' or pageUrl LIKE '%confirmOrder%') AND (timeToSettle ..

provided that you have captured the cart value using [setCustomAttribute](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/setcustomattribute-browser-agent-api/) or [setAttribute](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/setattribute-browser-spa-api/).

One thing to be aware of is that in this example, the same cart value could be added multiple times if the same user experiences multiple interactions with slowness or errors.

### Revenue at Risk - Errors

>FROM AjaxRequest SELECT count(*) * CONVERSION_VALUE AS USD WHERE httpResponseCode >= 300 AND (REVENUE_AT_RISK_ERRORS_FILTER) SINCE 1 WEEK AGO 

REVENUE_AT_RISK_ERRORS_FILTER - This is likely to be the same as REVENUE_AT_RISK_LATENCY_FILTER

CONVERSION_VALUE - See the explanation under [Revenue at Risk - Latency](README_Botf_summary.md#revenue-at-risk---latency)

### Page load and Ajax performance Tiles

The charts below the revenue at risk charts show the performance of each step in the bottom of the funnel. The default is very simple - a page load followed by an ajax request followed by a page load. This may be different for your flow - it could happen as a series of page loads, a series of ajax calls, or a mix of the two. Use the examples to fit your user journey.
