"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Loader2, User, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SmsLog {
    id: string;
    direction: 'INBOUND' | 'OUTBOUND';
    fromNumber: string;
    toNumber: string;
    body: string;
    status: string;
    createdAt: string;
    number?: {
        phoneNumber: string;
        country: string;
    };
}

interface Conversation {
    contactNumber: string;
    lastMessage: SmsLog;
    myNumber: string; // The virtual number involved
}

function MessagesContent() {
    const searchParams = useSearchParams();
    const defaultFrom = searchParams.get("number") || "";

    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState<SmsLog[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);

    // Compose state
    const [composeTo, setComposeTo] = useState("");
    const [composeFrom, setComposeFrom] = useState(defaultFrom);
    const [messageText, setMessageText] = useState("");
    const [userNumbers, setUserNumbers] = useState<any[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch User Numbers
    useEffect(() => {
        fetch("/api/numbers")
            .then(res => res.json())
            .then(data => {
                setUserNumbers(data);
                if (!defaultFrom && data.length > 0) {
                    setComposeFrom(data[0].phoneNumber);
                }
            })
            .catch(err => console.error("Failed to fetch numbers", err));
    }, [defaultFrom]);

    // Fetch Messages & Group into Conversations
    useEffect(() => {
        setIsLoading(true);
        fetch("/api/messages")
            .then(res => res.json())
            .then((data: SmsLog[]) => {
                setMessages(data);

                // Group by contact number
                const convoMap = new Map<string, Conversation>();

                data.forEach(msg => {
                    // Identify the 'contact' (the other party)
                    // If inbound, contact is fromNumber. If outbound, contact is toNumber.
                    // Ideally we know 'myNumber' from the relations, but raw log logic:
                    // We need to know which number is 'ours'. 
                    // The API includes `number` relation which is the VirtualNumber owner.
                    // So if msg.numberId exists, msg.number.phoneNumber is OURS.

                    const myPhone = msg.number?.phoneNumber;
                    if (!myPhone) return;

                    const contact = msg.direction === 'INBOUND' ? msg.fromNumber : msg.toNumber;

                    if (!convoMap.has(contact)) {
                        convoMap.set(contact, {
                            contactNumber: contact,
                            lastMessage: msg,
                            myNumber: myPhone
                        });
                    }
                });

                setConversations(Array.from(convoMap.values()));
            })
            .catch(err => console.error("Failed to fetch messages", err))
            .finally(() => setIsLoading(false));
    }, [isSending]); // Re-fetch when a message is sent

    // Scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedContact, messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        setIsSending(true);

        const to = selectedContact || composeTo;
        const from = composeFrom; // If in a conversation, ideally we use the conversation's 'myNumber'

        // If selectedConversation exists, use its 'myNumber'
        const activeConvo = conversations.find(c => c.contactNumber === selectedContact);
        const actualFrom = activeConvo ? activeConvo.myNumber : from;

        try {
            const response = await fetch("/api/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to,
                    from: actualFrom,
                    text: messageText
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            toast.success("Message sent!");
            setMessageText("");
            // If new conversation, set selected
            if (!selectedContact) {
                setSelectedContact(to);
            }
        } catch (error) {
            toast.error("Error sending message");
        } finally {
            setIsSending(false);
        }
    };

    // Filter messages for selected contact
    const activeMessages = selectedContact
        ? messages.filter(m => m.fromNumber === selectedContact || m.toNumber === selectedContact).reverse()
        : [];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                <Button onClick={() => setSelectedContact(null)} variant={selectedContact ? "outline" : "default"}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Message
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Sidebar: Conversations */}
                <Card className="col-span-1 flex flex-col h-full">
                    <CardHeader className="py-3 px-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col gap-1 p-2">
                            {isLoading && <div className="p-4 text-center text-sm">Loading conversations...</div>}

                            {!isLoading && conversations.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No conversations yet. Start a new one!
                                </div>
                            )}

                            {conversations.map((convo) => (
                                <button
                                    key={convo.contactNumber}
                                    onClick={() => setSelectedContact(convo.contactNumber)}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors hover:bg-muted/50",
                                        selectedContact === convo.contactNumber && "bg-muted"
                                    )}
                                >
                                    <div className="flex w-full justify-between items-baseline">
                                        <span className="font-semibold text-sm">{convo.contactNumber}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(convo.lastMessage.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground line-clamp-1 w-full flex justify-between">
                                        <span>{convo.lastMessage.body}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                        via {convo.myNumber}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Main: Chat Interface */}
                <Card className="col-span-2 flex flex-col h-full overflow-hidden">
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="border-b p-4 flex items-center justify-between bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{selectedContact}</div>
                                        <div className="text-xs text-muted-foreground">Text Message</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Messages List */}
                            <div
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                                ref={scrollRef}
                            >
                                {activeMessages.map((msg) => {
                                    const isMe = msg.direction === 'OUTBOUND';
                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted rounded-bl-none"
                                            )}>
                                                {msg.body}
                                                <div className={cn(
                                                    "text-[10px] mt-1 opacity-70",
                                                    isMe ? "text-primary-foreground/80" : "text-muted-foreground"
                                                )}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t bg-background">
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={isSending || !messageText.trim()}>
                                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        // Compose New Message View
                        <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-semibold">New Message</h3>
                                <p className="text-muted-foreground">Select a contact on the left or start a new conversation.</p>
                            </div>

                            <Card className="w-full max-w-md">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label>From</Label>
                                        <Select value={composeFrom} onValueChange={setComposeFrom}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your number" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {userNumbers.map((num) => (
                                                    <SelectItem key={num.id} value={num.phoneNumber}>
                                                        {num.phoneNumber} ({num.country})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>To</Label>
                                        <Input
                                            placeholder="+15550000000"
                                            value={composeTo}
                                            onChange={(e) => setComposeTo(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea
                                            placeholder="Hello..."
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full" onClick={handleSend} disabled={isSending}>
                                        {isSending ? "Sending..." : "Send Message"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <MessagesContent />
        </Suspense>
    );
}
