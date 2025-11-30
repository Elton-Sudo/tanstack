'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/visualizations';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Crown,
  Flame,
  Medal,
  Star,
  Trophy,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  department: string;
  points: number;
  coursesCompleted: number;
  certificatesEarned: number;
  currentStreak: number;
  avatar?: string;
  rankChange?: number; // positive for up, negative for down
  level: number;
}

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [showOnlyMyDepartment, setShowOnlyMyDepartment] = useState(false);

  // Current user data
  const currentUser = {
    userId: 'user-123',
    name: 'Sarah Johnson',
    department: 'IT Security',
    rank: 12,
    points: 2850,
    level: 8,
  };

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user-456',
      name: 'Michael Chen',
      department: 'IT Security',
      points: 5240,
      coursesCompleted: 28,
      certificatesEarned: 22,
      currentStreak: 45,
      rankChange: 0,
      level: 12,
    },
    {
      rank: 2,
      userId: 'user-789',
      name: 'Emily Rodriguez',
      department: 'Engineering',
      points: 4980,
      coursesCompleted: 25,
      certificatesEarned: 20,
      currentStreak: 38,
      rankChange: 1,
      level: 11,
    },
    {
      rank: 3,
      userId: 'user-012',
      name: 'David Kim',
      department: 'Operations',
      points: 4720,
      coursesCompleted: 24,
      certificatesEarned: 19,
      currentStreak: 28,
      rankChange: -1,
      level: 11,
    },
    {
      rank: 4,
      userId: 'user-345',
      name: 'Amanda Foster',
      department: 'IT Security',
      points: 4500,
      coursesCompleted: 23,
      certificatesEarned: 18,
      currentStreak: 32,
      rankChange: 2,
      level: 10,
    },
    {
      rank: 5,
      userId: 'user-678',
      name: 'James Wilson',
      department: 'Finance',
      points: 4280,
      coursesCompleted: 22,
      certificatesEarned: 17,
      currentStreak: 25,
      rankChange: -1,
      level: 10,
    },
    {
      rank: 6,
      userId: 'user-901',
      name: 'Lisa Park',
      department: 'HR',
      points: 4150,
      coursesCompleted: 21,
      certificatesEarned: 16,
      currentStreak: 30,
      rankChange: 0,
      level: 10,
    },
    {
      rank: 7,
      userId: 'user-234',
      name: 'Robert Taylor',
      department: 'Engineering',
      points: 3980,
      coursesCompleted: 20,
      certificatesEarned: 15,
      currentStreak: 22,
      rankChange: 3,
      level: 9,
    },
    {
      rank: 8,
      userId: 'user-567',
      name: 'Jennifer Lee',
      department: 'Marketing',
      points: 3820,
      coursesCompleted: 19,
      certificatesEarned: 14,
      currentStreak: 18,
      rankChange: -2,
      level: 9,
    },
    {
      rank: 9,
      userId: 'user-890',
      name: 'Thomas Brown',
      department: 'Operations',
      points: 3650,
      coursesCompleted: 18,
      certificatesEarned: 13,
      currentStreak: 20,
      rankChange: 1,
      level: 9,
    },
    {
      rank: 10,
      userId: 'user-123a',
      name: 'Maria Garcia',
      department: 'IT Security',
      points: 3500,
      coursesCompleted: 17,
      certificatesEarned: 12,
      currentStreak: 15,
      rankChange: -3,
      level: 8,
    },
    {
      rank: 11,
      userId: 'user-456a',
      name: 'Kevin White',
      department: 'Finance',
      points: 3280,
      coursesCompleted: 16,
      certificatesEarned: 11,
      currentStreak: 12,
      rankChange: 0,
      level: 8,
    },
    {
      rank: 12,
      userId: 'user-123',
      name: 'Sarah Johnson',
      department: 'IT Security',
      points: 2850,
      coursesCompleted: 12,
      certificatesEarned: 8,
      currentStreak: 7,
      rankChange: 1,
      level: 8,
    },
  ];

  const departments = ['All', ...Array.from(new Set(leaderboardData.map((e) => e.department)))];

  const filteredData = leaderboardData.filter((entry) =>
    departmentFilter === 'All' ? true : entry.department === departmentFilter,
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1)
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold';
    if (rank === 2)
      return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white font-bold';
    if (rank === 3)
      return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold';
    if (rank <= 10) return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          See how you rank against other learners in your organization
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Your Rank"
          value={`#${currentUser.rank}`}
          subtitle={`Level ${currentUser.level}`}
          icon={Trophy}
          variant="primary"
          animate
        />
        <MetricCard
          title="Total Points"
          value={currentUser.points}
          subtitle="Achievement points"
          trend={{
            value: 12.5,
            isPositive: true,
            label: 'this week',
          }}
          icon={Star}
          variant="success"
          animate
        />
        <MetricCard
          title="Top 25%"
          value="Yes"
          subtitle="Performance ranking"
          icon={TrendingUp}
          variant="warning"
          animate
        />
        <MetricCard
          title="Next Rank"
          value={`${(leaderboardData.find((e) => e.rank === currentUser.rank - 1)?.points ?? 0) - currentUser.points}`}
          subtitle="Points needed"
          icon={Zap}
          variant="neutral"
          animate
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Time Range Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Time Period</p>
            <div className="flex gap-2">
              {[
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
              ].map((range) => (
                <Badge
                  key={range.id}
                  variant={timeRange === range.id ? 'primary' : 'default'}
                  badgeStyle={timeRange === range.id ? 'solid' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTimeRange(range.id as any)}
                >
                  {range.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Department</p>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge
                  key={dept}
                  variant={departmentFilter === dept ? 'primary' : 'default'}
                  badgeStyle={departmentFilter === dept ? 'solid' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid gap-6 md:grid-cols-3">
        {filteredData.slice(0, 3).map((entry, index) => (
          <Card
            key={entry.userId}
            className={`relative overflow-hidden ${
              index === 0 ? 'md:order-2 ring-2 ring-yellow-500' : index === 1 ? 'md:order-1' : 'md:order-3'
            }`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-2 ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : index === 1
                    ? 'bg-gradient-to-r from-gray-300 to-gray-500'
                    : 'bg-gradient-to-r from-amber-600 to-amber-800'
              }`}
            />
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getRankIcon(entry.rank)}
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                {entry.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <CardTitle className="text-lg">{entry.name}</CardTitle>
              <Badge variant="default" badgeStyle="outline">
                {entry.department}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{entry.points.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold">{entry.coursesCompleted}</p>
                  <p className="text-muted-foreground">Courses</p>
                </div>
                <div>
                  <p className="font-bold">{entry.certificatesEarned}</p>
                  <p className="text-muted-foreground">Certificates</p>
                </div>
                <div>
                  <p className="font-bold flex items-center justify-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {entry.currentStreak}
                  </p>
                  <p className="text-muted-foreground">Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredData.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  entry.userId === currentUser.userId
                    ? 'bg-brand-blue/10 border-brand-blue ring-2 ring-brand-blue/20'
                    : 'hover:bg-accent'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-3 w-20">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getRankBadgeColor(entry.rank)}`}
                  >
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate">{entry.name}</p>
                    {entry.userId === currentUser.userId && (
                      <Badge variant="primary" badgeStyle="solid">
                        You
                      </Badge>
                    )}
                    <Badge variant="default" badgeStyle="outline">
                      Level {entry.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.department}</p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold">{entry.coursesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{entry.certificatesEarned}</p>
                    <p className="text-xs text-muted-foreground">Certificates</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold flex items-center justify-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {entry.currentStreak}
                    </p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                </div>

                {/* Points & Rank Change */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <p className="text-xl font-bold text-yellow-500">
                      {entry.points.toLocaleString()}
                    </p>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  {entry.rankChange !== undefined && entry.rankChange !== 0 && (
                    <div
                      className={`flex items-center justify-end gap-1 text-xs ${
                        entry.rankChange > 0 ? 'text-brand-green' : 'text-red-600'
                      }`}
                    >
                      {entry.rankChange > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          <span>+{entry.rankChange}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3" />
                          <span>{entry.rankChange}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="border-brand-blue bg-brand-blue/5">
        <CardContent className="pt-6 text-center">
          <Zap className="h-12 w-12 text-brand-blue mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Keep Learning!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You're doing great! Complete more courses and maintain your learning streak to climb the
            rankings.
          </p>
          <Button className="bg-brand-blue hover:bg-brand-blue/90">View Available Courses</Button>
        </CardContent>
      </Card>
    </div>
  );
}
