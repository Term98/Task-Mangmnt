import { TaskBoard } from '@/components/task-board';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6">
        <TaskBoard />
      </main>
    </div>
  );
}