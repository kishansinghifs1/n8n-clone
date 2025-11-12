// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://171299b5f73f09458e470306a075fc1c@o4510347531911168.ingest.de.sentry.io/4510347540562000",

  integrations : [
      Sentry.vercelAIIntegration({
        recordInputs : true,
        recordOutputs : true,
      }),
      Sentry.consoleLoggingIntegration({levels : ["log", "warn", "error"]}),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
