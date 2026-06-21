import React from "react";
import { Ionicons } from "@expo/vector-icons";

const MAP: Record<string, string> = {
  Home: "home-outline",
  Search: "search",
  Library: "library-outline",
  Bookmark: "bookmark-outline",
  User: "person-outline",
  Star: "star",
  ExternalLink: "open-outline",
  BookmarkPlus: "bookmark",
  Clock: "time-outline",
  FileText: "document-text-outline",
  Lightbulb: "bulb-outline",
  GitFork: "git-network-outline",
  Layers: "layers-outline",
  X: "close",
  Tag: "pricetag-outline",
  Download: "download-outline",
  Settings: "settings-outline",
  BookOpen: "book-outline",
  Trash2: "trash-outline",
};

export function createIcon(name: string) {
  return function Icon({ size = 24, color = "#000" }: { size?: number; color?: string }) {
    const ionName = MAP[name] || "help-circle-outline";
    return <Ionicons name={ionName as any} size={size} color={color} />;
  };
}
