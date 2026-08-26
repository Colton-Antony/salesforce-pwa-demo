/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {Box, Button, Text, Heading, Flex, Divider} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {useParams} from 'react-router-dom'

const SanityProduct = () => {
    const {slug} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return
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
                const res = await fetch(`/mobify/proxy/sanity-api/v2024-01-01/data/query/production?query=${query}`)
                const json = await res.json()
                const offers = json.result || []
                const matchedProduct = offers.find((item) => item.slug === slug)
                setProduct(matchedProduct || null)
            } catch (err) {
                console.error("Error fetching product from Sanity proxy:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [slug])

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('asda_sanity_cart') || '[]')
        cart.push(product)
        localStorage.setItem('asda_sanity_cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('sanity-cart-updated'))
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) {
        return <Box p={12} textAlign="center"><Text>Loading product details...</Text></Box>
    }

    if (!product) {
        return (
            <Box p={8} textAlign="center" maxW="600px" mx="auto" mt={12}>
                <Heading size="lg" mb={3} color="gray.800">Product not found in Sanity</Heading>
                <Text color="gray.600" mb={4}>Could not find a match for slug: <b>{slug}</b></Text>
                <Button as="a" href="/" bg="#78be20" color="white" _hover={{bg: '#6aa61b'}}>‹ Back to Homepage</Button>
            </Box>
        )
    }

    return (
        <Box data-testid="pdp-page" bg="white" minH="100vh" py={6}>
            <Seo title={`${product.title} - ASDA Groceries`} description={product.title} />
            
            <Box maxW="1432px" mx="auto" px={4}>
                {/* Breadcrumbs */}
                <Text fontSize="sm" color="gray.600" mb={6}>
                    <a href="/">Home</a> / <Text as="span" fontWeight="600" color="gray.800">{product.title}</Text>
                </Text>

                {/* Main Product Grid */}
                <Flex direction={{base: 'column', md: 'row'}} gap={12} align="flex-start">
                    {/* Product Image Box */}
                    <Box flex="1" bg="#f6f6f6" p={8} borderRadius="8px" border="1px solid" borderColor="gray.200" w="full" display="flex" justifyContent="center" alignItems="center">
                        {product.imageUrl && (
                            <img 
                                src={product.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                                alt={product.title} 
                                style={{maxHeight: '400px', objectFit: 'contain', width: '100%'}} 
                            />
                        )}
                    </Box>

                    {/* Product Details & Purchase Box */}
                    <Box flex="1">
                        {product.badgeText && (
                            <Text bg="#C21E4D" color="white" px={2.5} py={0.5} borderRadius="3px" fontSize="xs" fontWeight="600" width="fit-content" mb={3}>
                                {product.badgeText}
                            </Text>
                        )}
                        <Heading as="h1" fontSize={{base: '24px', md: '28px'}} fontWeight="600" color="black" mb={2}>
                            {product.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.500" mb={3}>415g</Text>

                        {/* Reviews Mockup */}
                        <Flex align="center" gap={2} mb={4}>
                            <Text color="orange.400" fontSize="lg">★★★★★</Text>
                            <Text fontSize="sm" color="blue.500" fontWeight="600" cursor="pointer">4.7 (152 reviews)</Text>
                        </Flex>

                        <Divider mb={4} />

                        {/* Pricing */}
                        <Flex align="baseline" gap={3} mb={1}>
                            <Text fontSize="3xl" fontWeight="600" color="#222222">£{Number(product.newPrice).toFixed(2)}</Text>
                            {product.oldPrice && (
                                <Text fontSize="md" textDecoration="line-through" color="gray.500">Was £{Number(product.oldPrice).toFixed(2)}</Text>
                            )}
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mb={6}>(£3.33/kg)</Text>

                        {/* Add to Trolley Button */}
                        <Button 
                            bg="#78be20" 
                            color="white" 
                            size="lg" 
                            w="full" 
                            fontWeight="bold"
                            py={6}
                            fontSize="lg"
                            _hover={{bg: '#68a51c'}}
                            onClick={handleAddToCart}
                        >
                            {added ? 'Added to trolley ✓' : 'Add to trolley'}
                        </Button>
                    </Box>
                </Flex>

                {/* Dietary & Traffic Light Nutrition Section */}
                <Box mt={12} pt={8} borderTop="1px solid" borderColor="gray.200">
                    <Heading as="h2" size="md" mb={4}>Dietary and lifestyle</Heading>
                    <Flex gap={4} mb={8}>
                        <Text bg="gray.100" px={3} py={1} borderRadius="md" fontSize="sm">Low Fat</Text>
                        <Text bg="gray.100" px={3} py={1} borderRadius="md" fontSize="sm">Suitable for Vegans</Text>
                    </Flex>

                    <Heading as="h2" size="md" mb={4}>Nutrition (Per 1/2 can)</Heading>
                    <Flex gap={2} wrap="wrap" mb={8}>
                        {[{label: 'Energy', val: '168kcal', col: 'gray.100'}, {label: 'Fat', val: '0.7g', col: '#538316', textCol: 'white'}, {label: 'Saturates', val: '0.1g', col: '#538316', textCol: 'white'}, {label: 'Sugars', val: '8.9g', col: '#538316', textCol: 'white'}, {label: 'Salt', val: '1.3g', col: '#F7CC00'}].map((nut, i) => (
                            <Box key={i} bg={nut.col} color={nut.textCol || 'black'} p={3} borderRadius="4px 4px 20px 20px" textAlign="center" minW="80px" flex="1">
                                <Text fontSize="xs" fontWeight="bold">{nut.label}</Text>
                                <Text fontSize="sm" fontWeight="bold" my={2}>{nut.val}</Text>
                            </Box>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </Box>
    )
}

SanityProduct.getTemplateName = () => 'sanity-product'
export default SanityProduct