/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, Link, Text, Icon } from '@salesforce/retail-react-app/app/components/shared/ui'
import { SearchIcon, UserIcon, StoreIcon, ChevronRightIcon } from '@salesforce/retail-react-app/app/components/icons'
import SanityTrolleyWidget from '../sanity-trolley-widget'

const AsdaHeader = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        // Fetch 4 levels deep: Department -> Aisle -> Shelf -> Product Category
        const query = encodeURIComponent(`*[_type == "categoryPage" && !defined(parentCategory) && !defined(parent) && !defined(parent_category)]{ 
            _id, title, "slug": slug.current,
            "children": *[_type == "categoryPage" && references(^._id)]{
                _id, title, "slug": slug.current,
                "children": *[_type == "categoryPage" && references(^._id)]{
                    _id, title, "slug": slug.current,
                    "children": *[_type == "categoryPage" && references(^._id)]{
                        _id, title, "slug": slug.current
                    }
                }
            }
        }`)
        
        const dataset = 'production'
        
        fetch(`/mobify/proxy/sanity-api/v2023-05-03/data/query/${dataset}?query=${query}`)
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
                    {categories && categories.map((level1) => (
                        <Box key={level1._id} position="relative" role="group">
                            
                            {/* LEVEL 1: Top Nav (e.g., Groceries) */}
                            <Link href={`/category/${level1.slug}`} _hover={{ color: '#78be20', textDecoration: 'none' }} py={3} display="block">
                                {level1.title}
                            </Link>

                            {/* LEVEL 2: First Dropdown (e.g., Food Cupboard) */}
                            {level1.children && level1.children.length > 0 && (
                                <Box position="absolute" top="100%" left={0} bg="white" boxShadow="lg" py={2} minW="260px" display="none" _groupHover={{ display: 'block' }} zIndex={10} borderTop="3px solid #78be20">
                                    {level1.children.map(level2 => (
                                        <Box key={level2._id} position="relative" role="group">
                                            <Flex align="center" justify="space-between" px={4} py={2} _hover={{ bg: 'gray.50', color: '#78be20' }}>
                                                <Link href={`/category/${level2.slug}`} display="block" w="full" fontWeight="normal" _hover={{ textDecoration: 'none' }}>
                                                    {level2.title}
                                                </Link>
                                                {/* Add an arrow if there are deeper items */}
                                                {level2.children && level2.children.length > 0 && <ChevronRightIcon boxSize={4} />}
                                            </Flex>

                                            {/* LEVEL 3: Flyout Menu (e.g., Tinned Food) */}
                                            {level2.children && level2.children.length > 0 && (
                                                <Box position="absolute" top={0} left="100%" bg="white" boxShadow="lg" py={2} minW="260px" minH="100%" display="none" _groupHover={{ display: 'block' }} zIndex={11} borderLeft="1px solid" borderColor="gray.200">
                                                    {level2.children.map(level3 => (
                                                        <Box key={level3._id} position="relative" role="group">
                                                            <Flex align="center" justify="space-between" px={4} py={2} _hover={{ bg: 'gray.50', color: '#78be20' }}>
                                                                <Link href={`/category/${level3.slug}`} display="block" w="full" fontWeight="normal" _hover={{ textDecoration: 'none' }}>
                                                                    {level3.title}
                                                                </Link>
                                                                {level3.children && level3.children.length > 0 && <ChevronRightIcon boxSize={4} />}
                                                            </Flex>

                                                            {/* LEVEL 4: Final Flyout (e.g., Baked Beans) */}
                                                            {level3.children && level3.children.length > 0 && (
                                                                <Box position="absolute" top={0} left="100%" bg="white" boxShadow="lg" py={2} minW="260px" minH="100%" display="none" _groupHover={{ display: 'block' }} zIndex={12} borderLeft="1px solid" borderColor="gray.200">
                                                                    {level3.children.map(level4 => (
                                                                        <Link key={level4._id} href={`/category/${level4.slug}`} display="block" px={4} py={2} fontWeight="normal" color="gray.700" _hover={{ bg: 'gray.50', color: '#78be20', textDecoration: 'none' }}>
                                                                            {level4.title}
                                                                        </Link>
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
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