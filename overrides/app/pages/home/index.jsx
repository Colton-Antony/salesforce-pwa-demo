/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {useIntl, FormattedMessage} from 'react-intl'
import {useLocation} from 'react-router-dom'

// Components
import {Box, Button, Stack, Link, Text, Heading, SimpleGrid} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Hero from '@salesforce/retail-react-app/app/components/hero'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import Section from '@salesforce/retail-react-app/app/components/section'
import ProductScroller from '@salesforce/retail-react-app/app/components/product-scroller'

// Others
import {getAssetUrl} from '@salesforce/pwa-kit-react-sdk/ssr/universal/utils'

// Hooks
import useEinstein from '@salesforce/retail-react-app/app/hooks/use-einstein'
import {createClient} from '@sanity/client'

// Constants
import {
    CUSTOM_HOME_TITLE,
    HOME_SHOP_PRODUCTS_CATEGORY_ID,
    HOME_SHOP_PRODUCTS_LIMIT,
    MAX_CACHE_AGE,
    STALE_WHILE_REVALIDATE
} from '../../constants'

import {useServerContext} from '@salesforce/pwa-kit-react-sdk/ssr/universal/hooks'
import {useProductSearch} from '@salesforce/commerce-sdk-react'

const client = createClient({
    projectId: 'ogtlyxao',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true
})

const Home = () => {
    const intl = useIntl()
    const einstein = useEinstein()
    const {pathname} = useLocation()

    // State to hold Sanity promotions
    const [offers, setOffers] = useState([])

    useEffect(() => {
        const fetchRollbacks = async () => {
            try {
                const query = `*[_type == "rollbackOffer"]{
                    _id,
                    title,
                    "slug": slug.current,
                    "imageUrl": mainImage.asset->url,
                    oldPrice,
                    newPrice,
                    badgeText,
                    ctaText
                }`
                const data = await client.fetch(query)
                setOffers(data || [])
            } catch (err) {
                console.error("Error fetching homepage rollbacks from Sanity:", err)
            }
        }
        fetchRollbacks()
    }, [])

    const {res} = useServerContext()
    if (res) {
        res.set(
            'Cache-Control',
            `s-maxage=${MAX_CACHE_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`
        )
    }

    const {data: productSearchResult, isLoading} = useProductSearch({
        parameters: {
            refine: [`cgid=${HOME_SHOP_PRODUCTS_CATEGORY_ID}`, 'htype=master'],
            expand: ['promotions', 'variations', 'prices', 'images', 'custom_properties'],
            perPricebook: true,
            allVariationProperties: true,
            limit: HOME_SHOP_PRODUCTS_LIMIT
        }
    })

    useEffect(() => {
        einstein.sendViewPage(pathname)
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page" bg="white">
            <Seo
                title="Online Food Shopping - ASDA Groceries"
                description="Shop online at ASDA Groceries. The same great prices as in store, delivered to your door or click and collect from store."
            />

            <Hero
                title={CUSTOM_HOME_TITLE}
                img={{
                    src: getAssetUrl('static/img/hero.png'),
                    alt: 'Asda Hero Banner'
                }}
            />

            {/* Asda-Styled Dynamic Sanity Grid Layout */}
            <Box maxW="1432px" mx="auto" px={4} py={8}>
                <Heading 
                    as="h2" 
                    fontSize={{base: '20px', md: '24px'}} 
                    fontWeight="600" 
                    color="black" 
                    mb={6}
                >
                    Live Asda Rollbacks & Offers
                </Heading>

                {offers.length === 0 ? (
                    <Text color="gray.500" py={4}>Loading live rollbacks from Sanity CMS...</Text>
                ) : (
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={4}>
                        {offers.map((item) => (
                            <Link 
                                key={item._id} 
                                href={`/rollback/${item.slug}`} 
                                _hover={{textDecoration: 'none'}}
                                display="block"
                                height="100%"
                            >
                                <Box 
                                    bg="white" 
                                    border="1px solid" 
                                    borderColor="gray.300" 
                                    borderRadius="8px" 
                                    overflow="hidden"
                                    height="100%"
                                    display="flex"
                                    flexDirection="column"
                                    transition="all 0.2s"
                                    _hover={{shadow: 'md', borderColor: 'gray.500'}}
                                >
                                    {/* Image Wrapper matching Asda aspect ratios */}
                                    {item.imageUrl && (
                                        <Box position="relative" w="full" pb="56.25%" bg="gray.100">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.title} 
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }} 
                                            />
                                        </Box>
                                    )}

                                    {/* Content Container */}
                                    <Box p={4} display="flex" flexDirection="column" flex="1" justifyContent="space-between">
                                        <Box>
                                            {item.badgeText && (
                                                <Text 
                                                    bg="#78be20" 
                                                    color="white" 
                                                    px={2} 
                                                    py={0.5} 
                                                    borderRadius="full" 
                                                    fontSize="xs" 
                                                    fontWeight="bold" 
                                                    width="fit-content" 
                                                    mb={2}
                                                >
                                                    {item.badgeText}
                                                </Text>
                                            )}
                                            <Text fontSize="18px" fontWeight="600" color="gray.700" mb={2} noOfLines={2}>
                                                {item.title} ›
                                            </Text>
                                            <Box display="flex" alignItems="baseline" gap={2} mb={3}>
                                                <Text fontSize="22px" fontWeight="black" color="#00a1de">
                                                    £{Number(item.newPrice).toFixed(2)}
                                                </Text>
                                                <Text fontSize="sm" textDecoration="line-through" color="gray.500">
                                                    Was £{Number(item.oldPrice).toFixed(2)}
                                                </Text>
                                            </Box>
                                        </Box>

                                        <Text fontSize="sm" fontWeight="bold" color="blue.500" mt={2}>
                                            {item.ctaText || 'Shop now'} ›
                                        </Text>
                                    </Box>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                )}
            </Box>

            {/* Standard Catalog Products Section */}
            {productSearchResult && (
                <Section
                    padding={4}
                    paddingTop={16}
                    title={intl.formatMessage({
                        defaultMessage: 'Shop Products',
                        id: 'home.heading.shop_products'
                    })}
                >
                    <Stack pt={8} spacing={16}>
                        <ProductScroller
                            products={productSearchResult?.hits}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Section>
            )}
        </Box>
    )
}

Home.getTemplateName = () => 'home'

exports = Home
export default Home