/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {Box, Button, Stack, Link, Text, Heading, SimpleGrid} from '@salesforce/retail-react-app/app/components/shared/ui'

// Seo Component
import Seo from '@salesforce/retail-react-app/app/components/seo'

const Home = () => {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRollbacks = async () => {
            try {
                const query = encodeURIComponent(`*[_type == "rollbackOffer"]{
                    _id,
                    title,
                    "slug": slug.current,
                    "imageUrl": mainImage.asset->url,
                    oldPrice,
                    newPrice,
                    badgeText,
                    ctaText
                }`)
                
                // Fetch securely through the PWA Kit server proxy (Bypasses CSP & CORS)
                const res = await fetch(`/mobify/proxy/sanity-api/v2024-01-01/data/query/production?query=${query}`)
                const json = await res.json()
                setOffers(json.result || [])
            } catch (err) {
                console.error("Error fetching homepage rollbacks from Sanity proxy:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchRollbacks()
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page" bg="white" minH="100vh">
            <Seo
                title="Online Food Shopping - ASDA Groceries"
                description="Shop online at ASDA Groceries. Rollbacks powered by Sanity CMS."
            />

            {/* Asda Hero Banner Area */}
            <Box bg="#78be20" color="white" py={12} px={4} textAlign="center">
                <Heading size="2xl" mb={3} fontWeight="black">Rollback & Save</Heading>
                <Text fontSize="lg">The same great prices, managed dynamically via Headless CMS.</Text>
            </Box>

            {/* Live Sanity Rollbacks Grid */}
            <Box maxW="1432px" mx="auto" px={4} py={8}>
                <Heading 
                    as="h2" 
                    fontSize={{base: '20px', md: '24px'}} 
                    fontWeight="600" 
                    color="gray.800" 
                    mb={6}
                    borderBottom="2px solid #78be20"
                    pb={2}
                    width="fit-content"
                >
                    Live Asda Rollbacks (Sanity CMS)
                </Heading>

                {loading ? (
                    <Text color="gray.500" py={4}>Loading live rollbacks from Sanity...</Text>
                ) : offers.length === 0 ? (
                    <Text color="gray.500" py={4}>No rollbacks found. Add some in your Sanity Studio dashboard!</Text>
                ) : (
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={6}>
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
                                    borderColor="gray.200" 
                                    borderRadius="8px" 
                                    overflow="hidden"
                                    height="100%"
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    boxShadow="sm"
                                    transition="all 0.2s"
                                    _hover={{shadow: 'md', borderColor: '#78be20'}}
                                >
                                    {item.imageUrl && (
                                        <Box position="relative" w="full" pb="56.25%" bg="gray.50">
                                            <img 
                                                src={item.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                                                alt={item.title} 
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    padding: '16px'
                                                }} 
                                            />
                                        </Box>
                                    )}

                                    <Box p={5} display="flex" flexDirection="column" flex="1" justifyContent="space-between">
                                        <Box>
                                            {item.badgeText && (
                                                <Text 
                                                    bg="#78be20" 
                                                    color="white" 
                                                    px={2.5} 
                                                    py={0.5} 
                                                    borderRadius="full" 
                                                    fontSize="xs" 
                                                    fontWeight="bold" 
                                                    width="fit-content" 
                                                    mb={3}
                                                >
                                                    {item.badgeText}
                                                </Text>
                                            )}
                                            <Heading size="sm" color="gray.900" mb={3} noOfLines={2}>
                                                {item.title}
                                            </Heading>
                                            <Box display="flex" alignItems="baseline" gap={2} mb={4}>
                                                <Text fontSize="2xl" fontWeight="black" color="#00a1de">
                                                    £{Number(item.newPrice).toFixed(2)}
                                                </Text>
                                                <Text fontSize="sm" textDecoration="line-through" color="gray.500">
                                                    Was £{Number(item.oldPrice).toFixed(2)}
                                                </Text>
                                            </Box>
                                        </Box>

                                        <Button 
                                            bg="#78be20" 
                                            color="white" 
                                            width="full" 
                                            size="sm" 
                                            fontWeight="bold"
                                            _hover={{bg: '#6aa61b'}}
                                        >
                                            {item.ctaText || 'View Rollback'} ›
                                        </Button>
                                    </Box>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home