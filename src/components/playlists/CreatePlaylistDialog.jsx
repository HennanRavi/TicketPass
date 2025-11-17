import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ListPlus } from "lucide-react";

export default function CreatePlaylistDialog({ open, onOpenChange, onSave, initialEventId = null }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      description: description.trim(),
      is_public: isPublic,
      event_ids: initialEventId ? [initialEventId] : [],
    });
    
    // Reset form
    setName("");
    setDescription("");
    setIsPublic(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <ListPlus className="w-5 h-5" />
            Nova Playlist de Eventos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-300">Nome da Playlist</Label>
            <Input
              id="name"
              placeholder="Ex: Festivais de Verão 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-gray-300">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua playlist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="public" className="dark:text-gray-300">Playlist Pública</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Outros usuários poderão ver e curtir esta playlist
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-600 dark:text-gray-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            Criar Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}