import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LogOut, Search, Edit, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MembershipRecord {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  home_address: string;
  year_graduated: string | null;
  year_crossed: string | null;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [records, setRecords] = useState<MembershipRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MembershipRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MembershipRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<MembershipRecord>>({});

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter((record) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        record.first_name.toLowerCase().includes(searchLower) ||
        record.last_name.toLowerCase().includes(searchLower) ||
        record.email.toLowerCase().includes(searchLower) ||
        record.mobile.includes(searchTerm)
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("membership_dues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
      setFilteredRecords(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load membership records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: MembershipRecord) => {
    setEditingRecord(record);
    setEditForm(record);
  };

  const handleSave = async () => {
    if (!editingRecord) return;

    try {
      const { error } = await supabase
        .from("membership_dues")
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          mobile: editForm.mobile,
          email: editForm.email,
          home_address: editForm.home_address,
          year_graduated: editForm.year_graduated,
          year_crossed: editForm.year_crossed,
        })
        .eq("id", editingRecord.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Record updated successfully",
      });

      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0047bb] via-[#1a1a1a] to-[#BB8D09] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-white/80 mt-1 uppercase tracking-wide text-sm">
                VSU Alphas Alumni Chapter
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Card */}
        <Card className="mb-6 border-2 border-[#BB8D09]/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0047bb] to-[#BB8D09] rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Total Members
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#0047bb] to-[#BB8D09] bg-clip-text text-transparent">
                  {records.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-orange-50/20">
            <CardTitle className="text-2xl">Membership Records</CardTitle>
            <CardDescription>View and edit member information</CardDescription>

            {/* Search Bar */}
            <div className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-[#0047bb]"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground">
                <div className="animate-spin w-12 h-12 border-4 border-[#0047bb] border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading records...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                {searchTerm ? "No records match your search" : "No membership records found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-orange-50/20 hover:from-slate-50 hover:to-orange-50/20">
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Name</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Email</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Mobile</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Address</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Graduated</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Crossed</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs">Submitted</TableHead>
                      <TableHead className="font-bold uppercase tracking-wide text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          {record.first_name} {record.last_name}
                        </TableCell>
                        <TableCell>{record.email}</TableCell>
                        <TableCell>{record.mobile}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.home_address}</TableCell>
                        <TableCell>{record.year_graduated || "—"}</TableCell>
                        <TableCell>{record.year_crossed || "—"}</TableCell>
                        <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleEdit(record)}
                            size="sm"
                            className="bg-gradient-to-r from-[#0047bb] to-[#BB8D09] hover:opacity-90"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-[#0047bb] to-[#BB8D09] bg-clip-text text-transparent">
              Edit Member Information
            </DialogTitle>
            <DialogDescription>
              Update the member's information below. All fields are editable.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName" className="font-semibold uppercase text-xs tracking-wide">
                  First Name *
                </Label>
                <Input
                  id="edit-firstName"
                  value={editForm.first_name || ""}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName" className="font-semibold uppercase text-xs tracking-wide">
                  Last Name *
                </Label>
                <Input
                  id="edit-lastName"
                  value={editForm.last_name || ""}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  className="border-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="font-semibold uppercase text-xs tracking-wide">
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-mobile" className="font-semibold uppercase text-xs tracking-wide">
                Mobile Number *
              </Label>
              <Input
                id="edit-mobile"
                value={editForm.mobile || ""}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address" className="font-semibold uppercase text-xs tracking-wide">
                Home Address *
              </Label>
              <Input
                id="edit-address"
                value={editForm.home_address || ""}
                onChange={(e) => setEditForm({ ...editForm, home_address: e.target.value })}
                className="border-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-graduated" className="font-semibold uppercase text-xs tracking-wide">
                  Year Graduated
                </Label>
                <Input
                  id="edit-graduated"
                  value={editForm.year_graduated || ""}
                  onChange={(e) => setEditForm({ ...editForm, year_graduated: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-crossed" className="font-semibold uppercase text-xs tracking-wide">
                  Year Crossed
                </Label>
                <Input
                  id="edit-crossed"
                  value={editForm.year_crossed || ""}
                  onChange={(e) => setEditForm({ ...editForm, year_crossed: e.target.value })}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRecord(null)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#0047bb] to-[#BB8D09] hover:opacity-90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
