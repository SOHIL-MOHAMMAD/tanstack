// app/posts/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Post1 from './Post1'
import axios from 'axios' // 1. Import Axios

// 2. Updated fetch function
async function getPosts() {
  // Axios automatically throws an error if the status is not 2xx,
  // so you don't need the manual "if (!res.ok)" check.
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts')
  
  // Axios returns the API response in a .data property
  return data
}

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Post1 />
    </HydrationBoundary>
  )
}

// To understand dehydrate and HydrationBoundary, you first need to understand the problem they solve: How do we move data from the Server to the Client without losing it?

// When you fetch data on the server (in page.tsx), that data lives in the server's memory. When the HTML is sent to the user's browser, the browser starts fresh—it has no idea that you already fetched the data.

// If you don't "transfer" that data, the browser will see empty spots and start fetching everything again (showing loading spinners).

// Here is what these two specific tools do to fix that.

// 1. dehydrate (The Packer)
// Role: Takes the complex data cache and "packs" it into a simple format.

// Imagine your QueryClient on the server is like a complex filing cabinet full of open folders, network connections, and timers. You cannot send a filing cabinet over the internet.

// dehydrate takes a snapshot of that filing cabinet. It strips away all the complex stuff (timers, listeners) and leaves just the raw data (the JSON) in a format that is safe to send to the browser.

// Input: The active QueryClient (with fetched data).

// Output: A static JSON object (the "dehydrated state").

// 2. HydrationBoundary (The Unpacker)
// Role: Receives the packed data and "feeds" it to the Client Components inside it.

// This is a React component that acts like a specific zone where pre-filled data is available. When your Client Components (like <PostsList />) wake up inside this boundary, they look up and say, "Hey, is there any data for ['posts'] already here?"

// The HydrationBoundary says, "Yes, here is the data the server packed for you."

// Input: The state prop (which comes from dehydrate).

// Action: It initializes the client-side cache with this data immediately.

// The "Lunchbox" Analogy
// Think of your data like a hot lunch.

// Server (Mom/Dad): Cooks the lunch (prefetchQuery).

// dehydrate: Puts the lunch into a sealed lunchbox. Now it's portable and safe to travel.

// Network: The kid travels to school (the HTML travels to the browser).

// HydrationBoundary: This is the moment the kid opens the lunchbox at school.

// Client Component (The Kid): The kid wants to eat. Because the lunchbox (HydrationBoundary) is there, they can eat immediately. They don't have to wait for the cafeteria (API) to cook a new meal.

// Why do we need HydrationBoundary specifically?
// In older versions of React Query, we used to just pass data via props.

// Old Way: <PostsList posts={data} />

// New Way: <HydrationBoundary state={...}><PostsList /></HydrationBoundary>

// The HydrationBoundary approach is better because Prop Drilling is gone. You don't have to pass the data into PostsList. Inside PostsList, you just write:

// TypeScript

// // Even though this runs on the client, it finds the data 
// // instantly because of the HydrationBoundary wrapper!
// const { data } = useQuery({ queryKey: ['posts'] }) 
// This makes your Client Components cleaner because they don't need to know where the data came from (server or client); they just ask for it, and it's there.