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
                // 1. UPDATED QUERY: Notice we are fetching layout and resolving the image URL here
                const query = encodeURIComponent(`*[_type == "homePage"][0]{
                    title,
                    homeSlots[]{
                        _type,
                        _key,
                        title,
                        layout,
                        linkUrl,
                        "imageUrl": bannerImage.asset->url
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
                    // 2. UPDATED UI: Using flexWrap to allow blocks to sit side-by-side
                    <Box display="flex" flexWrap="wrap" mx="-2">
                        {homepageData.homeSlots.map((slot) => {
                            
                            // Banner Block Rendering Logic
                            if (slot._type === 'bannerBlock') {
                                
                                // Calculate responsive width based on the layout choice from Sanity
                                let blockWidth = '100%'
                                if (slot.layout === 'half') {
                                    blockWidth = { base: '100%', md: '50%' } // Stack on mobile, side-by-side on desktop
                                } else if (slot.layout === 'quarter') {
                                    blockWidth = { base: '50%', md: '25%' } // 2 columns on mobile, 4 on desktop
                                }
                                
                                return (
                                    <Box key={slot._key} w={blockWidth} p={2}>
                                        {slot.imageUrl ? (
                                            <Box 
                                                as={slot.linkUrl ? 'a' : 'div'} 
                                                href={slot.linkUrl} 
                                                display="block"
                                                overflow="hidden"
                                                borderRadius="lg"
                                                transition="transform 0.2s"
                                                _hover={slot.linkUrl ? { transform: 'scale(1.01)' } : {}}
                                            >
                                                <img 
                                                    src={slot.imageUrl} 
                                                    alt={slot.title || 'Promotional Banner'} 
                                                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                                                />
                                            </Box>
                                        ) : (
                                            <Box p={6} bg="gray.100" borderRadius="md" border="1px dashed" borderColor="gray.300">
                                                <Text color="gray.500">Banner missing image payload.</Text>
                                            </Box>
                                        )}
                                    </Box>
                                )
                            }

                            // Fallback rendering for other slot types (dealsGrid, etc.)
                            return (
                                <Box key={slot._key} w="100%" p={2}>
                                    <Box p={6} bg="gray.50" borderRadius="md" borderWidth="1px">
                                        <Heading size="md" mb={2}>{slot.title || "Untitled Section"}</Heading>
                                        <Text fontSize="sm" color="gray.600">Component Type: <strong>{slot._type}</strong></Text>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home