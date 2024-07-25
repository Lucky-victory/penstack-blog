'use client';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const refreshPosts = () => {
    setLoading(true)
    router.refresh()
  }

  return { posts, loading, error, refreshPosts }
}
