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
import { ArrowUpDown } from 'lucide-react';
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
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Waste Log</CardTitle>
            <CardDescription>A detailed record of all analyzed food waste.</CardDescription>
        </div>
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={wasteData.length === 0}>Clear All</Button>
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
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    {item.imageUrl && (
                       <Dialog>
                        <DialogTrigger asChild>
                           <Image
                              alt="Food waste"
                              className="aspect-square rounded-md object-cover cursor-pointer"
                              height="64"
                              src={item.imageUrl}
                              width="64"
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
                                />
                            </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                  <TableCell className="font-medium capitalize">{item.foodType}</TableCell>
                  <TableCell>{item.estimatedQuantity}</TableCell>
                  <TableCell>{format(parseISO(item.timestamp), 'MMM d, h:mm a')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No waste logged yet. Upload an image to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="flex items-center justify-between">
         <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}</strong> of <strong>{sortedData.length}</strong> entries
        </div>
        {renderPagination()}
      </CardFooter>
    </Card>
  );
}