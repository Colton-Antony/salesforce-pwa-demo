/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, Link, Text } from '@salesforce/retail-react-app/app/components/shared/ui'
import { SearchIcon, UserIcon, StoreIcon } from '@salesforce/retail-react-app/app/components/icons'
import SanityTrolleyWidget from '../sanity-trolley-widget'

const AsdaHeader = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        // Query for top-level categories
        const query = encodeURIComponent('*[_type == "categoryPage" && navigationLevel == "Super Department (Top Nav)"]{ _id, title, "slug": slug.current }')
        const dataset = 'production'
        
        // Use your configured server proxy path to bypass browser CSP blocks entirely
        fetch(`/sanity-api/v2023-05-03/data/query/${dataset}?query=${query}`)
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setCategories(data.result)
                }
            })
            .catch(err => console.error('Error fetching header categories from Sanity proxy:', err))
    }, [])

    return (
        <Box w="full" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
            {/* Top Announcement Bar */}
            <Box bg="#78be20" color="white" py={1.5} px={4} textAlign="center" fontSize="sm" fontWeight="bold">
                <Text>🌿 Welcome to Asda Groceries & Rollbacks — Delivered fresh to your door!</Text>
            </Box>

            {/* Main Header Bar */}
            <Flex 
                maxW="container.xl" 
                mx="auto" 
                px={4} 
                py={3} 
                alignItems="center" 
                justifyContent="space-between"
                gap={6}
            >
                {/* Asda Branding Logo */}
                <Link href="/" _hover={{ textDecoration: 'none' }}>
                    <Box 
                        bg="#78be20" 
                        color="white" 
                        px={4} 
                        py={2} 
                        borderRadius="md" 
                        fontWeight="black" 
                        fontSize="2xl"
                        letterSpacing="wider"
                        fontFamily="heading"
                    >
                        ASDA
                    </Box>
                </Link>

                {/* Search Bar */}
                <Flex flex={1} maxW="600px" position="relative" alignItems="center">
                    <Input 
                        placeholder="Search products, rollbacks and more..." 
                        borderRadius="full"
                        bg="gray.100"
                        border="2px solid transparent"
                        _focus={{ bg: 'white', borderColor: '#78be20', boxShadow: 'none' }}
                        py={5}
                        pl={4}
                        pr={10}
                    />
                    <Box position="absolute" right={4} color="gray.500">
                        <SearchIcon boxSize={5} />
                    </Box>
                </Flex>

                {/* Right Action Icons */}
                <Flex alignItems="center" gap={6} color="gray.700">
                    <Link href="/account" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <UserIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Sign in</Text>
                    </Link>

                    <Link href="/stores" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <StoreIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Stores</Text>
                    </Link>

                    {/* Interactive Sanity Trolley Dropdown Widget */}
                    <SanityTrolleyWidget />
                </Flex>
            </Flex>

            {/* Dynamic Sub-Navigation Links Bar (Driven by Sanity Categories) */}
            <Box bg="#f8f9fa" borderTop="1px solid" borderColor="gray.200" px={4}>
                <Flex maxW="container.xl" mx="auto" py={2} gap={8} fontSize="sm" fontWeight="semibold" color="gray.700" overflowX="auto">
                    {categories && categories.map((cat) => (
                        <Link 
                            key={cat._id} 
                            href={`/category/${cat.slug}`} 
                            _hover={{ color: '#78be20', textDecoration: 'none' }}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </Flex>
            </Box>
        </Box>
    )
}

AsdaHeader.getTemplateName = () => 'AsdaHeader'

export default AsdaHeader