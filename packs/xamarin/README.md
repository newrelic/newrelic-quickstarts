# New Relic Mobile Agent - Xamarin Bindings

https://github.com/newrelic-experimental/newrelic-xamarin-binding

Xamarin binding for New Relic mobile agents - iOS https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios and Android SDK's https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android

## Installation

The Xamarin binding depends on the mobile SDK's. There is a Makefile under ios and android directories that downloads the SDK's and builds the binding for iOS and Android.

## Building and Getting Started for iOS and Android

### iOS:
There is a Makefile for iOS that you can use (make) to build the NewRelicXamarin.iOS.dll that can be included in your Xamarin project. `make` will download a specific version of iOS SDK for New Relic Mobile, unzip the agent zip file and use it to build NewRelicXamarin.iOS.dll.

After the build is succesfull you need to add the `NewRelicXamarin.iOS.dll` file as a reference to your project. Make sure you add it in the iOS section.

**Alternatively**, you could use this project inside the Xamarian project and reference it.

1. The Makefile uses Microsoft's build tool, msbuild (as xbuild is getting deprecated and replaced by msbuild). You can replace it with xbuild (Xamarin's build tool) if you are on older version of Xamarin.

If you are still using xbuild, replace
MONOXBUILD=/Library/Frameworks/Mono.framework/Commands/msbuild
with
MONOXBUILD=/Library/Frameworks/Mono.framework/Commands/xbuild

2. Add the Newrelic license key and start up command in your Xamarin code after you reference this library.

Open `AppDelegate.cs` and add the following to the top of the file:

```
using NewRelicXamarin;
```

Next, inside the class AppDelegate you need to add the following to the `FinishedLaunching` function:

```
NRLogger.SetLogLevels((uint)NRLogLevels.All);
NewRelicXamarin.NewRelic.StartWithApplicationToken("new_relic_license_key");
```

Make sure you replace the `new_relic_license_key` with your own. You can find your own license key by creating a Mobile app within the New Relic UI. Go to `Mobile` > `Add a new app` > Choose your platform > Give your App a name > Your license key is now visible lower down the page.

3. Launch the application and check the New Relic UI for instrumentation data. It can take a couple of minutes before it's visible.

### Android:

1. There is a Makefile for Android that you can use (make) to build the NewRelicXamarin.Android.dll that can be included in your Xamarin project. `make` will:

        a. Download a specific version of Android SDK for New Relic Mobile

        b. Unzip the agent zip file and use it to build NewRelicXamarin.Android.dll

After the build is succesfull you need to add the `NewRelicXamarin.Android.dll` file as a reference to your project. Make sure you add it in the Android section.

2. Add the Newrelic license key and start up command in your Xamarin code after you reference this library.

In the MainActivity class or equivalent

```
var config = new NewRelicXamarin.Android.AgentConfiguration();
//config.ReportCrashes = true;
//config.ReportHandledExceptions = true;
//config.ReportHandledExceptions = true;
//var log = new NewRelicXamarin.Android.Logging.DefaultAgentLog();
config.ApplicationToken = "new_relic_license_key";
NewRelicXamarin.Android.AndroidAgentImpl.Init(this, config);
NewRelicXamarin.Android.Agent.Start();
```

Make sure you replace the `new_relic_license_key` with your own. You can find your own license key by creating a Mobile app within the New Relic UI. Go to `Mobile` > `Add a new app` > Choose your platform > Give your App a name > Your license key is now visible lower down the page.

3. Launch the application and check the New Relic UI for instrumentation data. It can take a couple of minutes before it's visible.