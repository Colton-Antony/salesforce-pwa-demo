/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, Button, Heading, Text, Flex} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'

const CheckoutPage = () => {
    return (
        <Box bg="white" minH="100vh" py={12}>
            <Seo title="Secure Checkout - ASDA Groceries" description="Complete your ASDA order." />
            <Box maxW="600px" mx="auto" px={4} textAlign="center" bg="gray.50" p={8} borderRadius="8px" border="1px solid" borderColor="gray.200">
                <Box bg="#78be20" color="white" w="60px" h="60px" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={4} fontSize="2xl">
                    ✓
                </Box>
                <Heading size="xl" mb={3} color="gray.900">Secure Checkout Demo</Heading>
                <Text color="gray.600" mb={6}>
                    Your headless PWA Kit architecture successfully routed through the proxy, managed local cart state, and arrived at checkout! In a full enterprise integration, this connects directly to Salesforce Commerce Cloud OMS and payment gateways.
                </Text>
                <Button as="a" href="/" bg="#78be20" color="white" size="lg" fontWeight="bold" _hover={{bg: '#6aa61b'}}>
                    Return to ASDA Groceries Home ›
                </Button>
            </Box>
        </Box>
    )
}

CheckoutPage.getTemplateName = () => 'checkout'
export default CheckoutPage