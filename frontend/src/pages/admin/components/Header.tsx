import { UserButton } from "@clerk/react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header = ({
  title = "Music Manager",
  description = "Manage your music library",
}: HeaderProps) => {
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
      <UserButton />
    </div>
  )
}

export default Header;
