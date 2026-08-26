/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {Box, Button, Text, Heading} from '@salesforce/retail-react-app/app/components/shared/ui'
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
                const groq = `*[_type == "rollbackOffer" && slug.current == "${slug}"][0]{
                    _id,
                    title,
                    "slug": slug.current,
                    "imageUrl": mainImage.asset->url,
                    oldPrice,
                    newPrice,
                    badgeText,
                    ctaText
                }`
                const query = encodeURIComponent(groq)
                const res = await fetch(`/mobify/proxy/sanity-api/v2024-01-01/data/query/production?query=${query}`)
                const json = await res.json()
                setProduct(json.result || null)
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
        
        // Dispatch custom event so header trolley updates instantly
        window.dispatchEvent(new Event('sanity-cart-updated'))

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) {
        return <Box p={8} textAlign="center"><Text>Loading product details...</Text></Box>
    }

    if (!product) {
        return <Box p={8} textAlign="center"><Heading size="lg">Product not found in Sanity</Heading></Box>
    }

    return (
        <Box data-testid="sanity-product-page" layerStyle="page" bg="white" minH="100vh" py={8}>
            <Seo title={`${product.title} - ASDA Groceries`} description={product.title} />
            <Box maxW="1000px" mx="auto" px={4} display={{base: 'block', md: 'flex'}} gap={8}>
                {product.imageUrl && (
                    <Box flex="1" bg="gray.50" p={4} borderRadius="8px" border="1px solid" borderColor="gray.200">
                        <img 
                            src={product.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                            alt={product.title} 
                            style={{width: '100%', height: 'auto', objectFit: 'contain'}} 
                        />
                    </Box>
                )}
                <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
                    {product.badgeText && (
                        <Text bg="#78be20" color="white" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" width="fit-content" mb={3}>
                            {product.badgeText}
                        </Text>
                    )}
                    <Heading size="xl" color="gray.900" mb={4}>{product.title}</Heading>
                    <Box display="flex" alignItems="baseline" gap={3} mb={6}>
                        <Text fontSize="3xl" fontWeight="black" color="#00a1de">£{Number(product.newPrice).toFixed(2)}</Text>
                        <Text fontSize="lg" textDecoration="line-through" color="gray.500">Was £{Number(product.oldPrice).toFixed(2)}</Text>
                    </Box>
                    <Button 
                        bg="#78be20" 
                        color="white" 
                        size="lg" 
                        fontWeight="bold" 
                        _hover={{bg: '#6aa61b'}}
                        onClick={handleAddToCart}
                    >
                        {added ? 'Added to Trolley! ✓' : 'Add to trolley ›'}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

SanityProduct.getTemplateName = () => 'sanity-product'

export default SanityProduct