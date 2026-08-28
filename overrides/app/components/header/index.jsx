/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, Link, Text } from '@salesforce/retail-react-app/app/components/shared/ui'
import { SearchIcon, UserIcon, StoreIcon, ChevronRightIcon } from '@salesforce/retail-react-app/app/components/icons'
import SanityTrolleyWidget from '../sanity-trolley-widget'

const AsdaHeader = () => {
    const [navItems, setNavItems] = useState([])
    const [activeSubCategory, setActiveSubCategory] = useState(null)

    useEffect(() => {
        const query = encodeURIComponent(`*[_type == "mainNavigation"][0]{
            navItems[]{
                _key,
                label,
                url,
                megaMenuCategories[]{
                    _key,
                    categoryLabel,
                    categoryUrl,
                    subLinks[]{
                        _key,
                        label,
                        url
                    }
                },
                promoBanners[]{
                    _key,
                    altText,
                    linkUrl,
                    "imageUrl": image.asset->url
                }
            }
        }`)
        
        const dataset = 'production'
        
        fetch(`/mobify/proxy/sanity-api/v2023-05-03/data/query/${dataset}?query=${query}`)
            .then(res => res.json())
            .then(data => {
                if (data.result && data.result.navItems) {
                    setNavItems(data.result.navItems)
                }
            })
            .catch(err => console.error('Error fetching header navigation from Sanity proxy:', err))
    }, [])

    return (
        <Box w="full" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
            {/* Top Announcement Bar */}
            <Box bg="#78be20" color="white" py={1.5} px={4} textAlign="center" fontSize="sm" fontWeight="bold">
                <Text>🌿 Welcome to Asda Groceries & Rollbacks — Delivered fresh to your door!</Text>
            </Box>

            {/* Main Header Bar */}
            <Flex maxW="container.xl" mx="auto" px={4} py={3} alignItems="center" justifyContent="space-between" gap={6}>
                <Link href="/" _hover={{ textDecoration: 'none' }}>
                    <Box bg="#78be20" color="white" px={4} py={2} borderRadius="md" fontWeight="black" fontSize="2xl" letterSpacing="wider" fontFamily="heading">
                        ASDA
                    </Box>
                </Link>

                <Flex flex={1} maxW="600px" position="relative" alignItems="center">
                    <Input placeholder="Search products, rollbacks and more..." borderRadius="full" bg="gray.100" border="2px solid transparent" _focus={{ bg: 'white', borderColor: '#78be20', boxShadow: 'none' }} py={5} pl={4} pr={10} />
                    <Box position="absolute" right={4} color="gray.500">
                        <SearchIcon boxSize={5} />
                    </Box>
                </Flex>

                <Flex alignItems="center" gap={6} color="gray.700">
                    <Link href="/account" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <UserIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Sign in</Text>
                    </Link>
                    <Link href="/stores" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <StoreIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Stores</Text>
                    </Link>
                    <SanityTrolleyWidget />
                </Flex>
            </Flex>

            {/* Dynamic Mega Menu Navigation */}
            <Box bg="#f8f9fa" borderTop="1px solid" borderColor="gray.200" px={4}>
                <Flex maxW="container.xl" mx="auto" gap={8} fontSize="sm" fontWeight="semibold" color="gray.700">
                    {navItems && navItems.map((tab) => (
                        <Box 
                            key={tab._key} 
                            position="relative" 
                            role="group"
                        >
                            <Link href={tab.url || '#'} _hover={{ color: '#78be20', textDecoration: 'none' }} py={3} display="block">
                                {tab.label}
                            </Link>

                            {(tab.megaMenuCategories?.length > 0 || tab.promoBanners?.length > 0) && (
                                <Box 
                                    position="absolute" 
                                    top="100%" 
                                    left={0} 
                                    w="950px" 
                                    bg="white" 
                                    boxShadow="xl" 
                                    display="none" 
                                    _groupHover={{ display: 'flex' }} 
                                    zIndex={10} 
                                    borderTop="3px solid #78be20"
                                    minH="450px"
                                    onMouseLeave={() => setActiveSubCategory(null)} // Reset flyout when mouse leaves the dropdown
                                >
                                    
                                    {/* COLUMN 1: Scrolling Left Navigation */}
                                    <Box 
                                        w="280px" 
                                        borderRight="1px solid" 
                                        borderColor="gray.200" 
                                        py={2} 
                                        overflowY="auto" 
                                        maxH="550px"
                                        // Custom Asda-style Scrollbar
                                        sx={{ 
                                            '&::-webkit-scrollbar': { width: '6px' },
                                            '&::-webkit-scrollbar-track': { background: '#f8f9fa' },
                                            '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: '4px' },
                                            '&::-webkit-scrollbar-thumb:hover': { background: '#9ca3af' }
                                        }}
                                    >
                                        {tab.megaMenuCategories && tab.megaMenuCategories.map(cat => (
                                            <Box 
                                                key={cat._key} 
                                                onMouseEnter={() => setActiveSubCategory(cat._key)}
                                                bg={activeSubCategory === cat._key ? 'gray.50' : 'transparent'}
                                            >
                                                <Flex 
                                                    as={Link} 
                                                    href={cat.categoryUrl || '#'} 
                                                    align="center" 
                                                    justify="space-between" 
                                                    px={4} 
                                                    py={2.5} 
                                                    _hover={{ textDecoration: 'none', color: '#78be20' }}
                                                    color={activeSubCategory === cat._key ? '#78be20' : 'gray.700'}
                                                >
                                                    <Text fontWeight="normal">{cat.categoryLabel}</Text>
                                                    {cat.subLinks && cat.subLinks.length > 0 && (
                                                        <ChevronRightIcon boxSize={4} />
                                                    )}
                                                </Flex>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* COLUMN 2: True Flyout Overlap (Only visible on hover) */}
                                    {tab.megaMenuCategories && tab.megaMenuCategories.map(cat => (
                                        <Box 
                                            key={`sub-${cat._key}`}
                                            display={activeSubCategory === cat._key ? 'block' : 'none'}
                                            position="absolute"
                                            top={0}
                                            left="280px" // Docks exactly next to the left column
                                            w="280px"
                                            h="full"
                                            bg="white"
                                            boxShadow="6px 0 10px -4px rgba(0,0,0,0.1)" // Shadow makes it look like it's floating over the banners
                                            zIndex={20}
                                            py={2}
                                            borderRight="1px solid" 
                                            borderColor="gray.200"
                                        >
                                            {cat.subLinks && cat.subLinks.map(sub => (
                                                <Link 
                                                    key={sub._key} 
                                                    href={sub.url || '#'} 
                                                    display="block" 
                                                    px={5} 
                                                    py={2} 
                                                    fontWeight="normal"
                                                    _hover={{ bg: 'gray.50', color: '#78be20', textDecoration: 'none' }}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </Box>
                                    ))}

                                    {/* COLUMN 3: Mixed-Size Promo Banners */}
                                    <Box flex={1} bg="gray.50" p={6}>
                                        {tab.promoBanners && tab.promoBanners.length > 0 ? (
                                            <Box 
                                                display="grid" 
                                                // If 4 images, make a 3-column grid for the bottom row. Otherwise, 2 columns.
                                                gridTemplateColumns={tab.promoBanners.length === 4 ? "repeat(3, 1fr)" : "repeat(2, 1fr)"} 
                                                gap={4}
                                            >
                                                {tab.promoBanners.map((promo, index) => (
                                                    <Box 
                                                        key={promo._key || index} 
                                                        // First image always spans the entire width of the container
                                                        gridColumn={index === 0 ? '1 / -1' : 'span 1'}
                                                    >
                                                        <Link href={promo.linkUrl || '#'} _hover={{ textDecoration: 'none' }} display="block" h="100%">
                                                            <Box 
                                                                overflow="hidden" 
                                                                borderRadius="md" 
                                                                h="100%"
                                                                transition="transform 0.2s, box-shadow 0.2s" 
                                                                _hover={{ transform: 'scale(1.02)', shadow: 'md' }}
                                                            >
                                                                {promo.imageUrl && (
                                                                    <img 
                                                                        src={promo.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                                                                        alt={promo.altText || 'Promotion'} 
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Link>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Flex justify="center" align="center" h="full">
                                                <Text color="gray.400" fontSize="sm">No promotional banners configured.</Text>
                                            </Flex>
                                        )}
                                    </Box>

                                </Box>
                            )}
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Box>
    )
}

AsdaHeader.getTemplateName = () => 'AsdaHeader'

export default AsdaHeader