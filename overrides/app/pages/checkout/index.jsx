/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useState, useEffect} from 'react'
import {Box, Button, Text, Heading, Flex, Divider} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

const CheckoutPage = () => {
    const [cart, setCart] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: 'Antony Colton',
        address: '10 Groceries Way, Harrogate',
        postcode: 'HG1 1AA',
        cardNumber: '•••• •••• •••• 4242'
    })

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('asda_sanity_cart') || '[]')
        setCart(storedCart)
    }, [])

    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.newPrice ?? item.price ?? 0)
        const qty = item.quantity || 1
        return acc + (price * qty)
    }, 0)

    const handleCheckoutSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        // Clear local storage cart
        localStorage.removeItem('asda_sanity_cart')
        window.dispatchEvent(new Event('sanity-cart-updated'))
    }

    if (submitted) {
        return (
            <Box bg="white" minH="100vh" py={16} textAlign="center">
                <Seo title="Order Confirmed - ASDA" description="Order successfully placed" />
                <Box maxW="600px" mx="auto" px={6} bg="gray.50" p={10} borderRadius="8px" border="1px solid" borderColor="gray.200" shadow="md">
                    <Heading size="xl" color="#78be20" mb={4}>🎉 Order Placed Successfully!</Heading>
                    <Text fontSize="md" color="gray.700" mb={2}>
                        Thank you for your order, <b>{formData.name}</b>.
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={6}>
                        A confirmation email has been simulated. Your Sanity headless items and Salesforce PWA session completed successfully.
                    </Text>
                    <Button as="a" href="/" bg="#78be20" color="white" size="lg" _hover={{bg: '#6aa61b'}} fontWeight="bold">
                        ‹ Return to ASDA Home
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box bg="white" minH="100vh" py={8}>
            <Seo title="Secure Checkout - ASDA" description="Complete your secure checkout demo." />
            <Box maxW="1000px" mx="auto" px={4}>
                <Heading size="xl" mb={6} fontWeight="bold" color="gray.900">🔒 Secure Checkout Demo</Heading>

                <Flex direction={{base: 'column', md: 'row'}} gap={8} align="flex-start">
                    {/* Checkout Form */}
                    <Box as="form" onSubmit={handleCheckoutSubmit} flex="2" w="full" bg="gray.50" p={6} borderRadius="8px" border="1px solid" borderColor="gray.200">
                        <Heading size="md" mb={4} color="gray.800">1. Delivery Address</Heading>
                        <Box mb={4}>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Full Name</Text>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e5) => setFormData({...formData, name: e5.target.value})}
                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} 
                                required 
                            />
                        </Box>
                        <Box mb={4}>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Delivery Address</Text>
                            <input 
                                type="text" 
                                value={formData.address} 
                                onChange={(e5) => setFormData({...formData, address: e5.target.value})}
                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} 
                                required 
                            />
                        </Box>
                        <Box mb={6}>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Postcode</Text>
                            <input 
                                type="text" 
                                value={formData.postcode} 
                                onChange={(e5) => setFormData({...formData, postcode: e5.target.value})}
                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} 
                                required 
                            />
                        </Box>

                        <Divider mb={6} />

                        <Heading size="md" mb={4} color="gray.800">2. Payment Method (Mock)</Heading>
                        <Box mb={6}>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Card Number</Text>
                            <input 
                                type="text" 
                                value={formData.cardNumber} 
                                onChange={(e5) => setFormData({...formData, cardNumber: e5.target.value})}
                                style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} 
                                required 
                            />
                        </Box>

                        <Button type="submit" bg="#78be20" color="white" w="full" size="lg" fontWeight="bold" _hover={{bg: '#6aa61b'}}>
                            Complete Order (£{subtotal.toFixed(2)})
                        </Button>
                    </Box>

                    {/* Order Review Box */}
                    <Box flex="1" w="full" bg="white" p={6} borderRadius="8px" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Heading size="md" mb={4} color="gray.900">Trolley Summary</Heading>
                        {cart.map((item, idx) => {
                            const itemPrice = Number(item.newPrice ?? item.price ?? 0)
                            return (
                                <Flex key={idx} justify="space-between" fontSize="sm" mb={2}>
                                    <Text color="gray.600">{item.title} (x{item.quantity || 1})</Text>
                                    <Text fontWeight="semibold">£{(itemPrice * (item.quantity || 1)).toFixed(2)}</Text>
                                </Flex>
                            )
                        })}
                        <Divider my={4} />
                        <Flex justify="space-between" mb={2}>
                            <Text fontWeight="bold">Total Due</Text>
                            <Text fontWeight="bold" color="#00a1de" fontSize="lg">£{subtotal.toFixed(2)}</Text>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}

CheckoutPage.getTemplateName = () => 'checkout'
export default CheckoutPage