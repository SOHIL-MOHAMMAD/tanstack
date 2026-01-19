// client side components
'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Matches the server logic exactly
 async function getPost(){
  const {data} = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data
 }

 
 const Post1 = () => {

    const {data,isLoading, isError} = useQuery({
      queryKey : ['posts'],
      queryFn : getPost
    })

    if(isLoading) return <p> Loading...</p>
    if(isError) return <div>Error loading Post</div>

  return (
     <div>
       <ul>
        {data.map((post : any)=>(
          <li key={post.id}>{post.title}</li>
        ))}
       </ul>
     </div>
   )
 }
 
 export default Post1
 

//  useQuery is the main hook you use in your components to read data.

// Think of it as an smart auto-updating variable. Instead of manually telling React "fetch this, then wait, then save it to state," you just ask useQuery for the data, and it handles the rest.

// The Basic Syntax
// It takes two main arguments:

// TypeScript

// const info = useQuery({
//   queryKey: ['unique-id'], // 1. The ID
//   queryFn: fetchFunction,  // 2. The Fetcher
// })
// 1. queryKey (The ID Card)
// This is an array, like ['posts'] or ['user', 1].

// React Query uses this ID to save the data in the cache.

// If you use ['posts'] in 5 different components, useQuery will not fetch 5 times. It will fetch once and share the result with all of them.

// 2. queryFn (The Worker)
// This is the function that actually goes to the internet to get data (using axios or fetch). It must return a Promise (async function).
// +1

// What it returns (The Result)
// The hook returns an object with everything you need. You usually "destructure" it like this:

// TypeScript

// const { data, isLoading, isError, error } = useQuery({ ... })

// Property	          What it means
// data	              The actual data from your API. (It is undefined while loading).
// isLoading	        true if this is the first time we are fetching and we have no data yet.
// isError	          true if the fetch failed (e.g., 404, 500, or network down).
// error	            The actual error message (so you can show "Failed to load").


// Why is this better than useEffect?

// If you wrote this with useEffect, you would need to write code to:

// Set loading to true.
// Fetch data.
// Set loading to false.
// Catch errors.
// The Magic Part: If the user clicks away and comes back, useEffect runs again (slow). useQuery shows the data instantly from cache and updates it in the background silently.