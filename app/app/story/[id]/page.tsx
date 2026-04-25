import { StoryChat } from "@/components/story-chat";

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryChat storyId={id} />;
}
