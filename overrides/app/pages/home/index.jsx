/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState, useRef} from 'react'
import {Box, Container, Text, Heading, Link, Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

// Sub-component to handle the left/right scroll arrows for the Deals Grid
const DealsCarouselBlock = ({ slot }) => {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <Box w="100%" mb={12}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
                {slot.title && (
                    <Heading as="h2" fontSize={{base: '20px', md: '24px'}} fontWeight="600" color="gray.800" borderBottom="2px solid #78be20" pb={2}>
                        {slot.title}
                    </Heading>
                )}
                
                <Box display={{base: 'none', md: 'flex'}} gap={2}>
                    <Button onClick={() => scroll('left')} borderRadius="full" minW="40px" h="40px" bg="gray.100" _hover={{bg: 'gray.200'}} fontSize="xl" pb={1}>‹</Button>
                    <Button onClick={() => scroll('right')} borderRadius="full" minW="40px" h="40px" bg="gray.100" _hover={{bg: 'gray.200'}} fontSize="xl" pb={1}>›</Button>
                </Box>
            </Box>
            
            <Box ref={scrollRef} display="flex" overflowX="auto" scrollSnapType="x mandatory" gap={6} pb={4} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                {slot.offers.map((item) => {
                    const displayPrice = item.newPrice || item.price || item.currentPrice || 0
                    const displayImage = item.imageUrl || item.mainImageUrl || item.productImageUrl
                    
                    return (
                        <Box key={item._id} minW={{ base: '80%', md: '45%', lg: '23%' }} scrollSnapAlign="start" flexShrink={0}>
                            <Link href={`/rollback/${item.slug}`} _hover={{textDecoration: 'none'}} display="block" height="100%">
                                <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="8px" overflow="hidden" height="100%" display="flex" flexDirection="column" justifyContent="space-between" boxShadow="sm" transition="all 0.2s" _hover={{shadow: 'md', borderColor: '#78be20'}}>
                                    
                                    {displayImage && (
                                        <Box position="relative" w="full" pb="70%" bg="gray.50">
                                            <img src={displayImage.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} alt={item.title} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '20px'}} />
                                        </Box>
                                    )}
                                    
                                    <Box p={5} display="flex" flexDirection="column" flex="1" justifyContent="space-between">
                                        <Box>
                                            {item.badgeText && (
                                                <Text bg="#78be20" color="white" px={2.5} py={0.5} borderRadius="full" fontSize="xs" fontWeight="bold" width="fit-content" mb={3}>{item.badgeText}</Text>
                                            )}
                                            <Heading size="sm" color="gray.900" mb={3} noOfLines={2}>{item.title}</Heading>
                                            <Box display="flex" alignItems="baseline" gap={2} mb={4}>
                                                <Text fontSize="2xl" fontWeight="black" color="#00a1de">£{Number(displayPrice).toFixed(2)}</Text>
                                                {item.oldPrice && (
                                                    <Text fontSize="sm" textDecoration="line-through" color="gray.500">Was £{Number(item.oldPrice).toFixed(2)}</Text>
                                                )}
                                            </Box>
                                        </Box>
                                        
                                        <Button bg="#78be20" color="white" width="full" size="sm" fontWeight="bold" _hover={{bg: '#6aa61b'}}>{item.ctaText || 'View Rollback'} ›</Button>
                                    </Box>
                                </Box>
                            </Link>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

const Home = () => {
    const [homepageData, setHomepageData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomepageContent = async () => {
            try {
                const query = encodeURIComponent(`*[_type == "homePage"][0]{
                    title,
                    homeSlots[]{
                        _type,
                        _key,
                        title,
                        subtitle,
                        slides[]{
                            _key,
                            headline,
                            subheadline,
                            ctaText,
                            linkUrl,
                            "imageUrl": heroImage.asset->url
                        },
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
                            price,
                            currentPrice,
                            badgeText,
                            ctaText,
                            "imageUrl": image.asset->url,
                            "mainImageUrl": mainImage.asset->url,
                            "productImageUrl": productImage.asset->url
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
                            
                            // 1. BOOK A SLOT LOGIC
                            if (slot._type === 'bookASlotBlock') {
                                return (
                                    <Box key={slot._key} w="100%" mb={12} bg="#f9f9f9" borderRadius="lg" p={6} display="flex" flexDirection={{base: 'column', md: 'row'}} alignItems="center" justifyContent="space-between" borderLeft="4px solid #78be20" boxShadow="sm">
                                        <Box mb={{base: 4, md: 0}}>
                                            <Heading as="h3" size="md" color="gray.900" mb={1}>{slot.title || 'Book a delivery or collection slot'}</Heading>
                                            {slot.subtitle && <Text color="gray.600" fontSize="sm">{slot.subtitle}</Text>}
                                        </Box>
                                        <Button bg="#78be20" color="white" _hover={{bg: '#6aa61b'}} px={8} size="md" fontWeight="bold">
                                            Book slot
                                        </Button>
                                    </Box>
                                )
                            }

                            // 2. HERO CARD CAROUSEL LOGIC
                            if (slot._type === 'heroCardCarousel') {
                                if (!slot.slides || slot.slides.length === 0) return null;

                                return (
                                    <Box key={slot._key} w="100%" mb={12}>
                                        <Box display="flex" overflowX="auto" scrollSnapType="x mandatory" gap={4} pb={4} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                                            {slot.slides.map((slide, index) => (
                                                <Box key={slide._key || index} minW={{ base: '100%', md: '80%', lg: '65%' }} scrollSnapAlign="center" position="relative" borderRadius="xl" overflow="hidden" minH="350px" display="flex" alignItems="center" p={10}>
                                                    {slide.imageUrl && (
                                                        <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={-1}>
                                                            <img src={slide.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.500" /> 
                                                        </Box>
                                                    )}
                                                    <Box color="white" maxW="xl" zIndex={1}>
                                                        {slide.headline && <Heading as="h2" size="2xl" mb={4} fontWeight="black" lineHeight="1.1">{slide.headline}</Heading>}
                                                        {slide.subheadline && <Text fontSize="xl" mb={6} fontWeight="medium">{slide.subheadline}</Text>}
                                                        {slide.ctaText && (
                                                            <Button as={slide.linkUrl ? "a" : "button"} href={slide.linkUrl || "#"} bg="#78be20" color="white" size="lg" fontWeight="bold" _hover={{bg: '#6aa61b', textDecoration: 'none'}}>
                                                                {slide.ctaText}
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                            // 3. BANNER ROW LOGIC 
                            if (slot._type === 'bannerRow' && slot.banners) {
                                const count = slot.banners.length
                                let itemWidth = '100%'
                                if (count === 2) itemWidth = { base: '100%', md: '50%' }
                                if (count === 3) itemWidth = { base: '100%', md: '33.333%' }
                                if (count === 4) itemWidth = { base: '50%', md: '25%' }

                                return (
                                    <Box key={slot._key} w="100%" mb={12}>
                                        
                                        {/* Render Title and Subtitle */}
                                        <Box mb={6}>
                                            {slot.title && (
                                                <Heading as="h2" fontSize={{base: '20px', md: '24px'}} fontWeight="700" color="gray.700" mb={1}>
                                                    {slot.title}
                                                </Heading>
                                            )}
                                            {slot.subtitle && (
                                                <Text color="gray.600" fontSize="sm" fontWeight="bold">
                                                    {slot.subtitle}
                                                </Text>
                                            )}
                                        </Box>
                                        
                                        {/* Render Images */}
                                        <Box display="flex" flexWrap="wrap" mx="-2">
                                            {slot.banners.map((banner, index) => (
                                                <Box key={banner._key || index} w={itemWidth} p={2}>
                                                    {banner.imageUrl && (
                                                        <Box as={banner.linkUrl ? 'a' : 'div'} href={banner.linkUrl} display="block" overflow="hidden" borderRadius="lg" transition="transform 0.2s" _hover={banner.linkUrl ? { transform: 'scale(1.01)' } : {}}>
                                                            <img src={banner.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} alt={banner.title || 'Promotional Banner'} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                            // 4. DEALS CAROUSEL LOGIC
                            if (slot._type === 'dealsGrid' && slot.offers) {
                                return <DealsCarouselBlock key={slot._key} slot={slot} />
                            }

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