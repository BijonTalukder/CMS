"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { baseUrl } from "@/utility/config";

// ✅ Type definition
type BreakingNews = {
  id: string;
  newsTitle: string;
  content?: string;
  status: boolean;
  order: number;
  createdAt: string;
};

 const BreakingNewsList=()=> {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/breaking-news`);
      setNewsList(res.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/breaking-news/${id}`);
      await loadData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Breaking News List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>{item.newsTitle}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          item.status ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default BreakingNewsList;
