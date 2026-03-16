import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import questionService from '../../services/question.service';

const toArray = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export function QAMonitoringView({ initialStatusFilter = 'ALL' }) {
  const [questions, setQuestions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionService.getAllQuestions();
      setQuestions(toArray(response));
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error(error?.message || 'Không thể tải danh sách Q&A');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setStatusFilter(initialStatusFilter || 'ALL');
  }, [initialStatusFilter]);

  const filteredQuestions = useMemo(() => {
    if (statusFilter === 'ALL') return questions;
    return questions.filter((item) => String(item.status || '').toUpperCase() === statusFilter);
  }, [questions, statusFilter]);

  const handleResolve = async (questionId) => {
    try {
      setResolvingId(questionId);
      await questionService.resolveQuestion(questionId);
      toast.success('Đã đánh dấu câu hỏi là resolved');
      await loadQuestions();
    } catch (error) {
      console.error('Failed to resolve question:', error);
      toast.error(error?.message || 'Không thể cập nhật trạng thái câu hỏi');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Q&A Oversight</h2>
          <p className="text-sm text-gray-500 mt-1">Manager theo dõi ticket đã escalated và đóng các câu hỏi đã xử lý xong.</p>
        </div>
        <button onClick={loadQuestions} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Trạng thái</span>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="ALL">Tất cả</option>
          <option value="WAITING_LECTURER">Đợi lecturer</option>
          <option value="ESCALATED_TO_MANAGER">Đã escalate</option>
          <option value="RESOLVED">Đã resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-[#F27125] animate-spin" /></div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 px-6">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Chưa có Q&A phù hợp</h3>
            <p className="text-sm text-gray-500 mt-2">Không có câu hỏi nào theo bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredQuestions.map((question) => {
              const status = String(question.status || '').toUpperCase();
              const isEscalated = status === 'ESCALATED_TO_MANAGER';
              const isResolved = status === 'RESOLVED';

              return (
                <div key={question.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-bold text-gray-900">{question.title || `Question #${question.id}`}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isResolved ? 'bg-green-100 text-green-700' : isEscalated ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {status}
                      </span>
                      <span className="text-xs text-gray-500">{question.group?.groupName || 'Unknown group'} · {question.group?.class?.className || 'Unknown class'}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.content}</p>
                    <p className="text-xs text-gray-500 mt-3">Người hỏi: {question.asker?.fullName || 'Unknown'}</p>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(question.id)}
                      disabled={resolvingId === question.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${isEscalated ? 'bg-[#F27125] hover:bg-[#d96420] text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'} disabled:opacity-60`}
                    >
                      {isEscalated ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {resolvingId === question.id ? 'Đang cập nhật...' : 'Đánh dấu resolved'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}