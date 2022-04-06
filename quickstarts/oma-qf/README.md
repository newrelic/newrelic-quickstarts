# Customer experience quality foundation instructions
![Customer experience quality foundation screen shot](dashboards/om-quality-foundation.json)

## Install the customer experience dashboard
Follow the quickstart menu prompts to install the dashboard

## Configure the customer experience dashboard
The default dashboard shows you:
- Performance for all web pages for all web apps on the "All Pages" tab
- Performance for pages with _login_ in the URL on the "Login" tab

### Edit the dashboard name
If you have more than one web application, you will want to implement a quality foundation dashboard for each one. Dashboard names need to be unique. To rename your dashboard, open the dashboard and click on the pencil in the top right hand corner of the screen. You will see a gear icon that allows you to rename the dashboard. Rename it to _<Your application>  - Quality Foundation_ or similar. Make sure to save your changes.

### Edit dashboard filters
_Availability charts - All pages_ Update these charts to capture the results of synthetic monitors that check the your site's accessibility for both anonymous and authenticated users.
_All pages load times, AJAX performance, and Javascript errors_ Assuming you have multiple web applications, you need to update your charts to filter by the application name. For each query widget, select the 3 dots in the top right corner of the widget. Choose edit. Update _WHERE appName LIKE '%'_ portion of the query to _WHERE appName LIKE '<Your application>'_. Re-run the query and save your changes.
_Login page load times, AJAX performance, and Javascript errors_ Follow the above instructions to update the appName.
_Login changes, other UI segements_ Many sites have a login page with _login_ in the page URL. This is meant to provide a useful example of what your dashboard pages should look like.  Some things you can do: 
* Change the queries on this page and the page name to match tracking for your login function. Update the page name. (Open dashboard->edit->Click on the Login tab->Rename page) 
* Duplicate the page (Open dashboard->edit->Click on the Login tab->Duplicate page) and update the page name and queries to match the segment you want to track.  For more information on how to segment web performance data, see the [Quality foundation guide](https://docs.newrelic.com/docs/new-relic-solutions/observability-maturity/customer-experience/quality-foundation-implementation-guide#understand-how-you-will-segment-your-data).
