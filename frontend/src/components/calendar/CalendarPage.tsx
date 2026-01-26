'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Plus,
  Video,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const demoMeetings = [
    {
      id: '1',
      title: 'Team Standup',
      date: new Date(year, month, 15, 10, 0),
      duration: 30,
      participants: 5,
      type: 'video',
    },
    {
      id: '2',
      title: 'Client Review',
      date: new Date(year, month, 20, 14, 0),
      duration: 60,
      participants: 3,
      type: 'video',
    },
    {
      id: '3',
      title: 'Sprint Planning',
      date: new Date(year, month, 25, 9, 0),
      duration: 90,
      participants: 8,
      type: 'video',
    },
  ];

  const getMeetingsForDay = (day: number) => {
    return demoMeetings.filter(
      meeting =>
        meeting.date.getDate() === day &&
        meeting.date.getMonth() === month &&
        meeting.date.getFullYear() === year
    );
  };

  const selectedDayMeetings = selectedDate
    ? getMeetingsForDay(selectedDate.getDate())
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                Calendar
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your meetings and schedule
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Meeting
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {MONTHS[month]} {year}
                    </CardTitle>
                    <CardDescription>
                      {selectedDate
                        ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                        : 'Select a date to view meetings'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={previousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground p-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const meetings = getMeetingsForDay(day);
                    const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === month;
                    const isCurrentDay = isToday(day);

                    return (
                      <button
                        key={day}
                        onClick={() =>
                          setSelectedDate(new Date(year, month, day))
                        }
                        className={`aspect-square p-1 rounded-md border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : isCurrentDay
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{day}</div>
                        {meetings.length > 0 && (
                          <div className="flex gap-0.5 justify-center">
                            {meetings.slice(0, 3).map(meeting => (
                              <div
                                key={meeting.id}
                                className={`w-1 h-1 rounded-full ${
                                  isSelected
                                    ? 'bg-white'
                                    : 'bg-blue-600 dark:bg-blue-400'
                                }`}
                              />
                            ))}
                            {meetings.length > 3 && (
                              <span
                                className={`text-xs ${
                                  isSelected ? 'text-white' : 'text-muted-foreground'
                                }`}
                              >
                                +{meetings.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
                  </CardTitle>
                  <CardDescription>
                    {selectedDayMeetings.length} meeting
                    {selectedDayMeetings.length !== 1 ? 's' : ''} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDayMeetings.length > 0 ? (
                    selectedDayMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{meeting.title}</h4>
                          <Badge variant="outline">{meeting.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.date.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}{' '}
                            ({meeting.duration} min)
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {meeting.participants}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Video className="h-3 w-3 mr-2" />
                          Join Meeting
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No meetings scheduled</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="h-3 w-3 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoMeetings
                  .filter(
                    meeting =>
                      meeting.date >= today &&
                      meeting.date <=
                        new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                  )
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(meeting => (
                    <div
                      key={meeting.id}
                      className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setSelectedDate(meeting.date)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {meeting.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {meeting.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          {meeting.date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {meeting.participants}
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
