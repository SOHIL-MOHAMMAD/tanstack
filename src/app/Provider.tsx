'use client';

import {QueryClientProvider , QueryClient} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

export default function Provider ({children}:{children : ReactNode}){
  const [queryClient] = useState(()=> new QueryClient({
    defaultOptions :{
      queries : {
        staleTime : 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}


// 1. What are these components?
// QueryClient (The Brain)

// Think of the QueryClient as the Database/Cache inside your browser.

// -> It is responsible for storing all the data you fetch from your API.

// -> It tracks the "state" of every request (is it loading? is it an error? is the data old?).

// -> In your code: new QueryClient(...) creates this brain. You configured it with staleTime: 60 * 1000 (1 minute). This tells the brain: "If data is less than 1 minute old, don't fetch it again; just show the cached version."

// QueryClientProvider (The Bridge)

// This is a wrapper component that uses React Context.

// -> It takes the QueryClient (the brain) and makes it available to every component inside your application.

// -> Without this provider, if you tried to use useQuery inside a page, React would say: "I don't know where to store this data."

// ReactQueryDevtools (The Debugger)

// This is a developer tool that appears as a small floating icon (usually a flower logo) in the bottom corner of your screen during development.

// -> It lets you see inside the brain. You can see what data is currently cached, force a re-fetch, or see if a query failed.

// -> It does not show up in production (when you deploy your site), so it's safe to leave it in the code.


// 2. The Main Question: Why do we do it this way?
// You might be wondering: Why do we use useState? Why can't we just write const queryClient = new QueryClient() at the top of the file?

// There are two very specific reasons for this pattern in Next.js:

// Reason A: Preventing Data Loss on Re-renders (The useState logic)
// In React, when a parent component updates or re-renders, all the variables inside it are re-created.

// The Wrong Way:

// TypeScript

// // ❌ BAD
// export default function Providers({ children }) {
//   // This creates a NEW cache every time this component renders!
//   // You will lose all your data constantly.
//   const queryClient = new QueryClient() 
//   return ...
// }
// The Right Way:

// TypeScript

// // ✅ GOOD
// export default function Providers({ children }) {
//   // This creates the client ONCE and keeps it in memory
//   // as long as the session is active.
//   const [queryClient] = useState(() => new QueryClient())
//   return ...
// }
// Using useState ensures the queryClient is stable. It is created the first time the app loads and stays the same even if React re-renders the component tree.

// Reason B: Preventing "Double Fetching" with SSR
// You noticed this config in your code:

// TypeScript

// staleTime: 60 * 1000, // 1 minute
// This is crucial for Next.js.

// Server: Next.js fetches data on the server and generates the HTML.

// Client: The browser loads the HTML (data is already there).

// Hydration: React Query starts up on the client.

// If staleTime is 0 (the default), React Query will look at the data that just arrived from the server, decide it is "stale" (old) immediately, and fetch it again in the background. This causes a double network request for no reason.

// By setting staleTime to 1 minute, you tell React Query: "The server just gave us this data, trust it for at least 1 minute before checking for updates."

//summary table
// Code,                      Purpose

// QueryClient,               The object that actually stores your data.
// QueryClientProvider,       Makes that storage available to your whole app.
// useState(() => ...),       Ensures you don't delete your cache every time React updates.
// staleTime: 60000,          Prevents the browser from re-fetching data immediately after the server already fetched it.