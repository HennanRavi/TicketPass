import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bookmark } from "lucide-react";

export default function SaveSearchDialog({ open, onOpenChange, onSave, currentFilters }) {
  const [searchName, setSearchName] = useState("");

  const handleSave = () => {
    if (searchName.trim()) {
      onSave(searchName.trim());
      setSearchName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            Salvar Busca
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="searchName">Nome da Busca</Label>
            <Input
              id="searchName"
              placeholder="Ex: Shows em São Paulo"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              className="mt-2"
              autoFocus
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Filtros atuais:</p>
            <div className="space-y-1 text-xs text-gray-600">
              {currentFilters.searchTerm && (
                <p>• Termo: "{currentFilters.searchTerm}"</p>
              )}
              {currentFilters.state && currentFilters.state !== "all" && (
                <p>• Estado: {currentFilters.state}</p>
              )}
              {currentFilters.city && currentFilters.city !== "all" && (
                <p>• Cidade: {currentFilters.city}</p>
              )}
              {currentFilters.category && currentFilters.category !== "all" && (
                <p>• Categoria: {currentFilters.category}</p>
              )}
              {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 1000) && (
                <p>
                  • Preço: R$ {currentFilters.priceRange[0]} - R${" "}
                  {currentFilters.priceRange[1]}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!searchName.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}