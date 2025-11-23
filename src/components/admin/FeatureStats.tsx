import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle } from 'lucide-react';

interface FeatureStatsProps {
    features: any[];
}

export function FeatureStats({ features }: FeatureStatsProps) {
    const total = features.length;
    const active = features.filter(f => f.enabled).length;
    const inactive = total - active;

    const stats = [
        {
            title: 'Total Features',
            value: total,
            icon: Activity,
            color: 'text-blue-500',
        },
        {
            title: 'Active Features',
            value: active,
            icon: CheckCircle,
            color: 'text-green-500',
        },
        {
            title: 'Inactive Features',
            value: inactive,
            icon: Activity,
            color: 'text-gray-500',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
