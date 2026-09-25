'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, Send, ChevronRight, Clock } from 'lucide-react';
import { applicationApi, commentApi } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { useApplicationCommentsSocket } from '@/lib/websocket';

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [application, setApplication] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [takeActionModalOpen, setTakeActionModalOpen] = useState(false);
  const [actionSelection, setActionSelection] = useState('Assessment Schedule');
  const [actionReason, setActionReason] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const timeline = application ? ((application.timelines && application.timelines.length > 0) ? application.timelines : (application.logs && application.logs.length > 0) ? application.logs : [
    { action: 'Application Submitted', description: 'Submitted by company', date: new Date(!isNaN(Number(application.submitted_at)) ? Number(application.submitted_at) : application.submitted_at || 0).toLocaleDateString(), time: new Date(!isNaN(Number(application.submitted_at)) ? Number(application.submitted_at) : application.submitted_at || 0).toLocaleTimeString() }
  ]) : [];

  const handleMessageReceived = useCallback((message) => {
    if (message.type === 'new_comment' || message.type === 'comment_sent') {
      setComments((prev) => [...prev.filter(c => c.id !== message.data.id), message.data]);
    } else if (message.type === 'edit_comment' || message.type === 'comment_edited') {
      setComments((prev) =>
        prev.map((c) => (c.id === message.data.id ? message.data : c))
      );
    }
  }, []);

  const { isConnected, sendMessage } = useApplicationCommentsSocket(
    id,
    typeof window !== 'undefined' ? localStorage.getItem('hpdc_access_token') : null,
    handleMessageReceived
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await applicationApi.getById(id);
        setApplication(res.data);
        
        try {
           const cRes = await commentApi.getComments(id);
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
  }, [id]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading application details...</div>;
  }

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      const sentViaWs = sendMessage(commentText.trim(), currentUser?.id);
      if (!sentViaWs) {
        const res = await commentApi.postComment(id, commentText.trim());
        setComments((prev) => [...prev.filter(c => c.id !== res.data.id), res.data]);
      }
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const canEdit = (comment) => {
    if (!currentUser || !currentUser.id) return false;
    const isSender = String(comment?.sender_id) === String(currentUser.id) || String(comment?.sender?.id) === String(currentUser.id);
    console.log('Admin canEdit Check:', { 
      commentId: comment.id, 
      commentText: comment.comment_text,
      senderId: comment.sender_id, 
      senderObjId: comment?.sender?.id,
      currentUserId: currentUser.id, 
      isSender 
    });
    return isSender;
  };

  const handleEditComment = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.comment_text || comment.text || '');
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await commentApi.editComment(id, commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, comment_text: res.data.comment_text, updated_at: res.data.updated_at } : c))
      );
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to edit comment', err);
    }
  };

  const handleActionSubmit = async () => {
    try {
      setActionSubmitting(true);
      await applicationApi.updateStatus(id, {
        status: actionSelection,
        reason: actionReason.trim()
      });
      setTakeActionModalOpen(false);
      setActionReason('');
      
      const res = await applicationApi.getById(id);
      setApplication(res.data);
      const cRes = await commentApi.getComments(id);
      setComments(cRes.data?.data || []);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    } finally {
      setActionSubmitting(false);
    }
  };

  if (!application) {
    return <div className="p-8 text-center text-sm text-[#6B7280]">Application not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
        <Link href="/admin/applications" className="hover:text-gray-900 transition-colors">All Application</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-900">{application?.application_no}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Main Content */}
        <div className="flex-1 w-full space-y-6">
          
          {/* About Application Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#1B4332] font-bold text-lg mb-6">About Application</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">COMPANY NAME</p>
                <p className="text-gray-800 font-semibold text-sm">{application?.company?.company_name || application?.company_name || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">REGISTRATION NUMBER</p>
                <p className="text-gray-800 font-semibold text-sm">{application?.company?.registration_number || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">ADDRESS</p>
                <p className="text-gray-800 font-medium text-sm">{application?.details?.addresses?.[0]?.headoffice_address || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">PRODUCT AND SERVICES</p>
                <p className="text-gray-800 font-medium text-sm">{application?.details?.brands?.[0]?.products || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">CERTIFICATE TYPE</p>
                <p className="text-gray-800 font-medium text-sm">{application?.certificate_type || '-'}</p>
              </div>
            </div>
          </div>

          {/* All Members Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#1B4332] font-bold text-lg mb-4">All Members ( 0 )</h2>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-sm text-gray-500 italic p-2">No members assigned yet.</span>
            </div>
          </div>



          {/* Comments Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#1B4332] font-bold text-lg mb-2">Comments</h2>
            <p className="text-[10px] text-gray-400 mb-4">
              Comments without tags are visible to all assigned consultants. Tag a specific consultant to create a private thread visible only to you and that consultant. Use @All to notify all assigned consultants. The Company is not included unless tagged separately.
            </p>
            
            <div className="border border-gray-100 rounded-xl bg-gray-50/30 flex flex-col h-[400px]">
              
              <div className="flex-1 p-6 flex flex-col justify-start items-start overflow-y-auto space-y-6">
                {comments?.length === 0 ? (
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
                    {application?.documents && application.documents.some(d => !['company_profile', 'esg_questionnaire'].includes(d.document_type)) ? (
                      application.documents.filter(d => !['company_profile', 'esg_questionnaire'].includes(d.document_type)).map((doc, idx) => (
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
        <div className="w-full xl:w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[600px] relative">
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
                    <div className={"absolute w-3 h-3 rounded-full -left-[7.5px] top-1 " + (isLast ? "bg-[#1B4332]" : "bg-gray-300")}></div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{event.action_text || event.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.description || (event.email ? "Performed by " + event.email : '')}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <Clock size={12} className="text-gray-300" />
                      {dateStr} • {timeStr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {!['Approved', 'Rejected', 'Conditional Approve'].includes(application.status) && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setTakeActionModalOpen(true)}
                className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
              >
                Take Action
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {takeActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-extrabold text-[#1B4332]">Action</h2>
              <div className="relative w-48">
                <select
                  value={actionSelection}
                  onChange={(e) => setActionSelection(e.target.value)}
                  className="w-full appearance-none px-4 py-2 pr-8 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer outline-none focus:border-[#1B4332]"
                >
                  <option value="Assessment Schedule">Assessment Schedule</option>
                  <option value="Conditional Approve">Conditional Approve</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1B4332]">Reason</label>
              <div className="relative">
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full border-2 border-[#1B4332] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 min-h-[140px] resize-none text-gray-700 font-medium"
                  maxLength={500}
                />
                <div className="text-right text-xs font-semibold text-[#1B4332] mt-2">{actionReason.length}/500</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setTakeActionModalOpen(false)}
                className="px-8 py-2.5 rounded-xl border border-[#1B4332] text-[#1B4332] font-bold text-sm hover:bg-[#1B4332]/5 transition-colors"
                disabled={actionSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={actionSubmitting}
                className={`px-8 py-2.5 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50 shadow-sm ${
                  actionSelection === 'Assessment Schedule' ? 'bg-[#C29B28] hover:bg-[#A38221]' : 
                  actionSelection === 'Conditional Approve' ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 
                  actionSelection === 'Approved' ? 'bg-[#1B4332] hover:bg-[#143325]' :
                  'bg-[#DC2626] hover:bg-[#B91C1C]'
                }`}
              >
                {actionSubmitting ? 'Submitting...' : actionSelection}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
