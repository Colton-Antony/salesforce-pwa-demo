import React from 'react'
import { Box, Flex, Input, Link, Icon, Text } from '@salesforce/retail-react-app/app/components/shared/ui'
import { SearchIcon, UserIcon, CartIcon, WishlistIcon, StorefrontIcon } from '@salesforce/retail-react-app/app/components/icons'

const AsdaHeader = () => {
    return (
        <Box w="full" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
            {/* Top Announcement Bar */}
            <Box bg="#78be20" color="white" py={1.5} px={4} textAlign="center" fontSize="sm" fontWeight="bold">
                <Text>🌿 Welcome to Asda Groceries & Rollbacks — Delivered fresh to your door!</Text>
            </Box>

            {/* Main Header Bar */}
            <Flex 
                maxW="container.xl" 
                mx="auto" 
                px={4} 
                py={3} 
                alignItems="center" 
                justifyContent="space-between"
                gap={6}
            >
                {/* Asda Branding Logo */}
                <Link href="/" _hover={{ textDecoration: 'none' }}>
                    <Box 
                        bg="#78be20" 
                        color="white" 
                        px={4} 
                        py={2} 
                        borderRadius="md" 
                        fontWeight="black" 
                        fontSize="2xl"
                        letterSpacing="wider"
                        fontFamily="heading"
                    >
                        ASDA
                    </Box>
                </Link>

                {/* Search Bar */}
                <Flex flex={1} maxW="600px" position="relative" alignItems="center">
                    <Input 
                        placeholder="Search products, rollbacks and more..." 
                        borderRadius="full"
                        bg="gray.100"
                        border="2px solid transparent"
                        _focus={{ bg: 'white', borderColor: '#78be20', boxShadow: 'none' }}
                        py={5}
                        pl={4}
                        pr={10}
                    />
                    <Box position="absolute" right={4} color="gray.500">
                        <SearchIcon boxSize={5} />
                    </Box>
                </Flex>

                {/* Right Action Icons (Account, Wishlist, Store, Cart) */}
                <Flex alignItems="center" gap={6} color="gray.700">
                    <Link href="/account" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <UserIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Sign in</Text>
                    </Link>

                    <Link href="/stores" display="flex" flexDirection="column" alignItems="center" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <StorefrontIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Stores</Text>
                    </Link>

                    <Link href="/cart" display="flex" flexDirection="column" alignItems="center" position="relative" _hover={{ color: '#78be20', textDecoration: 'none' }}>
                        <CartIcon boxSize={6} />
                        <Text fontSize="xs" mt={1}>Trolley</Text>
                    </Link>
                </Flex>
            </Flex>

            {/* Sub-Navigation Links Bar */}
            <Box bg="#f8f9fa" borderTop="1px solid" borderColor="gray.200" px={4}>
                <Flex maxW="container.xl" mx="auto" py={2} gap={8} fontSize="sm" fontWeight="semibold" color="gray.700" overflowX="auto">
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>Groceries</Link>
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>Rollbacks</Link>
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>George Clothes</Link>
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>Baby & Toddler</Link>
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>Beer, Wine & Spirits</Link>
                    <Link href="/" _hover={{ color: '#78be20', textDecoration: 'none' }}>Offers</Link>
                </Flex>
            </Box>
        </Box>
    )
}

export default AsdaHeader