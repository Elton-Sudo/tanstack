'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/visualizations';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Crown,
  Flame,
  Lock,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'completion' | 'streak' | 'score' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  points: number;
  progress?: {
    current: number;
    total: number;
  };
  earnedAt?: string;
  isUnlocked: boolean;
}

export default function AchievementsPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'earned' | 'locked'>('all');

  // Mock achievements data
  const achievements: Achievement[] = [
    // Learning Achievements
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      category: 'learning',
      rarity: 'common',
      icon: '<¯',
      points: 10,
      isUnlocked: true,
      earnedAt: '2024-11-15',
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Complete 10 courses',
      category: 'completion',
      rarity: 'rare',
      icon: '=Ú',
      points: 50,
      isUnlocked: true,
      earnedAt: '2024-11-20',
      progress: {
        current: 10,
        total: 10,
      },
    },
    {
      id: '3',
      title: 'Master Scholar',
      description: 'Complete 25 courses',
      category: 'completion',
      rarity: 'epic',
      icon: '<“',
      points: 150,
      isUnlocked: false,
      progress: {
        current: 12,
        total: 25,
      },
    },
    {
      id: '4',
      title: 'Week Warrior',
      description: 'Learn every day for 7 days straight',
      category: 'streak',
      rarity: 'rare',
      icon: '=%',
      points: 75,
      isUnlocked: true,
      earnedAt: '2024-11-18',
    },
    {
      id: '5',
      title: 'Month Master',
      description: 'Maintain a 30-day learning streak',
      category: 'streak',
      rarity: 'epic',
      icon: '¡',
      points: 200,
      isUnlocked: false,
      progress: {
        current: 12,
        total: 30,
      },
    },
    {
      id: '6',
      title: 'Perfect Score',
      description: 'Score 100% on any assessment',
      category: 'score',
      rarity: 'epic',
      icon: '=¯',
      points: 100,
      isUnlocked: true,
      earnedAt: '2024-11-22',
    },
    {
      id: '7',
      title: 'Quiz Master',
      description: 'Score 100% on 5 assessments',
      category: 'score',
      rarity: 'legendary',
      icon: '=Q',
      points: 300,
      isUnlocked: false,
      progress: {
        current: 2,
        total: 5,
      },
    },
    {
      id: '8',
      title: 'Quick Learner',
      description: 'Complete 3 courses in one month',
      category: 'completion',
      rarity: 'rare',
      icon: '¡',
      points: 60,
      isUnlocked: true,
      earnedAt: '2024-11-10',
    },
    {
      id: '9',
      title: 'Early Bird',
      description: 'Complete a lesson before 8 AM',
      category: 'special',
      rarity: 'rare',
      icon: '<',
      points: 40,
      isUnlocked: true,
      earnedAt: '2024-11-05',
    },
    {
      id: '10',
      title: 'Night Owl',
      description: 'Complete a lesson after 10 PM',
      category: 'special',
      rarity: 'rare',
      icon: '>‰',
      points: 40,
      isUnlocked: false,
    },
    {
      id: '11',
      title: 'Social Butterfly',
      description: 'Share 5 certificates on social media',
      category: 'social',
      rarity: 'common',
      icon: '>‹',
      points: 20,
      isUnlocked: false,
      progress: {
        current: 2,
        total: 5,
      },
    },
    {
      id: '12',
      title: 'Legendary Scholar',
      description: 'Complete 100 courses',
      category: 'completion',
      rarity: 'legendary',
      icon: '<Æ',
      points: 500,
      isUnlocked: false,
      progress: {
        current: 12,
        total: 100,
      },
    },
  ];

  const stats = {
    totalEarned: achievements.filter((a) => a.isUnlocked).length,
    totalAvailable: achievements.length,
    totalPoints: achievements.filter((a) => a.isUnlocked).reduce((sum, a) => sum + a.points, 0),
    rareEarned: achievements.filter((a) => a.isUnlocked && a.rarity === 'rare').length,
    epicEarned: achievements.filter((a) => a.isUnlocked && a.rarity === 'epic').length,
    legendaryEarned: achievements.filter((a) => a.isUnlocked && a.rarity === 'legendary').length,
  };

  const categories = [
    { id: 'all', label: 'All Achievements', icon: Trophy },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'completion', label: 'Completion', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'score', label: 'Scores', icon: Star },
    { id: 'social', label: 'Social', icon: Award },
    { id: 'special', label: 'Special', icon: Crown },
  ];

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'earned' && achievement.isUnlocked) ||
      (filterStatus === 'locked' && !achievement.isUnlocked);
    return matchesCategory && matchesStatus;
  });

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'rare':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'epic':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning':
        return <BookOpen className="h-4 w-4" />;
      case 'completion':
        return <Target className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'score':
        return <Star className="h-4 w-4" />;
      case 'social':
        return <Award className="h-4 w-4" />;
      case 'special':
        return <Crown className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>
        <p className="text-muted-foreground">
          Track your progress and unlock badges as you learn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Achievements"
          value={`${stats.totalEarned}/${stats.totalAvailable}`}
          subtitle={`${((stats.totalEarned / stats.totalAvailable) * 100).toFixed(0)}% unlocked`}
          icon={Trophy}
          variant="primary"
          animate
        />
        <MetricCard
          title="Total Points"
          value={stats.totalPoints}
          subtitle="Achievement points earned"
          icon={Star}
          variant="warning"
          animate
        />
        <MetricCard
          title="Rare Badges"
          value={`${stats.rareEarned + stats.epicEarned}`}
          subtitle="Rare & Epic unlocked"
          icon={Award}
          variant="success"
          animate
        />
        <MetricCard
          title="Legendary"
          value={stats.legendaryEarned}
          subtitle="Ultimate achievements"
          icon={Crown}
          variant="neutral"
          animate
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filterCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category.id)}
                  className={
                    filterCategory === category.id
                      ? 'bg-brand-blue hover:bg-brand-blue/90'
                      : ''
                  }
                >
                  {<category.icon className="mr-2 h-4 w-4" />}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'earned', label: 'Earned' },
                { id: 'locked', label: 'Locked' },
              ].map((status) => (
                <Badge
                  key={status.id}
                  variant={filterStatus === status.id ? 'primary' : 'default'}
                  badgeStyle={filterStatus === status.id ? 'solid' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus(status.id as any)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`relative overflow-hidden transition-all ${
              achievement.isUnlocked
                ? 'hover:shadow-lg border-2'
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            {/* Rarity Indicator */}
            <div
              className={`absolute top-0 right-0 w-16 h-16 ${
                achievement.isUnlocked ? 'opacity-20' : 'opacity-10'
              }`}
              style={{
                background:
                  achievement.rarity === 'legendary'
                    ? 'linear-gradient(135deg, #F5C242, #E86A33)'
                    : achievement.rarity === 'epic'
                      ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                      : achievement.rarity === 'rare'
                        ? 'linear-gradient(135deg, #3B8EDE, #8CB841)'
                        : 'linear-gradient(135deg, #6B7280, #9CA3AF)',
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />

            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(achievement.category)}
                  <Badge className={getRarityColor(achievement.rarity)} badgeStyle="solid">
                    {achievement.rarity}
                  </Badge>
                </div>
                {!achievement.isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>

              <div className="text-center">
                <div
                  className={`text-6xl mb-3 ${!achievement.isUnlocked ? 'grayscale opacity-40' : ''}`}
                >
                  {achievement.icon}
                </div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {achievement.description}
              </p>

              {/* Progress Bar (for locked achievements with progress) */}
              {!achievement.isUnlocked && achievement.progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.progress.current}/{achievement.progress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full transition-all"
                      style={{
                        width: `${(achievement.progress.current / achievement.progress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{achievement.points} points</span>
                </div>

                {achievement.isUnlocked && achievement.earnedAt && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(achievement.earnedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to see more achievements
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
