/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, { useState, useEffect } from 'react'
import { Box, Container, Heading, Text } from '@salesforce/retail-react-app/app/components/shared/ui'
import { useParams } from 'react-router-dom'

const CategoryPage = () => {
    const { slug } = useParams() // Grabs 'food-cupboard' from the URL
    const [categoryData, setCategoryData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        // Updated GROQ query to match your exact schema fields (title, slug, and slots)
        const query = encodeURIComponent(`*[_type == "categoryPage" && slug.current == "${slug}"][0]{
            _id,
            title,
            "slug": slug.current,
            slots[]{
                _key,
                slotTitle,
                componentType
            }
        }`)
        
        const dataset = 'production'

        fetch(`/mobify/proxy/sanity-api/v2023-05-03/data/query/${dataset}?query=${query}`)
            .then(res => res.json())
            .then(data => {
                setCategoryData(data.result)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching category page:', err)
                setLoading(false)
            })
    }, [slug])

    if (loading) {
        return <Container py={10}><Text>Loading category...</Text></Container>
    }

    if (!categoryData) {
        return (
            <Container maxW="container.md" py={20} textAlign="center">
                <Heading size="lg" mb={4}>Category Not Found</Heading>
                <Text color="gray.600">We couldn't find a category matching "{slug}" in Sanity.</Text>
            </Container>
        )
    }

    return (
        <Container maxW="container.xl" py={8}>
            {/* Category Title Header */}
            <Heading mb={6} fontSize="3xl" fontWeight="bold" color="gray.800">
                {categoryData.title}
            </Heading>

            {/* Render Sanity Dynamic Slots if they exist */}
            {categoryData.slots && categoryData.slots.length > 0 ? (
                categoryData.slots.map((slot) => (
                    <Box key={slot._key} p={6} mb={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                        <Heading size="md" mb={2}>{slot.slotTitle || "Untitled Section"}</Heading>
                        <Text fontSize="sm" color="gray.600">Component Type: <strong>{slot.componentType}</strong></Text>
                    </Box>
                ))
            ) : (
                <Box bg="gray.50" p={8} borderRadius="md" textAlign="center">
                    <Text color="gray.600">This category has no content slots configured yet. Add some in Sanity Studio!</Text>
                </Box>
            )}
        </Container>
    )
}

CategoryPage.getTemplateName = () => 'CategoryPage'

export default CategoryPage