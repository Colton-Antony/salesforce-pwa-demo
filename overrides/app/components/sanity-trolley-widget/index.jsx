/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useState, useEffect, useRef} from 'react'
import {Box, Button, Text, Heading} from '@salesforce/retail-react-app/app/components/shared/ui'

const SanityTrolleyWidget = () => {
    const [cart, setCart] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const updateCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('asda_sanity_cart') || '[]')
        setCart(storedCart)
    }

    useEffect(() => {
        updateCart()
        window.addEventListener('sanity-cart-updated', updateCart)
        window.addEventListener('storage', updateCart)

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            window.removeEventListener('sanity-cart-updated', updateCart)
            window.removeEventListener('storage', updateCart)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.newPrice ?? item.price ?? 0)
        return acc + (price * (item.quantity || 1))
    }, 0)

    return (
        <Box position="relative" ref={dropdownRef} display="inline-block">
            {/* Header Trolley Button matching Asda style */}
            <Box 
                as="button"
                onClick={() => setIsOpen(!isOpen)}
                display="flex"
                alignItems="center"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="6px"
                px={3}
                py={1.5}
                gap={2}
                cursor="pointer"
                _hover={{borderColor: 'gray.400'}}
            >
                <Box position="relative">
                    <span style={{fontSize: '20px'}}>🛒</span>
                    {itemCount > 0 && (
                        <Box 
                            position="absolute" 
                            top="-8px" 
                            right="-10px" 
                            bg="#e53e3e" 
                            color="white" 
                            borderRadius="full" 
                            w="18px" 
                            h="18px" 
                            fontSize="10px" 
                            fontWeight="bold" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                        >
                            {itemCount}
                        </Box>
                    )}
                </Box>
                <Text fontWeight="bold" fontSize="sm" color="gray.800">
                    £{subtotal.toFixed(2)}
                </Text>
            </Box>

            {/* Dropdown Popover */}
            {isOpen && (
                <Box 
                    position="absolute" 
                    right={0} 
                    mt={2} 
                    w="340px" 
                    bg="white" 
                    boxShadow="lg" 
                    borderRadius="8px" 
                    border="1px solid" 
                    borderColor="gray.200" 
                    zIndex={1000}
                    overflow="hidden"
                >
                    <Box p={4} borderBottom="1px solid" borderColor="gray.100" display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="sm" color="gray.900">🛒 Your trolley</Heading>
                        <Box as="button" onClick={() => setIsOpen(false)} fontSize="lg" color="gray.500" _hover={{color: 'gray.800'}}>✕</Box>
                    </Box>

                    <Box p={4} borderBottom="1px solid" borderColor="gray.100">
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Text fontSize="sm" color="gray.600">{itemCount} item subtotal</Text>
                            <Text fontSize="sm" fontWeight="semibold">£{subtotal.toFixed(2)}</Text>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Text fontSize="md" fontWeight="bold" color="gray.900">Total</Text>
                            <Text fontSize="md" fontWeight="bold" color="gray.900">£{subtotal.toFixed(2)}</Text>
                        </Box>
                    </Box>

                    <Box p={4} bg="gray.50" display="flex" flexDirection="column" gap={2}>
                        <Button 
                            as="a"
                            href="/cart"
                            variant="outline" 
                            borderColor="#78be20" 
                            color="#78be20" 
                            w="full" 
                            size="sm"
                            fontWeight="bold"
                            textAlign="center"
                            _hover={{bg: '#f4fce8', textDecoration: 'none'}}
                            onClick={() => setIsOpen(false)}
                        >
                            View full trolley
                        </Button>
                        <Button 
                            as="a"
                            href="/checkout"
                            bg="#00a1de" 
                            color="white" 
                            w="full" 
                            size="sm"
                            fontWeight="bold"
                            textAlign="center"
                            _hover={{bg: '#008bbd', textDecoration: 'none'}}
                            onClick={() => setIsOpen(false)}
                        >
                            Checkout
                        </Button>
                    </Box>

                    <Box p={4} borderTop="1px solid" borderColor="gray.200">
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <span style={{fontSize: '16px'}}>📅</span>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">No slot booked</Text>
                        </Box>
                        <Text fontSize="xs" color="gray.600" mb={3}>
                            Please book a Home delivery or a Click & Collect slot in order to checkout
                        </Text>
                        <Box display="flex" gap={2}>
                            <Button size="xs" variant="outline" borderColor="#78be20" color="#78be20" flex="1" fontWeight="bold">
                                Home delivery
                            </Button>
                            <Button size="xs" variant="outline" borderColor="#78be20" color="#78be20" flex="1" fontWeight="bold">
                                Click & Collect
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default SanityTrolleyWidget