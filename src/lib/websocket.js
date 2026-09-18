// src/lib/websocket.js
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export function useApplicationCommentsSocket(applicationId, token, onMessageReceived) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!applicationId || !token) return;

    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000') +
      `/ws/applications/${applicationId}/comments?token=${encodeURIComponent(token)}`;

    let socket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (onMessageReceived) {
            onMessageReceived(parsed);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
      };

      socket.onerror = (err) => {
        console.warn('WebSocket error:', err);
        setIsConnected(false);
      };
    } catch (err) {
      console.warn('WebSocket connection failed:', err);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [applicationId, token, onMessageReceived]);

  const sendMessage = useCallback((commentText, senderId) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_comment',
        comment_text: commentText,
        sender_id: senderId,
      }));
      return true;
    }
    return false;
  }, []);

  const editMessage = useCallback((commentId, newText, senderId) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'edit_comment',
        comment_id: commentId,
        comment_text: newText,
        sender_id: senderId,
      }));
      return true;
    }
    return false;
  }, []);

  return { isConnected, sendMessage, editMessage };
}
