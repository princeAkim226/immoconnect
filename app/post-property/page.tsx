'use client'

import dynamic from 'next/dynamic'

const PostPropertyForm = dynamic(
  () => import('@/components/properties/post-property-form').then(mod => mod.PostPropertyForm),
  { ssr: false }
)

export default function PostPropertyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Publier une propriété</h1>
        <PostPropertyForm />
      </div>
    </div>
  )
}