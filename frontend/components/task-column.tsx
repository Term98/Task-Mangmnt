'use client';

import { DroppableProvided } from 'react-beautiful-dnd';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  provided: DroppableProvided;
}

export function TaskColumn({ title, tasks, provided }: TaskColumnProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="space-y-4"
      >
        {tasks.map((task, index) => (
          <Card key={task.id} className="p-4 cursor-move">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </Card>
        ))}
        {provided.placeholder}
      </CardContent>
    </Card>
  );
}