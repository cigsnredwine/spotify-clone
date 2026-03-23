import { Link } from "react-router-dom"
import { HomeIcon, MessageCircle, Library } from "lucide-react"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Show } from "@clerk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton  from "@/components/ui/skeletons/PlaylistSkeleton";


const LeftSidebar = () => {
  const isLoading = true;
  return <div className="h-full flex flex-col gap-2">
    {/* Navigation menu */}

    <div className="rounded-lg bg-zinc-900 p-4">
      <div className="space-y-2">
        <Link to="/"
        className={cn(buttonVariants({
          variant:"ghost",
          className:"w-full justify-start text-white hover:bg-zinc-800"
        }))}>
        <HomeIcon className="mr-2 size-5" />
        <span className="hidden md:inline">Home</span>
        </Link>

        <Show when="signed-in">  
          <Link to="/chat"
          className={cn(buttonVariants({
            variant:"ghost",
            className:"w-full justify-start text-white hover:bg-zinc-800"
          }))}>
          <MessageCircle className="mr-2 size-5" />
          <span className="hidden md:inline">Messages</span>
          </Link>
        </Show>
      </div>
    </div>
    {/* library section */}
    <div className="flex-1 rounded-lg bg-zinc-900 p-4"> 
      <div className="fex ites-center justify-between mb-4">
          <div className="flex iemms-center text-white px-2">
            <Library className='size-5 mr-2' />
            <span className="hidden md:inline">Playlists</span>
          </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2"> 
          {isLoading ? (
            <PlaylistSkeleton />
          ) : (
            "some music"
          )
          }
        </div>
      </ScrollArea>

    </div>

</div>
};

export default LeftSidebar