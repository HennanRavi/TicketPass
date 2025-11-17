import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarIcon, MapPin, X, Save, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const brazilianStates = [
  { value: "all", label: "Todos os Estados" },
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const categories = [
  { value: "all", label: "Todas as Categorias" },
  { value: "show", label: "🎤 Show" },
  { value: "teatro", label: "🎭 Teatro" },
  { value: "esporte", label: "⚽ Esporte" },
  { value: "festival", label: "🎪 Festival" },
  { value: "conferencia", label: "📊 Conferência" },
  { value: "workshop", label: "🛠️ Workshop" },
  { value: "outro", label: "📌 Outro" },
];

export default function EventFilters({
  filters,
  onFilterChange,
  onClearFilters,
  availableCities,
  onSaveSearch,
  userLocation,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* State Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 inline mr-1" />
            Estado
          </Label>
          <Select value={filters.state} onValueChange={(value) => onFilterChange({ state: value, city: "all" })}>
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              {brazilianStates.map((state) => (
                <SelectItem 
                  key={state.value} 
                  value={state.value}
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Cidade</Label>
          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange({ city: value })}
            disabled={filters.state === "all" || availableCities.length === 0}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                Todas as Cidades
              </SelectItem>
              {availableCities.map((city) => (
                <SelectItem 
                  key={city} 
                  value={city}
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Categoria</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange({ category: value })}>
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              {categories.map((cat) => (
                <SelectItem 
                  key={cat.value} 
                  value={cat.value}
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Data Inicial</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => onFilterChange({ startDate: date })}
                className="dark:text-gray-100"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Data Final</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => onFilterChange({ endDate: date })}
                className="dark:text-gray-100"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Ordenar Por
          </Label>
          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ sortBy: value })}>
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectItem value="date" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                📅 Data
              </SelectItem>
              <SelectItem value="rating" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                ⭐ Avaliação
              </SelectItem>
              <SelectItem value="price_low" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                💰 Preço (Menor)
              </SelectItem>
              <SelectItem value="price_high" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                💎 Preço (Maior)
              </SelectItem>
              <SelectItem value="popularity" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                🔥 Popularidade
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
          Faixa de Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1] === 1000 ? "1000+" : filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange({ priceRange: value })}
          max={1000}
          step={10}
          className="mt-2"
        />
      </div>

      {/* Sort by Proximity */}
      {userLocation && (
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.sortByProximity}
              onChange={(e) => onFilterChange({ sortByProximity: e.target.checked })}
              className="w-4 h-4 text-blue-600 dark:text-purple-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              📍 Ordenar por proximidade
            </span>
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
        <Button
          onClick={onSaveSearch}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Busca
        </Button>
      </div>
    </div>
  );
}