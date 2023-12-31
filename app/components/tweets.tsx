'use client';
import { useEffect } from "react";
import Likes from "./likes"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Router from "next/router";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { experimental_useOptimistic as useOptimistic } from 'react';


export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
    // const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
    //     tweets,
    //     (currentOptimisticTweets, newTweet) => {
    //         const newOptimisticTweets = [...currentOptimisticTweets]
    //         const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id)
    //         newOptimisticTweets[index] = newTweet
    //         return newOptimisticTweets;
    //     }
    // )
    const supabase = createClientComponentClient()
    const router = useRouter();
    useEffect(() => {
        const channel = supabase.channel('realtime tweets')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'tweets'
        }, (payload) => {
            router.refresh()
        })
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, router])

    return tweets.map((tweet) => (
        <div key={tweet.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
            <div className="h-12 w-12">
                <Image className="rounded-full" src={tweet.author.avatar_url} alt="tweet user avatar" width={48} height={48} />
                {/* <p>img</p> */}
            </div>
            <div className="ml-4">
                <p>
                    <span className="font-bold">{tweet.author.name}</span> 
                    <span className="text-small ml-2 text-gray-400">@{tweet.author.username}</span>
                </p>
                <p>{tweet.title}</p>
                <Likes tweet={tweet} />
            </div>
        </div>
      ))
};