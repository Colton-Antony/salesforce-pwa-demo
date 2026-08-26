/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const sites = require('./sites.js')
const {parseSettings, validateOtpTokenLength} = require('./utils.js')

module.exports = {
    app: {
        // Enable the store locator and shop the store feature.
        storeLocatorEnabled: true,
        // Enable the multi-ship feature.
        multishipEnabled: true,
        // Enable partial hydration capabilities via Island component
        partialHydrationEnabled: false,
        // MRT Data Store (opt-in): when true, SSR resolves prefs and serializes `__MRT_DATA_STORE__` in
        // `#mobify-data`; when false, that key is omitted. See `isMrtDataStoreEnabled` in pwa-kit-runtime.
        // Set `PWAKIT_MRT_DATA_STORE_ENABLED=true|false` to override without editing files.
        // Local dev without DynamoDB: `MRT_DATA_STORE_DEFAULTS` (JSON map of full DAL keys → objects),
        // optional `MRT_DATA_STORE_WARN_ON_MISSING=false` to silence missing-key warnings.
        mrtDataStore: {
            enabled: false
        },
        // Commerce shopping agent configuration for embedded messaging service
        // This enables an agentic shopping experience in the application
        // This property accepts either a JSON string or a plain JavaScript object.
        commerceAgent: parseSettings(process.env.COMMERCE_AGENT_SETTINGS) || {
            enabled: 'false',
            askAgentOnSearch: 'false',
            embeddedServiceName: '',
            embeddedServiceEndpoint: '',
            scriptSourceUrl: '',
            scrt2Url: '',
            salesforceOrgId: '',
            commerceOrgId: '',
            siteId: '',
            enableConversationContext: 'false',
            conversationContext: [],
            enableAgentFromHeader: 'false',
            enableAgentFromFloatingButton: 'false',
            enableAgentFromSearchSuggestions: 'false'
        },
        // Customize how your 'site' and 'locale' are displayed in the url.
        url: {
            // Determine where the siteRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            site: 'none',
            // Determine where the localeRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            locale: 'none',
            // This boolean value dictates whether or not default site or locale values are shown in the url. Defaults to: false
            showDefaults: false,
            // This boolean value dictates whether or not the base path, defined in ssrParameters.envBasePath,
            // is shown in shopper facing urls. Defaults to: false
            showBasePath: false,
            // This boolean value dictates whether the plus sign (+) is interpreted as space for query param string. Defaults to: false
            interpretPlusSignAsSpace: false
        },
        login: {
            // The length of the token for OTP authentication. Used by passwordless login and reset password.
            // If the env var `OTP_TOKEN_LENGTH` is set, it will override the config value. Valid values are 6 or 8. Defaults to: 8
            tokenLength: validateOtpTokenLength(process.env.OTP_TOKEN_LENGTH),
            passwordless: {
                // Enables or disables passwordless login for the site. Defaults to: false
                enabled: false,
                // The mode for passwordless login. Valid values include 'email|callback'. Defaults to: 'callback'
                mode: 'email',
                // The landing path for passwordless login
                landingPath: '/passwordless-login-landing'
            },
            social: {
                // Enables or disables social login for the site. Defaults to: false
                enabled: false,
                // The third-party identity providers supported by your app. The PWA Kit supports Google and Apple by default.
                idps: ['google', 'apple'],
                // The redirect URI used after a successful social login authentication.
                redirectURI: process.env.SOCIAL_LOGIN_REDIRECT_URI || '/social-callback'
            },
            resetPassword: {
                // The mode for reset password. Valid values include 'email|callback'. Defaults to: 'callback'
                mode: 'email',
                // The landing path for reset password
                landingPath: '/reset-password-landing'
            }
        },
        // The default site for your app. This value will be used when a siteRef could not be determined from the url
        defaultSite: 'RefArch',
        // The sites for your app, which is imported from sites.js
        sites,
        // Commerce api config
        commerceAPI: {
            proxyPath: '/mobify/proxy/api',
            parameters: {
                clientId: process.env.COMMERCE_CLIENT_ID || '44cfcf31-d64d-4227-9cce-1d9b0716c321',
                organizationId: process.env.COMMERCE_ORG_ID || 'f_ecom_aaia_prd',
                shortCode: process.env.COMMERCE_SHORT_CODE || 'xfdy2axw',
                siteId: process.env.COMMERCE_SITE_ID || 'RefArch'
            }
        },
        // Einstein api config
        einsteinAPI: {
            host: 'https://api.cquotient.com',
            einsteinId: '1ea06c6e-c936-4324-bcf0-fada93f83bb1',
            siteId: 'aaij-MobileFirst',
            isProduction: false
        },
        // Datacloud api config
        dataCloudAPI: {
            appSourceId: '7ae070a6-f4ec-4def-a383-d9cacc3f20a1',
            tenantId: 'g82wgnrvm-ywk9dggrrw8mtggy.pc-rnd'
        },
        oneClickCheckout: {
            enabled: false
        },
        pages: {
            cart: {
                groupBonusProductsWithQualifyingProduct: true
            },
            maintenancePage: {
                sharedMaintenancePage: true,
                cdnUrl: 'https://prd.cmp.cdn.commercecloud.salesforce.com',
                forwardedHost: ''
            }
        },
        sfPayments: {
            enabled: false,
            sdkUrl: '',
            metadataUrl: ''
        },
        googleCloudAPI: {
            apiKey: process.env.GOOGLE_CLOUD_API_KEY
        }
    },
    // Content Security Policy configuration to allow Sanity API and asset domains
    cspConfig: {
        scriptSrc: [
            'asda-promotions.co.uk',
            'api.bazaarvoice.com',
            '*.criteo.net',
            'migroceries.asda.com',
            '*.sanity.io'
        ],
        connectSrc: [
            'api.bazaarvoice.com',
            'api2.asda.com',
            'ghs-mm.asda.com',
            '*.sanity.io'
        ],
        imgSrc: [
            'd3dh5c7rwzliwm.cloudfront.net',
            'd32106rlhdcogo.cloudfront.net',
            'dgf0rw7orw6vf.cloudfront.net',
            '*.criteo.com',
            'cdn.sanity.io',
            '*.sanity.io',
            'https://cdn.sanity.io',
            'https://*.sanity.io'
        ],
        isCspEnabled: true
    },
    // This list contains server-side only libraries that you don't want to be compiled by webpack
    externals: [],
    // Page not found url for your app
    pageNotFoundURL: '/page-not-found',
    // Enables or disables building the files necessary for server-side rendering.
    ssrEnabled: true,
    // This list determines which files are available exclusively to the server-side rendering system
    ssrOnly: ['ssr.js', 'ssr.js.map', 'node_modules/**/*.*'],
    // This list determines which files are available to the server-side rendering system
    ssrShared: [
        'static/ico/favicon.ico',
        'static/robots.txt',
        '**/*.js',
        '**/*.js.map',
        '**/*.json'
    ],
    // Additional parameters that configure Express app behavior.
    ssrParameters: {
        ssrFunctionNodeVersion: '24.x',
        enableHttpOnlySessionCookies: false,
        proxyConfigs: [
            {
                host: 'xfdy2axw.api.commercecloud.salesforce.com',
                path: 'api'
            },
            {
                host: 'production-sitegenesis-dw.demandware.net',
                path: 'ocapi'
            },
            {
                host: 'ogtlyxao.api.sanity.io', // <--- Add this line to proxy Sanity securely
                path: 'sanity-api'
            }
        ]
    }
}

