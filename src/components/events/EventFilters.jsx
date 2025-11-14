import React from "react";
import { MapPin, Tag, DollarSign, Calendar as CalendarIcon, Navigation, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const states = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];

const categories = [
  { value: "show", label: "Show" },
  { value: "teatro", label: "Teatro" },
  { value: "esporte", label: "Esporte" },
  { value: "festival", label: "Festival" },
  { value: "conferencia", label: "Conferência" },
  { value: "workshop", label: "Workshop" },
  { value: "outro", label: "Outro" },
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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Estado
          </label>
          <Select
            value={filters.state}
            onValueChange={(value) => {
              onFilterChange({ state: value, city: "all" });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              {states.map((state) => (
                <SelectItem key={state.uf} value={state.uf}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Cidade
          </label>
          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange({ city: value })}
            disabled={filters.state === "all"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Cidades</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 text-purple-600" />
            Categoria
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="w-4 h-4 text-orange-600" />
            Data Inicial
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {filters.startDate
                  ? format(filters.startDate, "dd 'de' MMMM", { locale: ptBR })
                  : "Selecione..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => onFilterChange({ startDate: date })}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <DollarSign className="w-4 h-4 text-green-600" />
          Faixa de Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1] === 1000 ? "1000+" : filters.priceRange[1]}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange({ priceRange: value })}
          max={1000}
          step={10}
          className="w-full"
        />
      </div>

      {/* Additional Options */}
      <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-200">
        {userLocation && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.sortByProximity}
              onChange={(e) => onFilterChange({ sortByProximity: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">Ordenar por proximidade</span>
          </label>
        )}

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            className="gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Salvar Busca
          </Button>
        </div>
      </div>
    </div>
  );
}