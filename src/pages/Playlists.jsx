import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ListPlus, Sparkles, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PlaylistCard from "../components/playlists/PlaylistCard";
import CreatePlaylistDialog from "../components/playlists/CreatePlaylistDialog";

export default function Playlists() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: myPlaylists = [], isLoading: loadingMine } = useQuery({
    queryKey: ["my-playlists", user?.id],
    queryFn: () => base44.entities.EventPlaylist.filter({ user_id: user.id }, "-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const { data: publicPlaylists = [], isLoading: loadingPublic } = useQuery({
    queryKey: ["public-playlists"],
    queryFn: () => base44.entities.EventPlaylist.filter({ is_public: true }, "-likes_count"),
    initialData: [],
  });

  const { data: myLikes = [] } = useQuery({
    queryKey: ["my-playlist-likes", user?.id],
    queryFn: () => base44.entities.PlaylistLike.filter({ user_id: user.id }),
    enabled: !!user,
    initialData: [],
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (playlistData) => base44.entities.EventPlaylist.create({
      ...playlistData,
      user_id: user.id,
      user_name: user.display_name || user.full_name,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-playlists", user?.id] });
      toast.success("Playlist criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar playlist");
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (playlistId) => {
      const existingLike = myLikes.find(like => like.playlist_id === playlistId);
      
      if (existingLike) {
        await base44.entities.PlaylistLike.delete(existingLike.id);
        const playlist = publicPlaylists.find(p => p.id === playlistId);
        if (playlist) {
          await base44.entities.EventPlaylist.update(playlistId, {
            likes_count: Math.max(0, (playlist.likes_count || 0) - 1)
          });
        }
        return { action: 'unlike' };
      } else {
        await base44.entities.PlaylistLike.create({
          playlist_id: playlistId,
          user_id: user.id,
          user_name: user.display_name || user.full_name,
        });
        const playlist = publicPlaylists.find(p => p.id === playlistId);
        if (playlist) {
          await base44.entities.EventPlaylist.update(playlistId, {
            likes_count: (playlist.likes_count || 0) + 1
          });
        }
        return { action: 'like' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["my-playlist-likes", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["public-playlists"] });
      toast.success(result.action === 'like' ? "Playlist curtida!" : "Curtida removida");
    },
  });

  const handleCreatePlaylist = (data) => {
    createPlaylistMutation.mutate(data);
  };

  const handleToggleLike = (playlistId) => {
    toggleLikeMutation.mutate(playlistId);
  };

  const likedPlaylistIds = myLikes.map(like => like.playlist_id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-shadow-strong">
                Minhas Playlists
              </h1>
              <p className="text-lg text-white/95 text-shadow-medium">
                Organize seus eventos favoritos em coleções personalizadas
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 shadow-lg"
            >
              <ListPlus className="w-5 h-5 mr-2" />
              Nova Playlist
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="mine" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 dark:bg-gray-800">
            <TabsTrigger value="mine" className="gap-2 dark:data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4" />
              Minhas Playlists ({myPlaylists.length})
            </TabsTrigger>
            <TabsTrigger value="explore" className="gap-2 dark:data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4" />
              Explorar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="space-y-6">
            {loadingMine ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : myPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListPlus className="w-10 h-10 text-blue-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma playlist ainda
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Crie sua primeira playlist para organizar seus eventos favoritos
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  <ListPlus className="w-4 h-4 mr-2" />
                  Criar Primeira Playlist
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            {loadingPublic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : publicPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onLike={handleToggleLike}
                    isLiked={likedPlaylistIds.includes(playlist.id)}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-blue-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma playlist pública ainda
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Seja o primeiro a criar e compartilhar uma playlist pública!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreatePlaylistDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleCreatePlaylist}
      />
    </div>
  );
}