"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/apiClient';
import Routes from '@/config/apiConstants';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListFilter, Download, History, IndianRupee, Users, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const DetailedActivityLogs = () => {
    const [recentActivities, setRecentActivities] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    const fetchRecentActivity = async () => {
        setLoading(true);
        const data = await fetchAPI(Routes.GET_RECENT_ACTIVITY + `?limit=${limit}&page=${page}`, "GET");
        if (data?.success) {
            setRecentActivities(data?.data?.activities || []);
            setTotalPages(data?.totalPages);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchRecentActivity();
    }, [page, limit]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
                    <p className="text-muted-foreground">
                        A chronological history of your expenses, settlements, and group activities.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                </div>
            </div>

            {/* loading state */}
            {loading && (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin" />
                </div>
            )}

            {recentActivities.length > 0 ? (
                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y divide-border">
                            {recentActivities.map((activity) => (
                                <li key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                            {activity.type === 'EXPENSE_CREATED' && <History className="h-5 w-5 text-primary flex-shrink-0" />}
                                            {activity.type === 'GROUP_CREATED' && <Users className="h-5 w-5 text-green-500 flex-shrink-0" />}
                                            {activity.type === 'EXPENSE_INVOLVED' && <IndianRupee className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                                            {activity.type === 'SETTLEMENT_CREATED' && <IndianRupee className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                                            <div>
                                                <p className="font-medium">{activity.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            {activity.amount && <p className="font-semibold">{activity.amount}</p>}
                                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                                        </div>
                                    </div>
                                    {activity.type === "EXPENSE_CREATED" && <Badge variant="secondary" className="mt-1 sm:ml-8 capitalize">{activity.type.replace("_", " ")}</Badge>}
                                    {activity.type === "GROUP_CREATED" && <Badge variant="default" className="mt-1 sm:ml-8 capitalize bg-green-500 hover:bg-green-600">{activity.type.replace("_", " ")}</Badge>}
                                    {activity.type === "EXPENSE_INVOLVED" && <Badge variant="default" className="mt-1 sm:ml-8 capitalize bg-blue-500 hover:bg-blue-600">{activity.type.replace("_", " ")}</Badge>}
                                    {activity.type === "SETTLEMENT_CREATED" && <Badge variant="default" className="mt-1 sm:ml-8 capitalize bg-blue-500 hover:bg-blue-600">{activity.type.replace("_", " ")}</Badge>}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between w-full">
                            <Button variant="link" className="mx-auto" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                <span className="text-blue">Previous</span>
                            </Button>
                            <Button variant="link" className="mx-auto" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                <span className="text-blue">Next</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                        <Image src="https://picsum.photos/seed/no-activity-feed/200/200" alt="No activity illustration" width={150} height={150} className="mb-4 rounded-lg" data-ai-hint="empty state calendar" />
                        <h3 className="text-xl font-medium">No Activity Yet</h3>
                        <p className="text-muted-foreground mt-1">
                            Your recent actions will appear here. Start by creating a group or adding an expense.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default DetailedActivityLogs
