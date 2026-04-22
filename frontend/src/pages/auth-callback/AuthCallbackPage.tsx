import {Card, CardContent} from "@/components/ui/card.tsx"
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");
}, [navigate]);

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center">
            <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
                <CardContent className='flex flex-col items-center gap-4 pt-6'>
                <Loader className='size-6 text-blue-500 animate-spin' />
                <h3 className="text-zinc-400 text-x1 font-bold">
                    Logging you in
                </h3>
                <p className="text-zinc-400 text-sm">Redirecting...</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default AuthCallbackPage
