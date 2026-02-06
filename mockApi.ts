
import { WorkTask, WorkUpdate, User, TaskStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'worksync_users',
  TASKS: 'worksync_tasks',
  CURRENT_USER: 'worksync_session'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // --- AUTH ---
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return session ? JSON.parse(session) : null;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }
    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, avatar: `https://picsum.photos/seed/${email}/200` };
    users.push({ ...newUser, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPass } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // --- TASKS ---
  getTasks: async (userId: string): Promise<WorkTask[]> => {
    await delay(600);
    const allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    return allTasks.filter((t: WorkTask) => t.userId === userId).sort((a: WorkTask, b: WorkTask) => b.createdAt - a.createdAt);
  },

  createTask: async (task: Partial<WorkTask>, userId: string): Promise<WorkTask> => {
    await delay(500);
    const newTask: WorkTask = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title: task.title || '',
      description: task.description || '',
      startTime: task.startTime || new Date().toISOString(),
      expectedDuration: task.expectedDuration || 60,
      status: TaskStatus.PENDING,
      currentProgress: 0,
      totalTimeSpent: 0,
      createdAt: Date.now(),
      updates: []
    };
    const allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    allTasks.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
    return newTask;
  },

  updateTask: async (taskId: string, updates: Partial<WorkTask>): Promise<WorkTask> => {
    await delay(400);
    const allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const idx = allTasks.findIndex((t: WorkTask) => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');
    
    allTasks[idx] = { ...allTasks[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
    return allTasks[idx];
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await delay(400);
    let allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    allTasks = allTasks.filter((t: WorkTask) => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
  },

  addWorkUpdate: async (taskId: string, update: Partial<WorkUpdate>): Promise<WorkTask> => {
    await delay(500);
    const allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const idx = allTasks.findIndex((t: WorkTask) => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');
    
    const newUpdate: WorkUpdate = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      timestamp: Date.now(),
      percentage: update.percentage || 0,
      timeSpent: update.timeSpent || 0,
      note: update.note || ''
    };
    
    allTasks[idx].updates.push(newUpdate);
    allTasks[idx].currentProgress = newUpdate.percentage;
    allTasks[idx].totalTimeSpent += newUpdate.timeSpent;
    
    if (newUpdate.percentage >= 100) {
      allTasks[idx].status = TaskStatus.COMPLETED;
    } else if (newUpdate.percentage > 0) {
      allTasks[idx].status = TaskStatus.IN_PROGRESS;
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
    return allTasks[idx];
  }
};
