import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, Button, Badge, Stack } from '@salesforce/retail-react-app/app/components/shared/ui'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'ogtlyxao',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true
})

const SanityProduct = () => {
    const { slug } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const query = `*[_type == "rollbackOffer" && slug.current == $slug][0]{
                    _id,
                    title,
                    "slug": slug.current,
                    "imageUrl": mainImage.asset->url,
                    oldPrice,
                    newPrice,
                    badgeText,
                    ctaText
                }`
                const data = await client.fetch(query, { slug })
                setProduct(data)
            } catch (err) {
                console.error("Error fetching Sanity product:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [slug])

    if (loading) {
        return <Box p={10} textAlign="center"><Text>Loading product...</Text></Box>
    }

    if (!product) {
        return <Box p={10} textAlign="center"><Heading size="lg">Product not found in Sanity</Heading></Box>
    }

    return (
        <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 8 }}>
            <Text fontSize="sm" color="gray.600" mb={6}>
                Home &gt; Groceries &gt; Tinned Food &gt; {product.title}
            </Text>

            <Box 
                display={{ base: 'block', md: 'flex' }} 
                gap={10} 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
            >
                {product.imageUrl && (
                    <Box flex="1" textAlign="center" p={4} bg="gray.50" borderRadius="md">
                        <img 
                            src={product.imageUrl} 
                            alt={product.title} 
                            style={{ maxHeight: '400px', margin: '0 auto', objectFit: 'contain' }} 
                        />
                    </Box>
                )}

                <Box flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                    <Stack spacing={4}>
                        {product.badgeText && (
                            <Badge bg="#78be20" color="white" px={3} py={1} borderRadius="full" width="fit-content" fontSize="sm" fontWeight="bold">
                                {product.badgeText}
                            </Badge>
                        )}
                        <Heading size="xl" color="gray.900">{product.title}</Heading>
                        <Text fontSize="sm" color="gray.500">Product code: SANITY-{product._id.slice(-6).toUpperCase()}</Text>

                        <Box bg="#f4f9ec" p={4} borderRadius="md" borderLeft="4px solid #78be20">
                            <Text color="gray.500" fontSize="sm" textTransform="uppercase" fontWeight="bold">Rollback Deal</Text>
                            <Box display="flex" alignItems="baseline" gap={3} mt={1}>
                                <Text fontSize="3xl" fontWeight="extrabold" color="#00a1de">
                                    £{Number(product.newPrice).toFixed(2)}
                                </Text>
                                <Text fontSize="lg" textDecoration="line-through" color="gray.500">
                                    Was £{Number(product.oldPrice).toFixed(2)}
                                </Text>
                            </Box>
                        </Box>
                    </Stack>

                    <Box mt={8}>
                        <Button 
                            bg="#78be20" 
                            color="white" 
                            size="lg" 
                            width="full" 
                            _hover={{ bg: '#6aa61b' }}
                            fontSize="lg"
                            fontWeight="bold"
                            height="56px"
                            onClick={() => alert(`Added ${product.title} to your Asda trolley!`)}
                        >
                            {product.ctaText || 'Add to trolley'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default SanityProduct