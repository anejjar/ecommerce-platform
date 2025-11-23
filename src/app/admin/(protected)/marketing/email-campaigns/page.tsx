'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmailCampaignsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
                    <p className="text-muted-foreground mt-2">
                        Create and manage your email marketing campaigns.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                    No campaigns found. Create your first campaign to get started.
                </CardContent>
            </Card>
        </div>
    );
}
