import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Menu, RefreshCw } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useTables } from "@/hooks/useTables";
import Image from "next/image";

export default function TableStatus() {
  const { toggleSidebar } = useSidebar();
  const { tables, loading, error, refreshTables } = useTables();

  // Map backend status to display status
  const getDisplayStatus = (status: "libre" | "atendida" | "ocupada") => {
    switch (status) {
      case "libre":
        return "Libre";
      case "atendida":
        return "Servida";
      case "ocupada":
        return "Ocupada";
      default:
        return "Libre";
    }
  };

  // Sort tables by number in descending order (14 to 1) - toSorted() is immutable
  const sortedTables = tables.toSorted((a, b) => b.number - a.number);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Abrir menú de navegación"
            className="lg:hidden h-12 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <Card className="py-2 px-6 border-0 flex-1">
            <CardContent className="p-0">
              <div className="flex items-center justify-center h-16">
                <div className="text-lg text-gray-500">Cargando mesas…</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Abrir menú de navegación"
          className="lg:hidden h-12 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          <Menu className="h-6 w-6 text-gray-800" />
        </Button>

        <Card className="py-2 px-6 border-0 flex-1">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 items-center justify-center w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: "#d9d9d9" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Mesas Libres (
                    {tables.filter((t) => t.status === "libre").length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: "#ec3224" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Mesas Ocupadas (
                    {tables.filter((t) => t.status === "ocupada").length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: "#24ec24" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Mesas Atendidas (
                    {tables.filter((t) => t.status === "atendida").length})
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={refreshTables}
                aria-label="Actualizar estado de mesas"
                className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card
        className="p-6 border-0 h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] md:h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)]"
        style={{ borderRadius: "30px" }}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && tables.length < 14 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            ⚠️ Solo se encontraron {tables.length} mesas en la base de datos (se
            esperaban 14 mesas). Verifique que todas las mesas estén creadas en
            el sistema.
          </div>
        )}

        <CardContent className="px-0 pb-0 h-full overflow-y-auto">
          <div className="flex justify-between w-full px-6">
            <div className="flex flex-col gap-4 flex-1 items-center">
              {sortedTables.slice(0, 4).map((table, index) => {
                const displayStatus = getDisplayStatus(table.status);
                const getImageSrc = () => {
                  switch (table.status) {
                    case "libre":
                      return "/images/tables/tableFree.webp";
                    case "atendida":
                      return "/images/tables/tableServed.webp";
                    case "ocupada":
                      return "/images/tables/tableOccupied.webp";
                    default:
                      return "/images/tables/tableFree.webp";
                  }
                };

                return (
                  <div
                    key={table.id}
                    className="relative group"
                    style={{ width: "170px", height: "170px" }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${displayStatus}`}
                      width={170}
                      height={170}
                      className="transition-transform duration-200 object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {table.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 flex-1 items-center">
              {sortedTables.slice(4, 10).map((table, index) => {
                const displayStatus = getDisplayStatus(table.status);
                const getImageSrc = () => {
                  // In descending order: index 0=table 10, index 1=table 9, index 2=table 8, index 3=table 7, index 4=table 6, index 5=table 5
                  // Use small version for table 7 (index 3), table 6 (index 4), and table 5 (index 5)
                  // Use normal size for table 10 (index 0), table 9 (index 1), table 8 (index 2)
                  const useSmall = index === 3 || index === 4 || index === 5;
                  switch (table.status) {
                    case "libre":
                      return useSmall
                        ? "/images/tables/tableFreeSmall.webp"
                        : "/images/tables/tableFree.webp";
                    case "atendida":
                      return useSmall
                        ? "/images/tables/tableServedSmall.webp"
                        : "/images/tables/tableServed.webp";
                    case "ocupada":
                      return useSmall
                        ? "/images/tables/tableOccupiedSmall.webp"
                        : "/images/tables/tableOccupied.webp";
                    default:
                      return useSmall
                        ? "/images/tables/tableFreeSmall.webp"
                        : "/images/tables/tableFree.webp";
                  }
                };

                return (
                  <div
                    key={table.id}
                    className="relative group"
                    style={{
                      width:
                        index === 3 || index === 4 || index === 5
                          ? "100px"
                          : "170px",
                      height:
                        index === 3 || index === 4 || index === 5
                          ? "100px"
                          : "170px",
                    }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${displayStatus}`}
                      width={
                        index === 3 || index === 4 || index === 5 ? 100 : 170
                      }
                      height={
                        index === 3 || index === 4 || index === 5 ? 100 : 170
                      }
                      className="transition-transform duration-200 object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {table.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 flex-1 items-center">
              {sortedTables.slice(10, 14).map((table) => {
                const displayStatus = getDisplayStatus(table.status);
                const getImageSrc = () => {
                  switch (table.status) {
                    case "libre":
                      return "/images/tables/tableFree.webp";
                    case "atendida":
                      return "/images/tables/tableServed.webp";
                    case "ocupada":
                      return "/images/tables/tableOccupied.webp";
                    default:
                      return "/images/tables/tableFree.webp";
                  }
                };

                return (
                  <div
                    key={table.id}
                    className="relative group"
                    style={{ width: "170px", height: "170px" }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${displayStatus}`}
                      width={170}
                      height={170}
                      className="transition-transform duration-200 object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {table.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
