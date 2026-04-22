import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

interface AlbumsTabContentProps {
	canDelete?: boolean;
	uploadEndpoint?: string;
	onUploadSuccess?: () => Promise<void> | void;
}

const AlbumsTabContent = ({
	canDelete = true,
	uploadEndpoint = "/admin/albums",
	onUploadSuccess,
}: AlbumsTabContentProps) => {
	return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-primary' />
							Albums Library
						</CardTitle>
						<CardDescription>Manage your album collection</CardDescription>
					</div>
					<AddAlbumDialog endpoint={uploadEndpoint} onSuccess={onUploadSuccess} />
				</div>
			</CardHeader>

			<CardContent>
				<AlbumsTable canDelete={canDelete} />
			</CardContent>
		</Card>
	);
};
export default AlbumsTabContent;
