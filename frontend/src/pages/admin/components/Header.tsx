import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header = ({
  title = "Music Manager",
  description = "Manage your music library",
}: HeaderProps) => {
  const { sessionUser, reset } = useAuthStore();

  const handleSignOut = async () => {
    await authClient.signOut();
    reset();
  };

  return (
    <div className='mb-8 flex items-start justify-between gap-4'>
      <div className='flex items-center gap-3 mb-8'>
        <Link to='/' className='rounded-lg'>
          <img src='/spotify-512.png' alt='Spotify logo' className='size-10 text-black' />
        </Link>
      <div>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <p className='text-zinc-400 mt-1'>{description}</p>
      </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='text-right hidden sm:block'>
          <p className='text-sm font-medium'>{sessionUser?.name}</p>
          <p className='text-xs text-zinc-400'>{sessionUser?.email}</p>
        </div>
        <Button variant='outline' onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default Header;
