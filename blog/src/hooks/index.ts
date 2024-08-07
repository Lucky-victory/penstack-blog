import {  usePathname, useSearchParams } from 'next/navigation';
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/src/types';
import TurndownService from "turndown";
import { useMutation } from '@tanstack/react-query';

export type SaveableValue = string | Record<string, any>;

export interface UseAutoSaveOptions<T extends SaveableValue> {
  initialValue: T;
  mutationFn: (value: T) => Promise<any>;
  debounceTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAutoSave = <T extends SaveableValue>({
  initialValue,
  mutationFn,
  debounceTime = 1000,
  onSuccess,
  onError
}: UseAutoSaveOptions<T>) => {
  const [value, setValue] = useState<T>(initialValue);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

 
  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      setLastSaved(new Date());
      onSuccess?.(data);
    },
    onError
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (newValue: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          mutation.mutate(newValue);
        }, debounceTime);
      };
    })(),
    [debounceTime]
  );

  useEffect(() => {
    debouncedSave(value);
  }, [value, debouncedSave]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | T
  ) => {
    if (typeof event === 'object' && 'target' in event) {
      const { name, value: inputValue } = event.target;
      setValue(prev => 
        typeof prev === 'object' 
          ? { ...prev, [name]: inputValue } 
          : inputValue as T
      );
    } else {
      setValue(prev => 
          typeof prev === 'object' && typeof event === 'object'
            ? { ...prev, ...(event as object) } 
            : event as T);
    }
  };

  return { 
    value, 
    onChange: handleChange, 
    isSaving: mutation.isPending,
    error: mutation.error,lastSaved
  };
};


export function useHTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const turndownService = useMemo(() => new TurndownService(), []);

  // Add rules to handle specific HTML elements or attributes
  useEffect(() => {
    turndownService.addRule("heading", {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      replacement: function (content, node, options) {
        const hLevel = +node.nodeName.charAt(1);
        const hPrefix = "#".repeat(hLevel);
        return `\n${hPrefix} ${content}\n`;
      },
    });

    turndownService.addRule("paragraph", {
      filter: "p",
      replacement: function (content) {
        return `\n${content}\n`;
      },
    });
  }, [turndownService]);

  useEffect(() => {
    if (html) {
      setMarkdown(turndownService.turndown(html));
    }
  }, [html, turndownService]);

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


export function useDebounce<T extends string | number | object>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}


type QueryParamValue = string | number | boolean | null;

interface QueryParams {
  [key: string]: QueryParamValue;
}

export function useQueryParams<T extends QueryParams>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryParamsValues, setQueryParamsValues] = useState<T>({} as T);

  // Parse search params into an object
  useEffect(() => {
    const params: QueryParams = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setQueryParamsValues(params as T);
  }, [searchParams]);

  // Update a single query parameter
  const setQueryParam = useCallback(
    (key: keyof T, value: QueryParamValue) => {
      const updatedParams = new URLSearchParams(searchParams.toString());

      if (value === null || value === '') {
        updatedParams.delete(key as string);
      } else {
        updatedParams.set(key as string, value.toString());
      }

      router.push(`${pathname}?${updatedParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Update multiple query parameters at once
  const setQueryParams = useCallback(
    (newParams: Partial<T>) => {
      const updatedParams = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value.toString());
        }
      });

      router.push(`${pathname}?${updatedParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Clear all query parameters
  const clearQueryParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { queryParams: queryParamsValues, setQueryParam, setQueryParams, clearQueryParams };
}