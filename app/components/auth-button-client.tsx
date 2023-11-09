'use client';

import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

const AuthButtonClient = ({ session }: { session: Session | null}) => {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    // Login
    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
    };

    // Logout
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    // const [session, setSession] = useState();

    // useEffect(() => {
    //     const getSession = async () => {
    //         const { data } = await supabase.auth.getSession();
    //         setSession(data.session);
    //     }
    //     getSession();
    // }, [])

    return session ? (
        <button className="text-xs text-gray-400" onClick={handleSignOut}>Logout</button>
     ) : (
        <button className="text-xs text-gray-400" onClick={handleSignIn}>Login</button>
     )
}

export default AuthButtonClient;