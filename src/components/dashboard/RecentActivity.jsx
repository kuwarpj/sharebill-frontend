import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Routes from '@/config/apiConstants';
import { useEffect } from 'react';
import Image from 'next/image';
import { fetchAPI } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

const RecentActivity = () => {
    const [recentActivities, setRecentActivities] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(5);
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
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Activity</h2>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin" />
                </div>
            ) : recentActivities.length > 0 ? (
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                        <ul className="divide-y divide-border">
                            {recentActivities.map((activity) => (
                                <li key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{activity.description}</p>
                                            <p className="text-sm text-muted-foreground">In: {activity.group}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${activity.type === 'EXPENSE_INVOLVED' ? 'text-destructive' : activity.type === 'EXPENSE_CREATED' ? 'text-green-600' : ''}`}>{activity.type === 'EXPENSE_INVOLVED' ? activity.amount : activity.type === 'EXPENSE_CREATED' ? activity.amount : ''}</p>
                                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-4">
                        <div className="flex justify-between w-full">
                            <Button variant="link" className="mx-auto" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                <span className="text-blue">Previous</span>
                            </Button>
                            <Button variant="link" className="mx-auto" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                <span className="text-blue">Next</span>
                            </Button>
                            <Button variant="link" className="mx-auto" onClick={() => router.push('/activity')}>
                                <span className="text-blue">View all activity</span>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                        <Image src="https://picsum.photos/seed/no-dashboard-activity/200/200" alt="No activity illustration" width={150} height={150} className="mb-4 rounded-lg" data-ai-hint="empty document" />
                        <p className="text-lg font-medium">No recent activity yet.</p>
                        <p className="text-muted-foreground">Add some expenses to get started!</p>
                    </CardContent>
                </Card>
            )}
        </section>
    )
}

export default RecentActivity
