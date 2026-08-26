/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useState, useEffect} from 'react'
import {Box, Button, Text, Heading, Flex, Divider} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

const CartPage = () => {
    const [cart, setCart] = useState([])

    const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('asda_sanity_cart') || '[]')
        setCart(storedCart)
    }

    useEffect(() => {
        loadCart()
    }, [])

    const handleRemove = (index) => {
        const updatedCart = [...cart]
        updatedCart.splice(index, 1)
        setCart(updatedCart)
        localStorage.setItem('asda_sanity_cart', JSON.stringify(updatedCart))
        window.dispatchEvent(new Event('sanity-cart-updated'))
    }

    const subtotal = cart.reduce((acc, item) => acc + Number(item.newPrice || 0), 0)

    return (
        <Box bg="white" minH="100vh" py={8}>
            <Seo title="Your Trolley - ASDA Groceries" description="Review your shopping trolley items." />
            <Box maxW="1000px" mx="auto" px={4}>
                <Heading size="xl" mb={6} fontWeight="bold" color="gray.900">🛒 Your Shopping Trolley</Heading>

                {cart.length === 0 ? (
                    <Box textAlign="center" py={12} bg="gray.50" borderRadius="8px" border="1px solid" borderColor="gray.200">
                        <Text fontSize="lg" color="gray.600" mb={4}>Your trolley is currently empty.</Text>
                        <Button as="a" href="/" bg="#78be20" color="white" _hover={{bg: '#6aa61b'}}>
                            Start Shopping Rollbacks ›
                        </Button>
                    </Box>
                ) : (
                    <Flex direction={{base: 'column', md: 'row'}} gap={8}>
                        {/* Item List */}
                        <Box flex="2">
                            {cart.map((item, idx) => (
                                <Flex key={idx} p={4} mb={4} border="1px solid" borderColor="gray.200" borderRadius="8px" alignItems="center" gap={4} bg="white">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} alt={item.title} style={{width: '80px', height: '80px', objectFit: 'contain'}} />
                                    )}
                                    <Box flex="1">
                                        <Heading size="sm" color="gray.900" mb={1}>{item.title}</Heading>
                                        <Text fontSize="sm" color="gray.500">Price: £{Number(item.newPrice).toFixed(2)}</Text>
                                    </Box>
                                    <Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleRemove(idx)}>
                                        Remove
                                    </Button>
                                </Flex>
                            ))}
                        </Box>

                        {/* Summary Box */}
                        <Box flex="1" bg="gray.50" p={6} borderRadius="8px" border="1px solid" borderColor="gray.200" h="fit-content">
                            <Heading size="md" mb={4} color="gray.900">Order Summary</Heading>
                            <Flex justify="space-between" mb={2}>
                                <Text color="gray.600">Subtotal</Text>
                                <Text fontWeight="semibold">£{subtotal.toFixed(2)}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={4}>
                                <Text color="gray.600">Delivery / Slot</Text>
                                <Text fontWeight="semibold" color="green.600">Free / Not Booked</Text>
                            </Flex>
                            <Divider mb={4} />
                            <Flex justify="space-between" mb={6}>
                                <Text fontSize="lg" fontWeight="bold">Total</Text>
                                <Text fontSize="lg" fontWeight="bold" color="#00a1de">£{subtotal.toFixed(2)}</Text>
                            </Flex>
                            <Button as="a" href="/checkout" bg="#00a1de" color="white" w="full" size="lg" fontWeight="bold" _hover={{bg: '#008bbd'}} textAlign="center">
                                Proceed to Checkout ›
                            </Button>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Box>
    )
}

CartPage.getTemplateName = () => 'cart'
export default CartPage