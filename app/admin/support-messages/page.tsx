"use client";

import { useEffect, useState, useCallback } from "react";
import {
  othersService,
  SupportMessage,
  SupportMessagesListResponse,
} from "@/lib/api/services";
import {
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChatAlt2,
  HiOutlineInbox,
  HiOutlineMailOpen,
} from "react-icons/hi";
import { MdOutlineSupportAgent } from "react-icons/md";

export default function SupportMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [summary, setSummary] = useState<{
    total_messages: number;
    unread_messages: number;
    read_messages: number;
  }>({
    total_messages: 0,
    unread_messages: 0,
    read_messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<string>("all"); // "all", "unread", "read"
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: {
        search?: string;
        is_read?: boolean;
        page?: number;
        page_size?: number;
      } = {
        page,
        page_size: pageSize,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (readFilter === "unread") {
        params.is_read = false;
      } else if (readFilter === "read") {
        params.is_read = true;
      }

      const res: SupportMessagesListResponse = await othersService.getSupportMessages(params);

      if (res && res.data) {
        setMessages(res.data);
        if (res.summary) {
          setSummary(res.summary);
        }
        setTotalCount(res.count ?? res.data.length);
        setHasNext(Boolean(res.has_next));
        setHasPrevious(Boolean(res.has_previous));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch support messages:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not load support messages. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, readFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Open modal and automatically mark message as read if unread
  const handleOpenDetail = async (msg: SupportMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      try {
        await othersService.markMessageReadStatus(msg.id, true);
        setMessages((prev) =>
          prev.map((item) => (item.id === msg.id ? { ...item, is_read: true } : item))
        );
        setSummary((prev) => ({
          ...prev,
          unread_messages: Math.max(0, prev.unread_messages - 1),
          read_messages: prev.read_messages + 1,
        }));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  // Toggle Read / Unread Status
  const handleToggleReadStatus = async (msg: SupportMessage) => {
    try {
      setUpdatingStatus(true);
      const nextStatus = !msg.is_read;
      await othersService.markMessageReadStatus(msg.id, nextStatus);

      setMessages((prev) =>
        prev.map((item) => (item.id === msg.id ? { ...item, is_read: nextStatus } : item))
      );

      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextStatus });
      }

      setSummary((prev) => ({
        ...prev,
        unread_messages: nextStatus
          ? Math.max(0, prev.unread_messages - 1)
          : prev.unread_messages + 1,
        read_messages: nextStatus
          ? prev.read_messages + 1
          : Math.max(0, prev.read_messages - 1),
      }));
    } catch (err: any) {
      alert("Failed to update message status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this support inquiry?")) {
      return;
    }

    try {
      setDeletingId(id);
      await othersService.deleteSupportMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setMessages((prev) => prev.filter((item) => item.id !== id));
      setSummary((prev) => ({
        ...prev,
        total_messages: Math.max(0, prev.total_messages - 1),
      }));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-displayPlayFair text-[#1d1a17] flex items-center gap-2.5">
            <MdOutlineSupportAgent className="text-[#8B7355] w-7 h-7" />
            Support Messages & Inquiries
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-cambria">
            Manage inquiries, feedback, and customer support messages received from the website.
          </p>
        </div>

        <button
          onClick={() => fetchMessages()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2DC] rounded-xl text-xs font-semibold text-[#1d1a17] hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <HiOutlineRefresh className={`w-4 h-4 text-[#8B7355] ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2DC] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Total Inquiries</p>
            <p className="text-2xl font-bold text-[#1d1a17] mt-1">
              {summary.total_messages || totalCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#8B7355]">
            <HiOutlineInbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2DC] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-600">Unread Messages</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {summary.unread_messages}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <HiOutlineChatAlt2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2DC] shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-600">Read & Processed</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {summary.read_messages}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <HiOutlineMailOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2DC] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E8E2DC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8B7355] text-[#1d1a17]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-medium mr-1 hidden sm:inline">Status:</span>
          {(["all", "unread", "read"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setReadFilter(filter);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                readFilter === filter
                  ? "bg-[#8B7355] text-white shadow-2xs"
                  : "bg-[#FAF8F5] text-[#64748B] hover:text-[#1d1a17] hover:bg-[#F1EDE8]"
              }`}
            >
              {filter === "all" ? "All Messages" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages Table ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-7 h-7 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#64748B]">Loading support inquiries...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3 px-4">
            <p className="text-xs text-rose-600">{error}</p>
            <button
              onClick={() => fetchMessages()}
              className="px-4 py-2 bg-[#8B7355] text-white text-xs font-semibold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center space-y-2 px-4">
            <HiOutlineInbox className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-[#1d1a17]">No support messages found</p>
            <p className="text-xs text-[#64748B]">
              {search || readFilter !== "all"
                ? "Try adjusting your search query or filters."
                : "Inquiries submitted via the website contact form will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E2DC] text-[#64748B] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EDE8]">
                {messages.map((msg) => {
                  const senderDisplayName = msg.name || msg.sender_name || "Anonymous Visitor";
                  const senderDisplayEmail = msg.email || msg.sender_email || "No email";

                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-[#FCF2E9]/40 transition-colors ${
                        !msg.is_read ? "bg-amber-50/40 font-medium" : ""
                      }`}
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {msg.is_read ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <HiOutlineCheck className="w-3 h-3" /> Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Unread
                          </span>
                        )}
                      </td>

                      {/* Sender */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[#1d1a17] font-semibold">
                            {senderDisplayName}
                          </span>
                          <span className="text-[#64748B] text-[11px]">
                            {senderDisplayEmail}
                          </span>
                          {msg.phone && (
                            <span className="text-[#8B7355] text-[11px]">
                              {msg.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 whitespace-nowrap max-w-[200px] truncate text-[#1d1a17]">
                        {msg.subject || (
                          <span className="text-gray-400 italic">No subject</span>
                        )}
                      </td>

                      {/* Message Snippet */}
                      <td className="py-3.5 px-4 max-w-[280px] truncate text-[#64748B]">
                        {msg.message}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#64748B] text-[11px]">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(msg)}
                            title="View inquiry details"
                            className="p-1.5 rounded-lg text-[#8B7355] hover:bg-[#8B7355]/10 transition-colors cursor-pointer"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleReadStatus(msg)}
                            title={msg.is_read ? "Mark as Unread" : "Mark as Read"}
                            className="p-1.5 rounded-lg text-[#64748B] hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {msg.is_read ? (
                              <HiOutlineChatAlt2 className="w-4 h-4" />
                            ) : (
                              <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            disabled={deletingId === msg.id}
                            title="Delete message"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && messages.length > 0 && (
          <div className="p-4 border-t border-[#E8E2DC] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#64748B]">
            <p>
              Showing Page <span className="font-bold text-[#1d1a17]">{page}</span>
              {totalCount > 0 && (
                <span> of approx {Math.ceil(totalCount / pageSize)} ({totalCount} total)</span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrevious && page === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2DC] text-[#1d1a17] disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HiOutlineChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2DC] text-[#1d1a17] disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next <HiOutlineChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detailed Message Modal ── */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E8E2DC] bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
                  <HiOutlineMail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1a17]">
                    Inquiry #{selectedMessage.id}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleReadStatus(selectedMessage)}
                  disabled={updatingStatus}
                  className="px-3 py-1 rounded-xl text-[11px] font-semibold border border-[#E8E2DC] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Contact Info Details */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2DC] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[#64748B] flex items-center gap-1.5">
                    <HiOutlineUser className="w-3.5 h-3.5 text-[#8B7355]" /> Name:
                  </p>
                  <p className="font-semibold text-[#1d1a17] mt-0.5">
                    {selectedMessage.name || selectedMessage.sender_name || "Anonymous"}
                  </p>
                </div>

                <div>
                  <p className="text-[#64748B] flex items-center gap-1.5">
                    <HiOutlineMail className="w-3.5 h-3.5 text-[#8B7355]" /> Email:
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email || selectedMessage.sender_email || ""}`}
                    className="font-semibold text-[#8B7355] hover:underline mt-0.5 block truncate"
                  >
                    {selectedMessage.email || selectedMessage.sender_email || "N/A"}
                  </a>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <p className="text-[#64748B] flex items-center gap-1.5">
                      <HiOutlinePhone className="w-3.5 h-3.5 text-[#8B7355]" /> Phone:
                    </p>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="font-semibold text-[#1d1a17] hover:underline mt-0.5 block"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-[#64748B] flex items-center gap-1.5">
                    <HiOutlineClock className="w-3.5 h-3.5 text-[#8B7355]" /> Status:
                  </p>
                  <p className="font-semibold text-[#1d1a17] mt-0.5">
                    {selectedMessage.is_read ? "Read" : "Unread"}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2DC]">
                <p className="text-xs text-[#64748B] font-medium mb-1">Subject</p>
                <p className="text-sm font-bold text-[#1d1a17]">
                  {selectedMessage.subject || "No Subject"}
                </p>
              </div>

              {/* Message Content */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2DC]">
                <p className="text-xs text-[#64748B] font-medium mb-2">Message</p>
                <p className="text-xs leading-relaxed text-[#334155] whitespace-pre-wrap font-cambria">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8E2DC] bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlineTrash className="w-4 h-4" /> Delete
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email || selectedMessage.sender_email || ""}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Support Inquiry")}`}
                  className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HiOutlineMail className="w-4 h-4" /> Reply by Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1d1a17] text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
