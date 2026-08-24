import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'ogtlyxao',
  dataset: 'production',
  apiVersion: '2024-01-01', // use a recent API version date
  useCdn: true, // set to true for faster response via CDN, or false for fresh data
})

// Helper function to fetch all your Rollback offers
export async function getRollbackOffers() {
  const query = `*[_type == "rollbackOffer"]{
    _id,
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    oldPrice,
    newPrice,
    badgeText,
    ctaText
  }`
  
  return await sanityClient.fetch(query)
}