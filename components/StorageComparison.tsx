"use client"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StorageComparison() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Comparison of Web Storage APIs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Feature</TableHead>
            <TableHead>localStorage</TableHead>
            <TableHead>sessionStorage</TableHead>
            <TableHead>IndexedDB</TableHead>
            <TableHead>Cache API</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Storage Limit</TableCell>
            <TableCell>~5MB</TableCell>
            <TableCell>~5MB</TableCell>
            <TableCell>Quota-based (typically 50% of available disk)</TableCell>
            <TableCell>Quota-based (typically 50% of available disk)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Data Types</TableCell>
            <TableCell>Strings only</TableCell>
            <TableCell>Strings only</TableCell>
            <TableCell>Almost any (objects, files, blobs)</TableCell>
            <TableCell>Response objects, files, blobs</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Persistence</TableCell>
            <TableCell>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                Persists until cleared
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                Session only
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                Persists until cleared
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                Persists until cleared
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">API Type</TableCell>
            <TableCell>Synchronous</TableCell>
            <TableCell>Synchronous</TableCell>
            <TableCell>Asynchronous</TableCell>
            <TableCell>Asynchronous (Promise-based)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Complexity</TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Low</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Low</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">High</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Medium</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Indexing/Search</TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                None
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                None
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                Advanced
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-1" />
                Basic (by URL)
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Transactions</TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                No
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                No
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                Yes
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                No
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Best For</TableCell>
            <TableCell>Small amounts of data, user preferences</TableCell>
            <TableCell>Temporary form data, per-tab state</TableCell>
            <TableCell>Structured data, offline apps, large datasets</TableCell>
            <TableCell>Network responses, offline assets, API caching</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

