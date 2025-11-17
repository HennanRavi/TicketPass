import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Lock, Globe, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PlaylistCard({ playlist, onLike, isLiked, currentUserId }) {
  const navigate = useNavigate();
  const isOwner = playlist.user_id === currentUserId;

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all dark:bg-gray-800 border-none"
      onClick={() => navigate(`${createPageUrl("PlaylistDetails")}?id=${playlist.id}`)}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-purple-700 dark:to-purple-900">
        {playlist.cover_image ? (
          <img
            src={playlist.cover_image}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Privacy Badge */}
        <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border-none">
          {playlist.is_public ? (
            <>
              <Globe className="w-3 h-3 mr-1" />
              Pública
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 mr-1" />
              Privada
            </>
          )}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {playlist.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{playlist.user_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{playlist.event_ids?.length || 0} eventos</span>
            </div>
          </div>

          {!isOwner && (
            <Button
              size="sm"
              variant={isLiked ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                onLike(playlist.id);
              }}
              className={isLiked ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" : "dark:border-gray-600"}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {playlist.likes_count || 0}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}