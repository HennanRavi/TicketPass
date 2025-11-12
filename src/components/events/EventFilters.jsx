import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, MapPin, Bookmark, Navigation } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const states = [
  { uf: "all", name: "Todos os Estados" },
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
  { value: "all", label: "Todas as Categorias" },
  { value: "show", label: "Shows" },
  { value: "teatro", label: "Teatro" },
  { value: "esporte", label: "Esporte" },
  { value: "festival", label: "Festivais" },
  { value: "conferencia", label: "Conferências" },
  { value: "workshop", label: "Workshops" },
  { value: "outro", label: "Outro" },
];

export default function EventFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  availableCities,
  onSaveSearch,
  userLocation
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const activeFiltersCount = [
    filters.state !== "all",
    filters.city !== "all",
    filters.category !== "all",
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
    filters.startDate || filters.endDate,
    filters.sortByProximity,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="w-3.5 h-3.5" />
          Filtros Avançados
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 bg-blue-600 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {onSaveSearch && activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            className="gap-2"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Salvar Busca
          </Button>
        )}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Available Cities Display */}
      {filters.state !== "all" && availableCities.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600">Cidades disponíveis:</span>
          {availableCities.map((city) => (
            <Button
              key={city}
              variant={filters.city === city ? "default" : "outline"}
              size="sm"
              className={
                filters.city === city
                  ? "bg-green-600 hover:bg-green-700 text-xs h-7"
                  : "text-xs h-7"
              }
              onClick={() => onFilterChange({ city: city })}
            >
              {city}
            </Button>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* State Filter */}
              <div>
                <Label className="mb-1.5 block text-sm">Estado</Label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => onFilterChange({ state: value, city: "all" })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.uf} value={state.uf} className="text-sm">
                        {state.name} {state.uf !== "all" && `(${state.uf})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div>
                <Label className="mb-1.5 block text-sm">Cidade</Label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => onFilterChange({ city: value })}
                  disabled={filters.state === "all" || availableCities.length === 0}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={
                      filters.state === "all" 
                        ? "Selecione um estado primeiro" 
                        : availableCities.length === 0
                        ? "Nenhuma cidade disponível"
                        : "Todas as Cidades"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">Todas as Cidades</SelectItem>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city} className="text-sm">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <Label className="mb-1.5 block text-sm">Categoria</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => onFilterChange({ category: value })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-sm">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="mb-3 block text-sm">
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

              {/* Date Range Filters */}
              <div>
                <Label className="mb-1.5 block text-sm">Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-9 text-sm"
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {filters.startDate ? (
                        format(filters.startDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => onFilterChange({ startDate: date })}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm">Data de Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-9 text-sm"
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {filters.endDate ? (
                        format(filters.endDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => onFilterChange({ endDate: date })}
                      initialFocus
                      locale={ptBR}
                      disabled={(date) => 
                        filters.startDate ? date < filters.startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {(filters.startDate || filters.endDate) && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 text-sm"
                    onClick={() => onFilterChange({ startDate: null, endDate: null })}
                  >
                    <X className="w-3.5 h-3.5 mr-2" />
                    Limpar Datas
                  </Button>
                </div>
              )}

              {/* Proximity Sort */}
              {userLocation && (
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-900">
                          Ordenar por Proximidade
                        </Label>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Mostrar eventos mais próximos da sua localização
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={filters.sortByProximity}
                      onCheckedChange={(checked) => 
                        onFilterChange({ sortByProximity: checked })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Filtros ativos:</p>
                <div className="flex flex-wrap gap-1.5">
                  {filters.state !== "all" && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Estado: {states.find(s => s.uf === filters.state)?.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ state: "all", city: "all" })}
                      />
                    </Badge>
                  )}
                  {filters.city !== "all" && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Cidade: {filters.city}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ city: "all" })}
                      />
                    </Badge>
                  )}
                  {filters.category !== "all" && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Categoria: {categories.find(c => c.value === filters.category)?.label}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ category: "all" })}
                      />
                    </Badge>
                  )}
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ priceRange: [0, 1000] })}
                      />
                    </Badge>
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Datas: {filters.startDate && format(filters.startDate, "dd/MM")} 
                      {filters.startDate && filters.endDate && " - "}
                      {filters.endDate && format(filters.endDate, "dd/MM")}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ startDate: null, endDate: null })}
                      />
                    </Badge>
                  )}
                  {filters.sortByProximity && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Ordenando por proximidade
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => onFilterChange({ sortByProximity: false })}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}