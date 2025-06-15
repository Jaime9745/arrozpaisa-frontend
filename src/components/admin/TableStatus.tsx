import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

// Define the tableData array that will be used by both TableStatus and DashboardHome
export const tableData = [
  { number: 14, status: "Ocupada" },
  { number: 13, status: "Servida" },
  { number: 12, status: "Libre" },
  { number: 11, status: "Ocupada" },
  { number: 10, status: "Servida" },
  { number: 9, status: "Libre" },
  { number: 8, status: "Ocupada" },
  { number: 7, status: "Servida" },
  { number: 6, status: "Libre" },
  { number: 5, status: "Ocupada" },
  { number: 4, status: "Servida" },
  { number: 3, status: "Libre" },
  { number: 2, status: "Ocupada" },
  { number: 1, status: "Servida" },
];

export default function TableStatus() {
  return (
    <div className="space-y-6">
      {" "}
      {/* Header Card */}
      <Card className="py-2 px-6 border-0">
        {" "}
        <CardContent className="p-0">
          <div className="flex gap-75 items-center justify-center">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: "#d9d9d9" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                Mesas Libres
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: "#ec3224" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                Mesas Ocupadas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: "#24ec24" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                Mesas Atendidas
              </span>
            </div>
          </div>
        </CardContent>
      </Card>{" "}
      {/* Big General Card Container */}
      <Card
        className="p-6 border-0"
        style={{ borderRadius: "30px", height: "calc(100vh - 120px)" }}
      >
        {" "}
        {/* Scrollable Content Area */}
        <CardContent className="px-0 pb-0 h-full overflow-y-auto">
          <div className="flex justify-between w-full px-6">
            {" "}
            {/* First Column - 4 tables */}
            <div className="flex flex-col gap-4 flex-1 items-center">
              {tableData.slice(0, 4).map((table, index) => {
                const getImageSrc = () => {
                  // No small versions for first column
                  switch (table.status) {
                    case "Libre":
                      return "/images/tables/tableFree.webp";
                    case "Ocupada":
                      return "/images/tables/tableOccupied.webp";
                    case "Servida":
                      return "/images/tables/tableServed.webp";
                    default:
                      return "/images/tables/tableFree.webp";
                  }
                };
                return (
                  <div
                    key={table.number}
                    className="relative cursor-pointer group"
                    style={{ width: "170px", height: "170px" }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${table.status}`}
                      width={170}
                      height={170}
                      className="hover:scale-105 transition-transform duration-200 object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {table.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>{" "}
            {/* Second Column - 6 tables */}
            <div className="flex flex-col gap-1 flex-1 items-center">
              {tableData.slice(4, 10).map((table, index) => {
                const getImageSrc = () => {
                  // Use small version for the first, fifth, and sixth tables (index 0, 4, and 5)
                  const useSmall = index === 0 || index === 4 || index === 5;
                  switch (table.status) {
                    case "Libre":
                      return useSmall
                        ? "/images/tables/tableFreeSmall.webp"
                        : "/images/tables/tableFree.webp";
                    case "Ocupada":
                      return useSmall
                        ? "/images/tables/tableOccupiedSmall.webp"
                        : "/images/tables/tableOccupied.webp";
                    case "Servida":
                      return useSmall
                        ? "/images/tables/tableServedSmall.webp"
                        : "/images/tables/tableServed.webp";
                    default:
                      return useSmall
                        ? "/images/tables/tableFreeSmall.webp"
                        : "/images/tables/tableFree.webp";
                  }
                };
                return (
                  <div
                    key={table.number}
                    className="relative cursor-pointer group"
                    style={{
                      width:
                        index === 0 || index === 4 || index === 5
                          ? "100px"
                          : "170px",
                      height:
                        index === 0 || index === 4 || index === 5
                          ? "100px"
                          : "170px",
                    }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${table.status}`}
                      width={
                        index === 0 || index === 4 || index === 5 ? 100 : 170
                      }
                      height={
                        index === 0 || index === 4 || index === 5 ? 100 : 170
                      }
                      className="hover:scale-105 transition-transform duration-200 object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {table.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>{" "}
            {/* Third Column - 4 tables */}
            <div className="flex flex-col gap-4 flex-1 items-center">
              {tableData.slice(10, 14).map((table) => {
                const getImageSrc = () => {
                  switch (table.status) {
                    case "Libre":
                      return "/images/tables/tableFree.webp";
                    case "Ocupada":
                      return "/images/tables/tableOccupied.webp";
                    case "Servida":
                      return "/images/tables/tableServed.webp";
                    default:
                      return "/images/tables/tableFree.webp";
                  }
                };
                return (
                  <div
                    key={table.number}
                    className="relative cursor-pointer group"
                    style={{ width: "170px", height: "170px" }}
                  >
                    <Image
                      src={getImageSrc()}
                      alt={`Mesa ${table.number} - ${table.status}`}
                      width={170}
                      height={170}
                      className="hover:scale-105 transition-transform duration-200 object-contain w-full h-full"
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
