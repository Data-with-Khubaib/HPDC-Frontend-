'use client';
import { use, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Building2, Hash, MapPin, Briefcase, Award, Clock, Pencil, FileText } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { applicationApi, commentApi, surveyApi, certificateApi } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { useApplicationCommentsSocket } from '@/lib/websocket';

export default function ApplicationDetailPage({ params }) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;
  const { user: currentUser } = useAuthStore();
  const [application, setApplication] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [takeActionModalOpen, setTakeActionModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionFile, setActionFile] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleMessageReceived = useCallback((message) => {
    if (message.type === 'new_comment' || message.type === 'comment_sent') {
      setComments((prev) => [...prev.filter((c) => c.id !== message.data.id), message.data]);
    } else if (message.type === 'edit_comment' || message.type === 'comment_edited') {
      setComments((prev) =>
        prev.map((c) => (c.id === message.data.id ? message.data : c))
      );
    }
  }, []);

  const { isConnected, sendMessage } = useApplicationCommentsSocket(
    applicationId,
    typeof window !== 'undefined' ? localStorage.getItem('hpdc_access_token') : null,
    handleMessageReceived
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await applicationApi.getById(applicationId);
        setApplication(res.data);
        
        try {
           const cRes = await commentApi.getComments(applicationId);
           const commentsArray = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || []);
           setComments(cRes.data?.data || []);
        } catch (e) {
           console.warn("Failed to fetch comments", e);
        }
      } catch (err) {
        console.error('Failed to fetch application:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [applicationId]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B7280]">Loading application details...</div>;
  }

  if (!application) {
    return (
      <div className="animate-slide-up">
        <p className="text-[#6B7280]">Application not found.</p>
      </div>
    );
  }

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      if (application.status === 'Conditional Approve') {
        await applicationApi.takeAction(applicationId, { comment_text: commentText.trim() });
        setApplication(prev => ({ ...prev, status: 'Assessment Schedule' }));
        // Still send via WS so others see the comment immediately
        sendMessage(commentText.trim(), currentUser?.id);
      } else {
        const sentViaWs = sendMessage(commentText.trim(), currentUser?.id);
        if (!sentViaWs) {
          const res = await commentApi.postComment(applicationId, commentText.trim());
          setComments((prev) => [...prev.filter(c => c.id !== res.data.id), res.data]);
        }
      }
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.comment_text || comment.text || '');
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await commentApi.editComment(applicationId, commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, comment_text: res.data.comment_text, updated_at: res.data.updated_at } : c))
      );
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to edit comment', err);
    }
  };

  const handleTakeActionSubmit = async () => {
    if (!actionMessage.trim()) return;
    try {
      setActionSubmitting(true);
      // Upload file if exists
      let documentUrl = null;
      let documentName = null;
      if (actionFile) {
        // In a real app we'd upload the file first.
        // Assuming we have an upload mechanism or just mocking for now since the API wants strings:
        documentUrl = "uploaded_file_url_placeholder";
        documentName = actionFile.name;
      }
      
      await applicationApi.takeAction(applicationId, {
        comment_text: actionMessage.trim(),
        document_url: documentUrl,
        document_name: documentName
      });
      
      setTakeActionModalOpen(false);
      setActionMessage('');
      setActionFile(null);
      // Ideally re-fetch or let WebSocket push the new comment
      const cRes = await commentApi.getComments(applicationId);
      setComments(cRes.data?.data || []);
      const aRes = await applicationApi.getById(applicationId);
      setApplication(aRes.data);
    } catch (err) {
      console.error('Failed to take action', err);
      alert('Failed to submit action.');
    } finally {
      setActionSubmitting(false);
    }
  };

  const canEdit = (comment) => {
    if (!currentUser || !currentUser.id) return false;
    const isSender = comment?.sender_id === currentUser.id || comment?.sender?.id === currentUser.id;
    console.log('canEdit Check:', { commentId: comment.id, senderId: comment.sender_id, currentUserId: currentUser.id, isSender });
    if (!isSender) return false;
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(comment.created_at || new Date()).getTime();
    return diff <= 15 * 60 * 1000;
  };

  const getEditTimeLeft = (comment) => {
    if (!comment?.timestamp) return null;
    return '15m';
  };

  const aboutFields = [
    { label: 'COMPANY NAME', value: application.company_name || '—', icon: Building2 },
    { label: 'REGISTRATION NUMBER', value: application.company?.registration_number || '—', icon: Hash },
    { label: 'ADDRESS', value: application.details?.[0]?.addresses?.[0]?.headoffice_address || '—', icon: MapPin },
    { label: 'PRODUCT AND SERVICES', value: application.details?.[0]?.brands?.[0]?.products || '—', icon: Briefcase },
    { label: 'CERTIFICATE TYPE', value: application.certificate_type || '—', icon: Award },
  ];

  const timeline = (application.timelines && application.timelines.length > 0) ? application.timelines : (application.logs && application.logs.length > 0) ? application.logs : [
    { action: 'Application Submitted', description: 'Submitted by company', date: new Date(!isNaN(Number(application.submitted_at)) ? Number(application.submitted_at) : application.submitted_at || 0).toLocaleDateString(), time: new Date(!isNaN(Number(application.submitted_at)) ? Number(application.submitted_at) : application.submitted_at || 0).toLocaleTimeString() }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
        <Link href="/company/applications" className="hover:text-gray-900 transition-colors">All Application</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-900">{application.application_no || 'Pending'}</span>
        <div className="ml-auto flex items-center gap-3">
          {application.status === 'Conditional Approve' && (
            <button 
              onClick={() => setTakeActionModalOpen(true)}
              className="bg-[#1B4332] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2D6A4F] shadow-sm transition-colors"
            >
              Take Action
            </button>
          )}
          <Badge status={application.status || 'Submitted'} />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Main Content */}
        <div className="flex-1 w-full space-y-6">
          
          {/* About Application Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#1B4332] font-bold text-lg mb-6">About Application</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {aboutFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-gray-800 font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#1B4332] font-bold text-lg mb-2">Comments</h2>
            <p className="text-[10px] text-gray-400 mb-4">
              Comments cannot be deleted, but you can edit your comment within 15 minutes of posting.
            </p>
            
            <div className="border border-gray-100 rounded-xl bg-gray-50/30 flex flex-col h-[400px]">
              
              <div className="flex-1 p-6 flex flex-col justify-start items-start overflow-y-auto space-y-6">
                {!Array.isArray(comments) || comments.length === 0 ? (
                  <p className="text-xs text-gray-400 m-auto">No comments yet.</p>
                ) : (
                  comments.map((comment) => {
                    const text = comment.comment_text || comment.text || '';
                    const isConditionalApprove = text.startsWith('[Conditional Approval]:');
                    const displayText = isConditionalApprove ? text.replace('[Conditional Approval]:', '').trim() : text;

                    return (
                    <div key={comment.id} className="w-full">
                      <p className="text-xs font-bold text-gray-900 mb-1">
                        {comment.sender_name || 'User'}
                      </p>
                      {editingId === comment.id ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4332]/50"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(comment.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(comment.id)} className="bg-[#1B4332] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#1B4332]/90">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className={isConditionalApprove ? "border-l-[3px] border-[#1B4332] pl-3 py-1" : ""}>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{displayText}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {comment.updated_at !== comment.created_at && <span className="text-[10px] text-gray-400 font-medium">Edited</span>}
                        {canEdit(comment) && (
                          <button onClick={() => handleEditComment(comment)} className="text-[#1B4332] hover:text-[#1B4332]/80 transition-colors" title="Edit Comment">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex gap-3 items-center">
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button 
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  className="px-5 py-2 bg-[#8EAA9E] hover:bg-[#6e8a7e] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Documents Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 pt-2">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Categorized Documents */}
              <div className="space-y-6">
                
                {/* Company Profile */}
                <div>
                  <h2 className="text-[#1B4332] font-bold text-lg mb-4">Company Profile</h2>
                  <div className="flex flex-col gap-4">
                    {application?.documents && application.documents.some(d => d.document_type === 'company_profile') ? (
                      application.documents.filter(d => d.document_type === 'company_profile').map((doc, idx) => (
                        <a key={doc.id || idx} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#1B4332]/50 transition-colors">
                          <div className="bg-gray-50 p-2 rounded-lg shrink-0 border border-gray-100">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 leading-tight truncate" title={doc.file_name}>{doc.file_name || doc.document_type}</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{doc.document_type?.replace(/_/g, ' ')}</p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No company profile attached.</p>
                    )}
                  </div>
                </div>

                {/* Questions Document */}
                <div>
                  <h2 className="text-[#1B4332] font-bold text-lg mb-4">Questions Document</h2>
                  <div className="flex flex-col gap-4">
                    {application?.documents && application.documents.some(d => d.document_type === 'esg_questionnaire') ? (
                      application.documents.filter(d => d.document_type === 'esg_questionnaire').map((doc, idx) => (
                        <a key={doc.id || idx} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#1B4332]/50 transition-colors">
                          <div className="bg-gray-50 p-2 rounded-lg shrink-0 border border-gray-100">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 leading-tight truncate" title={doc.file_name}>{doc.file_name || doc.document_type}</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{doc.document_type?.replace(/_/g, ' ')}</p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No questions document attached.</p>
                    )}
                  </div>
                </div>

                {/* Legal Documents */}
                <div>
                  <h2 className="text-[#1B4332] font-bold text-lg mb-4">Legal Documents</h2>
                  <div className="flex flex-col gap-4">
                    {application?.documents && application.documents.some(d => !['company_profile', 'esg_questionnaire', 'supporting_document'].includes(d.document_type)) ? (
                      application.documents.filter(d => !['company_profile', 'esg_questionnaire', 'supporting_document'].includes(d.document_type)).map((doc, idx) => (
                        <a key={doc.id || idx} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#1B4332]/50 transition-colors">
                          <div className="bg-gray-50 p-2 rounded-lg shrink-0 border border-gray-100">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 leading-tight truncate" title={doc.file_name}>{doc.file_name || doc.document_type}</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{doc.document_type?.replace(/_/g, ' ')}</p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No legal documents attached.</p>
                    )}
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>

      {/* Right Sidebar - Activity Timeline */}
        <div className="w-full xl:w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[500px] relative">
          <h2 className="text-[#1B4332] font-bold text-lg mb-8">Activity Timeline</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 max-h-[500px]">
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              {timeline.slice().reverse().map((event, idx, arr) => {
                const isLast = idx === arr.length - 1;
                const rawDate = event.date || event.created_at || application?.submitted_at || 0;
                const d = new Date(!isNaN(Number(rawDate)) ? Number(rawDate) : rawDate);
                const dateStr = d.toLocaleDateString();
                const timeStr = d.toLocaleTimeString();

                return (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute w-3 h-3 rounded-full -left-[7.5px] top-1 ${isLast ? 'bg-[#1B4332]' : 'bg-gray-300'}`}></div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{event.action_text || event.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.description || (event.email ? `Performed by ${event.email}` : '')}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <Clock size={12} className="text-gray-300" />
                      {dateStr} • {timeStr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Take Action Modal */}
      {takeActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Take Action</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <div className="relative">
                  <textarea
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    placeholder="Enter your response..."
                    className="w-full border-2 border-[#1B4332] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#1B4332]/10 min-h-[100px] resize-none text-gray-700"
                    maxLength={1000}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Attach File (optional)</label>
                <input 
                  type="file" 
                  onChange={(e) => setActionFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#1B4332]/10 file:text-[#1B4332]
                    hover:file:bg-[#1B4332]/20 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setTakeActionModalOpen(false);
                  setActionFile(null);
                  setActionMessage('');
                }}
                className="px-8 py-2.5 rounded-xl border border-[#1B4332] text-[#1B4332] font-bold text-sm hover:bg-[#1B4332]/5 transition-colors"
                disabled={actionSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleTakeActionSubmit}
                disabled={actionSubmitting || !actionMessage.trim()}
                className="px-8 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#2D6A4F] transition-colors disabled:opacity-50 shadow-sm"
              >
                {actionSubmitting ? 'Submitting...' : 'Submit Action'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
