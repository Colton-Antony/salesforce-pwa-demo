/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {Box, Container, Text, Heading} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

const Home = () => {
    const [homepageData, setHomepageData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomepageContent = async () => {
            try {
                // 1. UPDATED QUERY: Fetch the new bannerRow and its nested banners array
                const query = encodeURIComponent(`*[_type == "homePage"][0]{
                    title,
                    homeSlots[]{
                        _type,
                        _key,
                        title,
                        banners[]{
                            _key,
                            title,
                            linkUrl,
                            "imageUrl": bannerImage.asset->url
                        }
                    }
                }`)

                const res = await fetch(`/mobify/proxy/sanity-api/v2023-05-03/data/query/production?query=${query}`)
                const data = await res.json()
                
                if (data.result) {
                    setHomepageData(data.result)
                }
            } catch (err) {
                console.error('Error fetching homepage slots from Sanity:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchHomepageContent()
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page" bg="white" minH="100vh">
            <Seo
                title={homepageData?.title || "Online Food Shopping - ASDA Groceries"}
                description="Shop online at ASDA Groceries. Powered by Sanity CMS."
            />

            <Container maxW="1432px" mx="auto" px={4} py={8}>
                <Heading as="h1" fontSize={{base: '24px', md: '28px'}} fontWeight="bold" color="gray.800" mb={6}>
                    {homepageData?.title || "Home"}
                </Heading>

                {loading ? (
                    <Text color="gray.500" py={4}>Loading live homepage from Sanity...</Text>
                ) : !homepageData?.homeSlots?.length ? (
                    <Text color="gray.500" py={4}>No homepage content found.</Text>
                ) : (
                    <Box>
                        {homepageData.homeSlots.map((slot) => {
                            
                            // 2. NEW BANNER ROW LOGIC: Auto-calculating widths
                            if (slot._type === 'bannerRow' && slot.banners) {
                                
                                const count = slot.banners.length
                                let itemWidth = '100%' // Default for 1 banner
                                if (count === 2) itemWidth = { base: '100%', md: '50%' } // 50% for 2 banners
                                if (count === 3) itemWidth = { base: '100%', md: '33.333%' } // 33% for 3 banners
                                if (count === 4) itemWidth = { base: '50%', md: '25%' } // 25% for 4 banners

                                return (
                                    <Box key={slot._key} w="100%" mb={6}>
                                        <Box display="flex" flexWrap="wrap" mx="-2">
                                            {slot.banners.map((banner, index) => (
                                                <Box key={banner._key || index} w={itemWidth} p={2}>
                                                    {banner.imageUrl ? (
                                                        <Box 
                                                            as={banner.linkUrl ? 'a' : 'div'} 
                                                            href={banner.linkUrl} 
                                                            display="block"
                                                            overflow="hidden"
                                                            borderRadius="lg"
                                                            transition="transform 0.2s"
                                                            _hover={banner.linkUrl ? { transform: 'scale(1.01)' } : {}}
                                                        >
                                                            <img 
                                                                // 3. THE FIX: Route the Sanity CDN URL through the local proxy
                                                                src={banner.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                                                                alt={banner.title || 'Promotional Banner'} 
                                                                style={{ width: '100%', height: 'auto', display: 'block' }} 
                                                            />
                                                        </Box>
                                                    ) : null}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                            // Fallback for empty rows or other components
                            return null;
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home