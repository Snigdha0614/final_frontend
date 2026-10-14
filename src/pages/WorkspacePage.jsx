import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  CheckSquare,
  MessageSquare,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Send,
  Paperclip,
  Clock,
  ArrowRight,
  Download,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const WorkspacePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, chat, submissions, contract
  const [loading, setLoading] = useState(true);

  // New task modal
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Chat input
  const [messageText, setMessageText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);

  // Submission modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableFileName, setDeliverableFileName] = useState('');

  // Revision modal
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Dispute modal
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Scope Disagreement');
  const [disputeDesc, setDisputeDesc] = useState('');

  const loadWorkspace = async () => {
    try {
      const ws = await api.getWorkspaceById(id);
      setWorkspace(ws);

      const [taskList, msgList, subList] = await Promise.all([
        api.getWorkspaceTasks(id),
        api.getWorkspaceMessages(id),
        api.getWorkspaceSubmissions(id)
      ]);
      setTasks(taskList || []);
      setMessages(msgList || []);
      setSubmissions(subList || []);
    } catch (err) {
      addToast('Failed to load workspace: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
    const interval = setInterval(() => {
      // Periodic poll for chat and updates
      api.getWorkspaceMessages(id).then((m) => setMessages(m || [])).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createWorkspaceTask(workspace.id, {
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDueDate || undefined,
      });
      setTasks((prev) => [...prev, created]);
      setNewTaskModalOpen(false);
      setTaskTitle('');
      setTaskDesc('');
      addToast('Task milestone added!', 'success');
      loadWorkspace();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Task status toggle
  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === 'TODO'
        ? 'IN_PROGRESS'
        : currentStatus === 'IN_PROGRESS'
        ? 'DONE'
        : 'TODO';

    try {
      const updated = await api.updateTaskStatus(taskId, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      loadWorkspace(); // Recalculate progress %
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Send Chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachmentFile) return;

    let fileUrl = null;
    let fileName = null;

    if (attachmentFile) {
      setUploadingFile(true);
      try {
        const uploadRes = await api.uploadFile(attachmentFile);
        fileUrl = uploadRes.url;
        fileName = uploadRes.fileName;
      } catch (err) {
        addToast('File upload failed: ' + err.message, 'error');
        setUploadingFile(false);
        return;
      }
      setUploadingFile(false);
    }

    try {
      const msg = await api.sendWorkspaceMessage(workspace.id, {
        message: messageText || 'Sent attachment',
        attachmentUrl: fileUrl,
        attachmentName: fileName,
      });
      setMessages((prev) => [...prev, msg]);
      setMessageText('');
      setAttachmentFile(null);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Submit Deliverable
  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    try {
      await api.submitWork(workspace.id, {
        submissionNotes,
        deliverableUrl: deliverableUrl || 'https://drive.google.com/deliverables',
        deliverableFileName: deliverableFileName || 'Project_Final_Delivery.zip',
      });
      addToast('Deliverables submitted for client review!', 'success');
      setSubmitModalOpen(false);
      setSubmissionNotes('');
      setDeliverableUrl('');
      loadWorkspace();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Review deliverable (Approve or Revision)
  const handleApproveWork = async (subId) => {
    try {
      await api.reviewSubmission(workspace.id, subId, { approved: true });
      addToast('Work Approved! Escrow payment released 🎉', 'success');
      loadWorkspace();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRequestRevision = async (e) => {
    e.preventDefault();
    try {
      await api.reviewSubmission(workspace.id, selectedSubId, {
        approved: false,
        revisionFeedback,
      });
      addToast('Revision requested. Specialist notified.', 'info');
      setRevisionModalOpen(false);
      setRevisionFeedback('');
      loadWorkspace();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Raise dispute
  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    try {
      await api.createDispute({
        workspaceId: workspace.id,
        reason: disputeReason,
        description: disputeDesc,
      });
      addToast('Dispute opened. Admin mediator notified.', 'error');
      setDisputeModalOpen(false);
      loadWorkspace();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Project Workspace...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Workspace Unavailable</h2>
        <Link to="/dashboard" className="text-emerald-600 font-semibold text-sm">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const isClient = user?.id === workspace.client?.id;
  const isFreelancer = user?.id === workspace.freelancer?.id;
  const partner = isClient ? workspace.freelancer : workspace.client;

  const statusColors = {
    ACTIVE: 'bg-blue-100 text-blue-800',
    SUBMITTED: 'bg-amber-100 text-amber-800',
    IN_REVISION: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    DISPUTED: 'bg-rose-100 text-rose-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-lg">
                {workspace.workspaceType?.replace('_', ' ')}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  statusColors[workspace.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {workspace.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {workspace.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Escrow pill */}
            {workspace.escrowAmount > 0 && (
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase tracking-wider">
                    Escrow Balance
                  </span>
                  <span className="font-extrabold text-sm">
                    ${Number(workspace.escrowAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Dispute action */}
            {workspace.status !== 'COMPLETED' && (
              <button
                onClick={() => setDisputeModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Raise Dispute
              </button>
            )}

            {/* Submit deliverables button for freelancer */}
            {isFreelancer && workspace.status !== 'COMPLETED' && (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                Submit Deliverables
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Collaborators */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Project Progress</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{workspace.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${workspace.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400">Collaborating with:</span>
              <img
                src={partner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={partner?.fullName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200">{partner?.fullName}</span>
              <span className="text-[10px] text-slate-400">({isClient ? 'Specialist' : 'Client'})</span>
            </div>

            <span className="text-[11px] text-slate-400">
              Workspace ID: #{workspace.id}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Milestones &amp; Tasks ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Discussion Chat ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Deliverables &amp; Work ({submissions.length})
        </button>
      </div>

      {/* TAB 1: Tasks / Milestones Kanban */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Task Board</h2>
              <p className="text-xs text-slate-500">
                Click any task card to transition between To Do → In Progress → Done. Progress updates dynamically.
              </p>
            </div>
            <button
              onClick={() => setNewTaskModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column: To Do */}
            <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  To Do ({tasks.filter((t) => t.status === 'TODO').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>

              <div className="space-y-2.5">
                {tasks
                  .filter((t) => t.status === 'TODO')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer transition-all space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{task.dueDate ? `Due: ${task.dueDate}` : 'No date'}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Start →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column: In Progress */}
            <div className="bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                  In Progress ({tasks.filter((t) => t.status === 'IN_PROGRESS').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="space-y-2.5">
                {tasks
                  .filter((t) => t.status === 'IN_PROGRESS')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm hover:border-emerald-500 cursor-pointer transition-all space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{task.dueDate ? `Due: ${task.dueDate}` : 'Active'}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Done ✓</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column: Done */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Done ({tasks.filter((t) => t.status === 'DONE').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-2.5">
                {tasks
                  .filter((t) => t.status === 'DONE')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm opacity-90 cursor-pointer hover:border-slate-300 transition-all space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 line-through">
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Chat & Messages */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Chat message history */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500 text-xs py-16">
                No messages yet. Say hello and coordinate your contract specifications!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender?.id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-lg ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.sender?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={msg.sender?.fullName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{msg.sender?.fullName}</span>
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}

                        {/* Attachment display */}
                        {msg.attachmentUrl && (
                          <div className="mt-2 pt-2 border-t border-white/20 dark:border-slate-700/60 flex items-center gap-2">
                            <Paperclip className="w-3.5 h-3.5" />
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline text-[11px]"
                            >
                              {msg.attachmentName || 'Download Attachment'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-3">
            <label className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachmentFile(e.target.files[0])}
              />
            </label>

            {attachmentFile && (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg truncate max-w-xs">
                {attachmentFile.name}
              </span>
            )}

            <input
              type="text"
              placeholder="Type your message or project note..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            <button
              type="submit"
              disabled={uploadingFile}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Deliverables & Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Deliverables &amp; Work Submissions</h2>
              <p className="text-xs text-slate-500">
                Review work packages, approve to release escrow, or request revisions.
              </p>
            </div>

            {isFreelancer && (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                Submit New Deliverable
              </button>
            )}
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              No deliverables submitted yet for this contract.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Submitted by {sub.submitter?.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : sub.status === 'REVISION_REQUESTED'
                              ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ''}
                      </span>
                    </div>

                    {/* Deliverable File Download or URL */}
                    {sub.deliverableUrl && (
                      <a
                        href={sub.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {sub.deliverableFileName || 'Open Deliverable'}
                      </a>
                    )}
                  </div>

                  {/* Submission Notes */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {sub.submissionNotes}
                  </div>

                  {/* Revision Feedback note if any */}
                  {sub.revisionFeedback && (
                    <div className="bg-orange-50/70 dark:bg-orange-950/40 p-3.5 rounded-xl border border-orange-200 dark:border-orange-800 text-xs text-orange-950 dark:text-orange-300 space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5" /> Revision Requested:
                      </span>
                      <p>{sub.revisionFeedback}</p>
                    </div>
                  )}

                  {/* Client Approval Controls */}
                  {isClient && sub.status === 'PENDING_REVIEW' && (
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedSubId(sub.id);
                          setRevisionModalOpen(true);
                        }}
                        className="px-4 py-2 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 rounded-xl border border-orange-200 dark:border-orange-800 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Request Revision
                      </button>

                      <button
                        onClick={() => handleApproveWork(sub.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve &amp; Release Payment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Task Modal */}
      <Modal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        title="Add Workspace Milestone Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Responsive Navigation & Header"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Details</label>
            <textarea
              rows={3}
              placeholder="Checklist or description..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Deliverables Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Project Deliverables"
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Submission Overview Notes *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Summarize the completed deliverables, instructions, setup notes, or links..."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deliverable URL (GitHub, Figma, Google Drive, or Cloud Link)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Package / File Name
            </label>
            <input
              type="text"
              placeholder="e.g. Deliverables_v1.0.zip"
              value={deliverableFileName}
              onChange={(e) => setDeliverableFileName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Send Deliverable
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Request Work Revision"
      >
        <form onSubmit={handleRequestRevision} className="space-y-4">
          <p className="text-xs text-slate-600">
            Specify changes or improvements required from the freelancer before release.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Revision Feedback &amp; Adjustments Needed *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detail specific issues, visual bugs, or missing scope items..."
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRevisionModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Send Revision Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Raise Dispute Modal */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="File Formal Workspace Dispute"
      >
        <form onSubmit={handleRaiseDispute} className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            Opening a dispute halts escrow release and invites an administrator mediator to review messages and deliverables.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason *</label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Scope Disagreement">Scope Disagreement</option>
              <option value="Unresponsive Partner">Unresponsive Partner</option>
              <option value="Unsatisfactory Quality">Unsatisfactory Quality</option>
              <option value="Missed Deadline">Missed Deadline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation *</label>
            <textarea
              required
              rows={4}
              placeholder="Explain what went wrong and what resolution you are requesting..."
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDisputeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Submit Dispute
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
