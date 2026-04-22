import { useAuthStore } from '@/stores/useAuthStore'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Album, Music } from 'lucide-react'
import SongsTabContent from './components/SongsTabContent'
import AlbumsTabContent from './components/AlbumsTabContent'
import { useEffect } from 'react'
import { useMusicStore } from '@/stores/useMusicStore'
import { Loader } from 'lucide-react'

const AdminPage = () => {
    const { isAdmin, isLoading, hasCheckedAdmin, checkAdminStatus } = useAuthStore()
    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore()

    useEffect(() => {
        if (!hasCheckedAdmin && !isLoading) {
            checkAdminStatus()
        }
    }, [checkAdminStatus, hasCheckedAdmin, isLoading])

    useEffect(() => {
        if (!isAdmin) {
            return
        }

        fetchAlbums()
        fetchSongs()
        fetchStats()
    }, [fetchAlbums, fetchSongs, fetchStats, isAdmin])

    if (isLoading || !hasCheckedAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100">
                <Loader className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAdmin) return <div>Unauthorized</div>

    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-8 text-zinc-100 p-8">
            <Header />

            <DashboardStats />

            <Tabs defaultValue="songs" className="space-y-6">
                <TabsList className="bg-zinc-800/50 p-1">
                    <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-800">
                        <Music className="mr-2 size-4" />
                        Songs
                    </TabsTrigger>

                    <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-800">
                        <Album className="mr-2 size-4" />
                        Albums
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="songs">
                    <SongsTabContent />
                </TabsContent>

                <TabsContent value="albums">
                    <AlbumsTabContent />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminPage
