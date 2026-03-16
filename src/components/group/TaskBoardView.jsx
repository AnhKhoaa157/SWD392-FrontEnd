import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Plus, X, Loader2, ClipboardList, Users } from 'lucide-react';
import { toast } from 'sonner';
import { groupService } from '../../services/app.service';
import taskService from '../../services/task.service';

const TASK_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'inprogress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
];

const UI_TO_API_STATUS = {
  todo: 'TODO',
  inprogress: 'IN_PROGRESS',
  review: 'REVIEW',
  done: 'DONE'
};

const API_TO_UI_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  REVIEW: 'review',
  DONE: 'done'
};

const UI_TO_API_PRIORITY = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH'
};

const API_TO_UI_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

const emptyTaskForm = {
  title: '',
  description: '',
  assigneeId: '',
  priority: 'Medium',
  status: 'todo',
  tags: '',
  dueDate: ''
};

const normalizeAvatar = (user) => user?.avatarURL || user?.avatarUrl || user?.avatar_url || '';

const getInitials = (name) => String(name || 'U')
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const toArray = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const toTaskRow = (payload) => payload?.data || payload || null;

export function TaskBoardView({ groupId }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const normalizeTask = (row) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    assignee: row.assignee
      ? {
        id: row.assignee.id,
        name: row.assignee.fullName,
        avatar: normalizeAvatar(row.assignee)
      }
      : null,
    priority: API_TO_UI_PRIORITY[String(row.priority || '').toUpperCase()] || 'Medium',
    status: API_TO_UI_STATUS[String(row.status || '').toUpperCase()] || 'todo',
    tags: Array.isArray(row.tags) ? row.tags : [],
    dueDate: row.dueDate ? String(row.dueDate).slice(0, 10) : null,
    createdAt: row.createdAt || new Date().toISOString()
  });

  useEffect(() => {
    const loadTasks = async () => {
      if (!groupId) {
        setTasks([]);
        return;
      }

      try {
        setLoadingTasks(true);
        const response = await taskService.getAllTasks({ groupId });
        const rows = toArray(response);
        setTasks(rows.map(normalizeTask));
      } catch {
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [groupId]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!groupId) {
        setMembers([]);
        return;
      }

      try {
        setLoadingMembers(true);
        const response = await groupService.getGroupMembers(groupId);
        const rows = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];
        const normalized = rows.map((row) => {
          const student = row?.student || {};
          const id = row?.studentId || student?.id || student?.userId;
          return {
            id,
            fullName: student?.fullName || 'Unknown user',
            email: student?.email || '',
            avatarURL: normalizeAvatar(student)
          };
        }).filter((item) => item.id);
        setMembers(normalized);
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, [groupId]);

  const columns = useMemo(() => {
    return TASK_COLUMNS.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.id)
    }));
  }, [tasks]);

  if (!groupId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F27125]/10 text-[#F27125] flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Task Board chưa sẵn sàng</h2>
          <p className="text-slate-600 mt-3">
            Bạn cần tham gia hoặc được gán vào một nhóm trước khi xem và quản lý task của nhóm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900"># 📋 task-board</h1>
            <p className="text-sm text-gray-600 mt-0.5">Sinh viên được xem tiến độ task do giảng viên tạo cho nhóm</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        {!loadingTasks && tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-5">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Chưa có task nào</h2>
              <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                Nhóm của bạn chưa tạo công việc nào trên board. Hãy tạo task đầu tiên để bắt đầu phân công và theo dõi tiến độ.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 mt-6 bg-[#F27125] hover:bg-[#d96420] text-white px-5 py-3 rounded-xl font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Tạo task đầu tiên
              </button>
            </div>
          </div>
        ) : (
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col w-80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500">({column.tasks.length})</span>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {loadingTasks && column.id === 'todo' && (
                  <div className="text-xs text-gray-500 flex items-center gap-2 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading tasks...
                  </div>
                )}
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1">{task.title}</h4>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                    )}

                    {task.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.map((tag, index) => (
                          <span key={`${task.id}-${index}`} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {task.assignee?.avatar ? (
                          <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded bg-[#F27125]/10 text-[#F27125] text-[10px] font-semibold flex items-center justify-center">
                            {getInitials(task.assignee?.name || 'Unassigned')}
                          </div>
                        )}
                        <span className="text-xs text-gray-600 truncate">{task.assignee?.name || 'Unassigned'}</span>
                      </div>

                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-full px-2 py-2 border border-gray-200 rounded text-xs bg-gray-50 text-gray-700 font-medium">
                        Trạng thái: {TASK_COLUMNS.find((statusColumn) => statusColumn.id === task.status)?.title || 'To Do'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
