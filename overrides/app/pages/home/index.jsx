/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useState} from 'react'
import {Box, Container, Text, Heading} from '@salesforce/retail-react-app/app/components/shared/ui'

// Seo Component
import Seo from '@salesforce/retail-react-app/app/components/seo'

const Home = () => {
    // 1. Initialize the correct state variables
    const [homepageData, setHomepageData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomepageContent = async () => {
            try {
                // 2. Query the single homePage document and grab its slots array
                const query = encodeURIComponent(`*[_type == "homePage"][0]{
                    title,
                    homeSlots[]{
                        _type,
                        _key,
                        title
                        // add other slot fields as you build out their properties
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

            {/* 3. Map through the dynamic Sanity Slots */}
            <Container maxW="1432px" mx="auto" px={4} py={8}>
                <Heading 
                    as="h1" 
                    fontSize={{base: '24px', md: '28px'}} 
                    fontWeight="bold" 
                    color="gray.800" 
                    mb={6}
                >
                    {homepageData?.title || "Home"}
                </Heading>

                {loading ? (
                    <Text color="gray.500" py={4}>Loading live homepage from Sanity...</Text>
                ) : !homepageData || !homepageData.homeSlots || homepageData.homeSlots.length === 0 ? (
                    <Text color="gray.500" py={4}>No homepage content found. Add some slots in your Sanity Studio dashboard!</Text>
                ) : (
                    homepageData.homeSlots.map((slot) => (
                        <Box key={slot._key} p={6} mb={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                            <Heading size="md" mb={2}>{slot.title || "Untitled Section"}</Heading>
                            <Text fontSize="sm" color="gray.600">Component Type: <strong>{slot._type}</strong></Text>
                        </Box>
                    ))
                )}
            </Container>
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home