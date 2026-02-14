"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Loader2, MoreHorizontal, UserCog, ShieldAlert, UserPlus, CheckCircle2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN' | 'SUPPORT' | 'EDITOR' | 'HR';
    accountType: string;
    createdAt: string;
    emailVerified: string | null;
    deletedAt: string | null;
    _count: {
        numbers: number;
    }
}

const ROLES = [
    { value: 'USER', label: 'User', description: 'Standard access' },
    { value: 'ADMIN', label: 'Admin', description: 'Full system access' },
    { value: 'SUPPORT', label: 'Support Agent', description: 'Can manage tickets' },
    { value: 'EDITOR', label: 'Content Editor', description: 'Can manage blog posts' },
    { value: 'HR', label: 'HR Manager', description: 'Can manage job postings' },
];

export default function UsersPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // Invite Dialog State
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<string>("USER");
    const [isInviting, setIsInviting] = useState(false);

    // Edit Role Dialog State
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState<string>("");
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetchUsers();
        } else if (session && session.user.role !== 'ADMIN') {
            setIsLoading(false);
        }
    }, [session, roleFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (session?.user?.role === 'ADMIN') fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (roleFilter !== "ALL") params.append("role", roleFilter);

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            if (res.status === 401) {
                // Handled by role check
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const openRoleDialog = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setRoleDialogOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        setIsUpdatingRole(true);

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update role');
            }

            toast.success("Role updated successfully");
            setRoleDialogOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const handleSuspendUser = async (userId: string, currentlySuspended: boolean) => {
        const action = currentlySuspended ? "activate" : "suspend";
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suspended: !currentlySuspended })
            });

            if (!res.ok) throw new Error('Failed to update user');

            toast.success(`User ${action}d successfully`);
            fetchUsers();
        } catch (error) {
            toast.error(`Failed to ${action} user`);
        }
    };

    const handleInviteUser = async () => {
        if (!inviteEmail || !inviteEmail.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsInviting(true);
        try {
            const res = await fetch('/api/admin/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteEmail,
                    role: inviteRole
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to invite user');
            }

            const data = await res.json();

            // Show success message with temp password in development
            if (data.tempPassword) {
                toast.success(
                    `User invited! Temporary password: ${data.tempPassword}`,
                    {
                        duration: 10000,
                        description: "Click to copy password to clipboard",
                        action: {
                            label: "Copy",
                            onClick: () => {
                                navigator.clipboard.writeText(data.tempPassword);
                                toast.success("Password copied to clipboard!");
                            }
                        }
                    }
                );
            } else {
                toast.success(`Invitation sent to ${inviteEmail}`);
            }

            setInviteDialogOpen(false);
            setInviteEmail("");
            setInviteRole("USER");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to invite user");
        } finally {
            setIsInviting(false);
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'default'; // black/white
            case 'EDITOR': return 'secondary'; // gray
            case 'HR': return 'outline';
            case 'SUPPORT': return 'secondary';
            default: return 'outline';
        }
    };

    if (session?.user?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage platform users and permissions.</p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New User</DialogTitle>
                            <DialogDescription>
                                Send an invitation email to a new user. They will receive a link to create their account.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-email">Email Address</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-role">Role</Label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger id="invite-role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInviteDialogOpen(false)} disabled={isInviting}>
                                Cancel
                            </Button>
                            <Button onClick={handleInviteUser} disabled={isInviting}>
                                {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>User Directory</CardTitle>
                    <CardDescription>
                        View and manage all registered users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-8"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                {ROLES.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {ROLES.find(r => r.value === user.role)?.label || user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {user.accountType}
                                                    </Badge>
                                                    {user.emailVerified && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    )}
                                                    {user.deletedAt && (
                                                        <Badge variant="destructive" className="text-xs">Suspended</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                                            Change Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleSuspendUser(user.id, !!user.deletedAt)}
                                                        >
                                                            {user.deletedAt ? 'Activate Account' : 'Suspend Account'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Role Update Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User Role</DialogTitle>
                        <DialogDescription>
                            Change access level for {selectedUser?.firstName} {selectedUser?.lastName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Role</Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">{role.label}</span>
                                                <span className="text-xs text-muted-foreground">{role.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)} disabled={isUpdatingRole}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateRole} disabled={isUpdatingRole}>
                            {isUpdatingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Access
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
