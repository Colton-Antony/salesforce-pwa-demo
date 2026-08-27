/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import loadable from '@loadable/component'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// Components
import {Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'
import {configureRoutes} from '@salesforce/retail-react-app/app/utils/routes-utils'
import {routes as _routes} from '@salesforce/retail-react-app/app/routes'

const fallback = <Skeleton height="75vh" width="100%" />

// Loadable components for code-splitting
const Home = loadable(() => import('./pages/home'), {fallback})
const MyNewRoute = loadable(() => import('./pages/my-new-route'))
const SanityProduct = loadable(() => import('./pages/sanity-product'), {fallback})
const CartPage = loadable(() => import('./pages/cart'), {fallback})
const CheckoutPage = loadable(() => import('./pages/checkout'), {fallback})
const CategoryPage = loadable(() => import('./pages/category'), {fallback})

const routes = [
    {
        path: '/category/:slug',
        component: CategoryPage,
        exact: true
    },
    {
        path: '/rollback/:slug',
        component: SanityProduct,
        exact: true
    },
    {
        path: '/cart',
        component: CartPage,
        exact: true
    },
    {
        path: '/checkout',
        component: CheckoutPage,
        exact: true
    },
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/my-new-route',
        component: MyNewRoute
    },
    ..._routes
]

export default () => {
    const config = getConfig()
    return configureRoutes(routes, config, {
        ignoredRoutes: ['/callback', '*']
    })
}