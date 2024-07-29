'use client';
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/src/types';
import TurndownService from "turndown";

export function useHTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const turndownService = new TurndownService();

  // Add rules to handle specific HTML elements or attributes
  turndownService.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node, options) {
      const hLevel = +node.nodeName.charAt(1);
      const hPrefix = "#".repeat(hLevel);
      return `\n\n${hPrefix} ${content}\n\n`;
    },
  });

  turndownService.addRule("paragraph", {
    filter: "p",
    replacement: function (content) {
      return `\n\n${content}\n\n`;
    },
  });

  useEffect(() => {
    if (html) {
      setMarkdown(turndownService.turndown(html));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  const updateHtml = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  return { markdown, updateHtml };
}
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

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        const data = await response.json()
        setPost(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const refreshPost = () => {
    setLoading(true)
    router.refresh()
  }

  return { post, loading, error, refreshPost }
}