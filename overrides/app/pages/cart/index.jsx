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
        // Ensure each item has a quantity property defaulting to 1
        const normalized = storedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            resolvedPrice: Number(item.newPrice ?? item.price ?? 0)
        }))
        setCart(normalized)
    }

    useEffect(() => {
        loadCart()
    }, [])

    const updateQuantity = (index, delta) => {
        const updated = [...cart]
        updated[index].quantity += delta
        if (updated[index].quantity <= 0) {
            updated.splice(index, 1)
        }
        setCart(updated)
        localStorage.setItem('asda_sanity_cart', JSON.stringify(updated))
        window.dispatchEvent(new Event('sanity-cart-updated'))
    }

    const handleRemove = (index) => {
        const updated = [...cart]
        updated.splice(index, 1)
        setCart(updated)
        localStorage.setItem('asda_sanity_cart', JSON.stringify(updated))
        window.dispatchEvent(new Event('sanity-cart-updated'))
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.resolvedPrice * item.quantity), 0)
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Box bg="white" minH="100vh" py={8}>
            <Seo title="Your Trolley - ASDA Groceries" description="Review your shopping trolley items." />
            <Box maxW="1200px" mx="auto" px={4}>
                <Heading size="xl" mb={6} fontWeight="bold" color="gray.900">
                    🛒 Your Shopping Trolley ({totalItems} items)
                </Heading>

                {cart.length === 0 ? (
                    <Box textAlign="center" py={16} bg="gray.50" borderRadius="8px" border="1px solid" borderColor="gray.200">
                        <Text fontSize="lg" color="gray.600" mb={4}>Your trolley is currently empty.</Text>
                        <Button as="a" href="/" bg="#78be20" color="white" _hover={{bg: '#6aa61b'}} size="lg">
                            Start Shopping Rollbacks ›
                        </Button>
                    </Box>
                ) : (
                    <Flex direction={{base: 'column', lg: 'row'}} gap={8} align="flex-start">
                        {/* Cart Items List */}
                        <Box flex="2" w="full">
                            {cart.map((item, idx) => (
                                <Flex key={idx} p={4} mb={4} border="1px solid" borderColor="gray.200" borderRadius="8px" alignItems="center" gap={4} bg="white" shadow="sm">
                                    {item.imageUrl && (
                                        <img 
                                            src={item.imageUrl.replace('https://cdn.sanity.io', '/mobify/proxy/sanity-images')} 
                                            alt={item.title} 
                                            style={{width: '90px', height: '90px', objectFit: 'contain'}} 
                                        />
                                    )}
                                    <Box flex="1">
                                        <Heading size="sm" color="gray.900" mb={1}>{item.title}</Heading>
                                        <Text fontSize="sm" color="gray.500" mb={2}>Price: £{item.resolvedPrice.toFixed(2)} each</Text>
                                        
                                        {/* Quantity Stepper */}
                                        <Flex align="center" gap={2}>
                                            <Button size="xs" onClick={() => updateQuantity(idx, -1)}>-</Button>
                                            <Text fontSize="sm" fontWeight="bold" px={2}>{item.quantity}</Text>
                                            <Button size="xs" onClick={() => updateQuantity(idx, 1)}>+</Button>
                                        </Flex>
                                    </Box>

                                    <Box textAlign="right">
                                        <Text fontSize="md" fontWeight="bold" color="gray.900" mb={2}>
                                            £{(item.resolvedPrice * item.quantity).toFixed(2)}
                                        </Text>
                                        <Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleRemove(idx)}>
                                            Remove
                                        </Button>
                                    </Box>
                                </Flex>
                            ))}
                        </Box>

                        {/* Order Summary Sidebar */}
                        <Box flex="1" w="full" bg="gray.50" p={6} borderRadius="8px" border="1px solid" borderColor="gray.200">
                            <Heading size="md" mb={4} color="gray.900">Order Summary</Heading>
                            <Flex justify="space-between" mb={2}>
                                <Text color="gray.600">Subtotal</Text>
                                <Text fontWeight="semibold">£{subtotal.toFixed(2)}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={2}>
                                <Text color="gray.600">Delivery / Collection</Text>
                                <Text fontWeight="semibold" color="green.600">FREE (Demo Slot)</Text>
                            </Flex>
                            <Divider my={4} />
                            <Flex justify="space-between" mb={6}>
                                <Text fontSize="lg" fontWeight="bold">Total</Text>
                                <Text fontSize="lg" fontWeight="bold" color="#00a1de">£{subtotal.toFixed(2)}</Text>
                            </Flex>
                            <Button as="a" href="/checkout" bg="#00a1de" color="white" w="full" size="lg" fontWeight="bold" _hover={{bg: '#008bbd'}} textAlign="center">
                                Secure Checkout ›
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