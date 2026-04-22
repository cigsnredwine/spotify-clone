import Topbar from "@/components/ui/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import LyreLogo from "@/components/ui/LyreLogo";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { currentUser, sessionUser, isAuthenticated } = useAuthStore();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	useEffect(() => {
		if (isAuthenticated) fetchUsers();
	}, [fetchUsers, isAuthenticated]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.authUserId);
	}, [selectedUser, fetchMessages]);

	return (
		<main className='h-full overflow-hidden rounded-xl border border-white/8 bg-black/30 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.12)]'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4'>
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex items-start gap-3 ${
												message.senderId === currentUser?.authUserId ? "flex-row-reverse" : ""
											}`}
										>
											<Avatar className='size-8'>
												<AvatarImage
													src={
														message.senderId === currentUser?.authUserId
															? currentUser.imageUrl || sessionUser?.image || ""
															: selectedUser.imageUrl
													}
												/>
												<AvatarFallback>
													{message.senderId === currentUser?.authUserId
														? currentUser?.fullName?.[0] || sessionUser?.name?.[0] || "Y"
														: selectedUser.fullName[0]}
												</AvatarFallback>
											</Avatar>

											<div
												className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === currentUser?.authUserId ? "bg-primary text-primary-foreground" : "bg-zinc-800"}
												`}
											>
												<p className='text-sm'>{message.content}</p>
												<span className='text-xs text-zinc-300 mt-1 block'>
													{formatTime(message.createdAt)}
												</span>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<LyreLogo markClassName='size-16 text-[3.5rem]' />
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);
