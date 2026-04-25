export type MessageKind = "narration" | "character" | "user" | "system";

export type StoryStatus = "draft" | "active" | "published";

export type Story = {
  id: string;
  title: string;
  genre: string;
  format: string;
  chapter: number;
  progress: number;
  status: StoryStatus;
  summary: string;
  mood: string;
};

export type WorldLore = {
  id: string;
  name: string;
  storyTitle: string;
  atmosphere: string;
  description: string;
  rules: string[];
  locations: {
    name: string;
    type: string;
    description: string;
  }[];
};

export type Character = {
  id: string;
  name: string;
  role: string;
  traits: string[];
  description: string;
  storyTitle?: string;
  status?: string;
};

export type Template = {
  id: string;
  title: string;
  format: string;
  genre: string;
  description: string;
  setup: string[];
};

export type CommunityStory = Story & {
  author: string;
  likes: number;
  saves: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  text: string;
  time: string;
};

export type ChatMessage = {
  id: string;
  kind: MessageKind;
  author: string;
  content: string;
  timestamp: string;
};

export type OnboardingDraft = {
  genre: string;
  format: string;
  world: string;
  protagonist: string;
  userRole: string;
};

export type AiSceneResponse = {
  title: string;
  world: string;
  characters: Character[];
  openingScene: string;
  suggestions: string[];
};
