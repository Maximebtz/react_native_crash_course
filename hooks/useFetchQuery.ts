import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const endPoint = 'https://pokeapi.co/api/v2';

type API = {
    "/pokemon?limit=21": {
        count: number,
        next: string | null,
        previous: string,
        results: {
            name: string,
            url: string
        }[]
    }
}

export function useFetchQuery<T extends keyof API>(path: T) {
    return useQuery({
        queryKey: [path],
        queryFn: async () => {
            wait(1)
            return fetch(endPoint + path, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(res => res.json() as Promise<API[T]>)
        }
    })
}

export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endPoint + path,
        queryFn: async ({pageParam}) => {
            await wait(1)
            return fetch(pageParam, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(res => res.json() as Promise<API[T]>)
        },
        getNextPageParam: (lastPage) => {
            if ("next" in lastPage) {
                return lastPage.next
            }
            return null
        }
    })
}

function wait(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
}