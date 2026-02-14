"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Settings, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface NumberActionsProps {
    numberId: string;
    phoneNumber: string;
    status: string;
}

export function NumberActions({ numberId, phoneNumber, status }: NumberActionsProps) {
    const router = useRouter();
    const [isTerminating, setIsTerminating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleTerminate = async () => {
        setIsTerminating(true);
        try {
            const res = await fetch(`/api/numbers/${numberId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to terminate number");
            }

            toast.success("Number terminated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to terminate number");
            console.error(error);
        } finally {
            setIsTerminating(false);
            setShowConfirm(false);
        }
    };

    const isCancelled = status === 'CANCELLED' || status === 'EXPIRED';

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/numbers/${numberId}`} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" /> Configure
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/messages?number=${phoneNumber}`} className="cursor-pointer">
                            <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!isCancelled && (
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => setShowConfirm(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Terminate Number
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently terminate your ownership of <strong>{phoneNumber}</strong>.
                            The number will be released and you will stop being billed for it.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleTerminate}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isTerminating}
                        >
                            {isTerminating ? "Terminating..." : "Yes, Terminate Number"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
