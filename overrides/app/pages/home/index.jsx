/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
// Added SimpleGrid, Link, and Button back to the imports
import {Box, Container, Text, Heading, SimpleGrid, Link, Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

const Home = () => {
    const [homepageData, setHomepageData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomepageContent = async () => {
            try {
                // Expanded query to resolve the rollback references (offers[]->)
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
                        },
                        offers[]->{
                            _id,
                            title,
                            "slug": slug.current,
                            oldPrice,
                            newPrice,
                            badgeText,
                            ctaText,
                            "imageUrl": image.asset->url
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
                            
                            // 1. BANNER ROW LOGIC
                            if (slot._type === 'bannerRow' && slot.banners) {
                                const count = slot.banners.length
                                let itemWidth = '100%'
                                if (count === 2) itemWidth = { base: '100%', md: '50%' }
                                if (count === 3) itemWidth = { base: '100%', md: '33.333%' }
                                if (count === 4) itemWidth = { base: '50%', md: '25%' }

                                return (
                                    <Box key={slot._key} w="100%" mb={8}>
                                        {slot.title && (
                                            <Heading as="h2" fontSize="xl" mb={4} color="gray.800">{slot.title}</Heading>
                                        )}
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

                            // 2. DEALS GRID LOGIC
                            if (slot._type === 'dealsGrid' && slot.offers) {
                                return (
                                    <Box key={slot._key} w="100%" mb={8}>
                                        {slot.title && (
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
                                                {slot.title}
                                            </Heading>
                                        )}
                                        
                                        <SimpleGrid columns={{base: 1, md: 2, lg: 4}} spacing={6}>
                                            {slot.offers.map((item) => (
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
                                                                        top: 0, left: 0, width: '100%', height: '100%',
                                                                        objectFit: 'contain', padding: '16px'
                                                                    }} 
                                                                />
                                                            </Box>
                                                        )}

                                                        <Box p={5} display="flex" flexDirection="column" flex="1" justifyContent="space-between">
                                                            <Box>
                                                                {item.badgeText && (
                                                                    <Text 
                                                                        bg="#78be20" color="white" px={2.5} py={0.5} 
                                                                        borderRadius="full" fontSize="xs" fontWeight="bold" 
                                                                        width="fit-content" mb={3}
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
                                                                bg="#78be20" color="white" width="full" size="sm" fontWeight="bold"
                                                                _hover={{bg: '#6aa61b'}}
                                                            >
                                                                {item.ctaText || 'View Rollback'} ›
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Link>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )
                            }

                            // Fallback
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