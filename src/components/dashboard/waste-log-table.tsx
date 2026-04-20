'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { WasteData } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';


interface WasteLogTableProps {
  wasteData: WasteData[];
  clearWasteData: () => void;
}

const ITEMS_PER_PAGE = 5;

type SortKey = keyof WasteData | '';
type SortDirection = 'asc' | 'desc';


export default function WasteLogTable({ wasteData, clearWasteData }: WasteLogTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return wasteData;

    return [...wasteData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === undefined || bValue === undefined) return 0;
      
      let comparison = 0;
      
      if (sortKey === 'estimatedQuantity') {
        const aQuantity = parseFloat(aValue.toString().match(/(\d+(\.\d+)?)/)?.[0] || '0');
        const bQuantity = parseFloat(bValue.toString().match(/(\d+(\.\d+)?)/)?.[0] || '0');
        comparison = aQuantity > bQuantity ? 1 : -1;
      } else {
         comparison = aValue > bValue ? 1 : -1;
      }

      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }, [wasteData, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPages);
    let endPage = Math.min(totalPages, currentPage + halfPages);

    if (currentPage - 1 <= halfPages) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (totalPages - currentPage < halfPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(p => Math.max(1, p-1))}} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}/>
                </PaginationItem>
                
                {startPage > 1 && <>
                    <PaginationItem><PaginationLink href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(1)}}>1</PaginationLink></PaginationItem>
                    {startPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                </>}

                {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                        <PaginationLink href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(number)}} isActive={currentPage === number}>
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {endPage < totalPages && <>
                    {endPage < totalPages -1 &&<PaginationItem><PaginationEllipsis /></PaginationItem>}
                    <PaginationItem><PaginationLink href="#" onClick={(e) => {e.preventDefault();setCurrentPage(totalPages)}}>{totalPages}</PaginationLink></PaginationItem>
                </>}

                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {e.preventDefault();setCurrentPage(p => Math.min(totalPages, p+1))}} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <CardTitle>Waste Log</CardTitle>
            <CardDescription>A detailed record of all analyzed food waste.</CardDescription>
        </div>
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={wasteData.length === 0} className="w-full sm:w-auto">Clear All</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your waste log data from this session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearWasteData}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('foodType')}>
                    Food Type
                    {getSortIcon('foodType')}
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('estimatedQuantity')}>
                    Est. Quantity
                    {getSortIcon('estimatedQuantity')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                    Date
                    {getSortIcon('timestamp')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRow(item.id)}>
                    <TableCell className="hidden sm:table-cell">
                      {item.imageUrl && (
                         <div onClick={(e) => e.stopPropagation()}>
                           <Dialog>
                            <DialogTrigger asChild>
                               <Image
                                  alt="Food waste"
                                  className="aspect-square rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  height="64"
                                  src={item.imageUrl}
                                  width="64"
                                  unoptimized
                                />
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle className='sr-only'>Enlarged Image of {item.foodType}</DialogTitle>
                                </DialogHeader>
                                <div className="relative aspect-video">
                                    <Image
                                        alt="Food waste enlarged"
                                        className="rounded-md object-contain"
                                        src={item.imageUrl}
                                        fill
                                        unoptimized
                                    />
                                </div>
                            </DialogContent>
                          </Dialog>
                         </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium capitalize">{item.foodType}</TableCell>
                    <TableCell>{item.estimatedQuantity}</TableCell>
                    <TableCell>{format(parseISO(item.timestamp), 'MMM d, h:mm a')}</TableCell>
                  </TableRow>
                  {expandedId === item.id && item.analysisDetails && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={4} className="p-0 border-b">
                           <div className="p-4 sm:p-6 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm text-primary/80 font-medium leading-relaxed italic">
                                 &quot;{item.analysisDetails.summary}&quot;
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="bg-background shadow-sm rounded-lg border p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Itemized Breakdown</h4>
                                    <div className="flex gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Distinct Items</p>
                                            <p className="text-sm font-bold">{item.analysisDetails.total_distinct_items}</p>
                                        </div>
                                        <div className="text-right border-l pl-4">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total (Grams)</p>
                                            <p className="text-sm font-bold">{item.analysisDetails.total_waste}g</p>
                                        </div>
                                        <div className="text-right border-l pl-4">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total (Kilograms)</p>
                                            <p className="text-sm font-bold uppercase">{item.analysisDetails.total_weight_kg ? item.analysisDetails.total_weight_kg.toFixed(3) : (item.analysisDetails.total_waste / 1000).toFixed(3)}kg</p>
                                        </div>
                                        <div className="text-right border-l pl-4">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</p>
                                            <p className="text-sm font-bold">{item.analysisDetails.confidence}%</p>
                                        </div>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    {item.analysisDetails.method_summary && (
                                        <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="text-[10px] uppercase font-bold text-primary tracking-widest">Deterministic Estimation Method</h5>
                                                {item.analysisDetails.method_summary.consistency_rules_applied && (
                                                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">STABLE ENGINE ACTIVE</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[11px] text-muted-foreground font-bold">Scale Reference</p>
                                                    <p className="text-xs">{item.analysisDetails.method_summary.scale_reference_used}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-muted-foreground font-bold">Estimation Basis</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.analysisDetails.method_summary.estimation_basis.map((basis, idx) => (
                                                            <span key={idx} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{basis}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                  </div>

                                  {item.analysisDetails.non_food_detected && item.analysisDetails.non_food_detected.length > 0 && (
                                    <div className="mb-4 bg-muted/20 border border-dashed border-muted-foreground/20 p-3 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h5 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Non-Food Materials (Excluded)</h5>
                                            <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-bold opacity-60">NET WASTE ONLY</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.analysisDetails.non_food_detected.map((nf, idx) => (
                                                <div key={idx} className="bg-background border px-2 py-1 rounded text-[11px] flex items-center gap-1.5 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                                    {nf.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {item.analysisDetails.items?.map((food, i) => (
                                      <div key={i} className="flex flex-col gap-1 bg-muted/30 p-3 rounded-lg border border-muted/50">
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-2">
                                            <div 
                                              className="w-3 h-3 rounded-full shadow-sm" 
                                              style={{ backgroundColor: food.color }}
                                            />
                                            <div>
                                                <span className="font-bold text-sm capitalize block leading-tight">{food.name}</span>
                                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">
                                                    {food.quantity_type?.replace('_', ' ') || 'detected'}
                                                </span>
                                            </div>
                                          </div>
                                          <div className="flex flex-col items-end">
                                             <span className="text-xs font-mono font-bold">
                                               {food.weight_kg ? `${food.weight_kg.toFixed(3)}kg` : `${(food.grams / 1000).toFixed(3)}kg`}
                                             </span>
                                             <span className="text-[10px] text-muted-foreground font-bold">{food.grams}g</span>
                                          </div>
                                        </div>
                                        
                                        {food.assumptions && food.assumptions.length > 0 && (
                                            <div className="mt-2 py-1.5 px-2 bg-background/50 rounded border border-muted/30">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Key Assumptions</p>
                                                <ul className="text-[10px] space-y-0.5 list-disc list-inside text-muted-foreground leading-tight">
                                                    {food.assumptions.slice(0, 2).map((asm, idx) => (
                                                        <li key={idx} className="truncate">{asm}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500" 
                                                style={{ 
                                                    width: `${food.percentage}%`,
                                                    backgroundColor: food.color
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-muted-foreground font-bold">{food.percentage}% of total</span>
                                            <span className="text-[10px] font-bold text-primary">{food.confidence}% confidence</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                           </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No waste logged yet. Upload an image to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="text-xs text-muted-foreground text-center sm:text-left">
          Showing <strong>{paginatedData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}</strong> of <strong>{sortedData.length}</strong> entries
        </div>
        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {renderPagination()}
        </div>
      </CardFooter>
    </Card>
  );
}