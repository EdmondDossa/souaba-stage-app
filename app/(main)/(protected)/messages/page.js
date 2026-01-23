"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Loader2, MessageCircle, Menu, X } from "lucide-react";
import useAuthContext from "@/context/auth";
import getAxiosInstance from "@/lib/request";
import { socketManager } from "@/lib/socket";
import { useRouter, useSearchParams } from "next/navigation";

const deriveConversationLabel = (conversation = {}) =>
  conversation?.title ||
  conversation?.property?.name ||
  conversation?.accommodation?.name ||
  conversation?.host?.name ||
  conversation?.hotel?.name ||
  "";

const normalizeListingId = (conversation = {}, type) => {
  const upperType = (type || conversation?.type || "").toUpperCase();

  // Search through common ID keys that may contain the linked listing ID
  const lookupKeys =
    upperType === "HOTEL"
      ? [
          "hotel_id",
          "hotelId",
          "property_id",
          "propertyId",
          "resource_id",
          "resourceId",
          "target_id",
          "targetId",
        ]
      : [
          "accommodation_id",
          "accommodationId",
          "property_id",
          "propertyId",
          "resource_id",
          "resourceId",
          "target_id",
          "targetId",
        ];

  for (const key of lookupKeys) {
    if (conversation?.[key]) return conversation[key];
    if (conversation?.meta?.[key]) return conversation.meta[key];
  }

  // Nested objects (e.g., accommodation.accommodation_id)
  if (upperType === "HOTEL") {
    return (
      conversation?.hotel?.hotel_id ||
      conversation?.hotel?.id ||
      conversation?.property?.hotel_id ||
      conversation?.property?.id
    );
  }

  return (
    conversation?.accommodation?.accommodation_id ||
    conversation?.accommodation?.id ||
    conversation?.property?.accommodation_id ||
    conversation?.property?.id
  );
};

const resolveListingName = async (http, conversation) => {
  const type = (conversation?.type || "").toUpperCase();
  const listingId = normalizeListingId(conversation, type);

  // If the conversation already has a label we trust, skip fetch
  if (deriveConversationLabel(conversation)) return null;
  if (!type || !listingId) return null;

  try {
    if (type === "HOTEL") {
      const { data } = await http.get(`/hotels?hotel_id=${listingId}&limit=1`);
      const hotel =
        data?.data?.[0] || data?.data || data?.hotel || data?.hotels?.[0];
      return hotel?.name || hotel?.title || null;
    }

    if (type === "ACCOMMODATION") {
      const { data } = await http.get(
        `/accommodations?accommodation_id=${listingId}&limit=1`
      );
      const acc =
        data?.data?.[0] ||
        data?.data ||
        data?.accommodation ||
        data?.accommodations?.[0];
      return acc?.name || acc?.title || null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du logement lié:", error);
  }

  return null;
};

export default function MessagingPage() {
  const { user } = useAuthContext();
  const http = useMemo(() => getAxiosInstance(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [conversationLabels, setConversationLabels] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(72);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [socketError, setSocketError] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const hasCreatedFromReservation = useRef(false);

  // Track viewport to apply top offset only on mobile/tablet
  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    const updateHeaderOffset = () => {
      const header = document.querySelector("header");
      if (header?.offsetHeight) setHeaderOffset(header.offsetHeight);
    };

    updateViewport();
    updateHeaderOffset();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, []);

  // Charger les conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingList(true);
        const { data } = await http.get("/messaging/conversations");
        setConversations(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error("Impossible de récupérer les conversations", error);
      } finally {
        setLoadingList(false);
      }
    };
    fetchConversations();
  }, [http]);

  // Créer ou ouvrir une conversation à partir d'une réservation (query params)
  useEffect(() => {
    const reservationId = searchParams.get("reservationId");
    const rawType = (searchParams.get("type") || "").toUpperCase();
    const targetId = searchParams.get("targetId");
    if (!reservationId || !targetId || hasCreatedFromReservation.current) return;

    const type = rawType === "HOTEL" ? "HOTEL" : "ACCOMMODATION";
    const existingConversation =
      conversations.find(
        (c) =>
          c?.reservation_id === reservationId ||
          normalizeListingId(c, type) === targetId
      ) || null;

    const cleanupUrl = () => router.replace("/messages");

    if (existingConversation) {
      setSelectedConversation(existingConversation);
      hasCreatedFromReservation.current = true;
      cleanupUrl();
      return;
    }

    const payload =
      type === "HOTEL"
        ? { type, reservation_id: reservationId, hotel_id: targetId }
        : {
            type,
            reservation_id: reservationId,
            accommodation_id: targetId,
          };

    const createConversation = async () => {
      try {
        const { data } = await http.post("/messaging/conversations", payload);
        const conversation = data || payload;
        hasCreatedFromReservation.current = true;
        setConversations((prev) => {
          const already = prev.some(
            (c) => c.conversation_id === conversation.conversation_id
          );
          return already ? prev : [conversation, ...prev];
        });
        setSelectedConversation(conversation);
      } catch (error) {
        console.error("Impossible de créer la conversation liée:", error);
      } finally {
        cleanupUrl();
      }
    };

    createConversation();
  }, [conversations, http, router, searchParams]);

  // Charger les messages quand la conversation change
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const { data } = await http.get(
          `/messaging/conversations/${selectedConversation.conversation_id}/messages`
        );
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Impossible de récupérer les messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedConversation, http]);

  // Resolve listing titles for conversations (hotel / accommodation)
  useEffect(() => {
    if (!conversations.length) return;

    let cancelled = false;
    const fetchLabels = async () => {
      const updates = {};

      for (const conv of conversations) {
        // Skip if we already resolved it
        if (
          conversationLabels[conv.conversation_id] ||
          deriveConversationLabel(conv)
        ) {
          continue;
        }

        const label = await resolveListingName(http, conv);
        if (label) {
          updates[conv.conversation_id] = label;
        }
      }

      if (!cancelled && Object.keys(updates).length) {
        setConversationLabels((prev) => ({ ...prev, ...updates }));
      }
    };

    fetchLabels();

    return () => {
      cancelled = true;
    };
  }, [conversations, http, conversationLabels]);

  // Close sidebar after selecting a conversation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [selectedConversation]);

  // Connexion socket gérée par le SocketManager centralisé
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      setSocketError("Token manquant pour la socket.");
      return;
    }

    const socket = socketManager.connect(token, {
      onConnect: () => {
        setIsSocketConnected(true);
        setSocketError("");
      },
      onDisconnect: () => {
        setIsSocketConnected(false);
        console.log("Socket déconnectée.");
      },
      onError: (err) => {
        console.error("Socket connection error", err);
        console.log("Connexion socket échouée.");
        setIsSocketConnected(false);
      },
      onMessage: (payload) => {
        setMessages((prevMessages) => {
          const exists = prevMessages.some(
            (m) => m.message_id === payload.message_id || m.id === payload.id
          );
          if (exists) return prevMessages;
          return [...prevMessages, payload];
        });
      },
      onConversation: (conversation) => {
        setConversations((prev) => [conversation, ...prev]);
      },
    });

    if (!socket) {
      setSocketError(
        "Socket.io indisponible ou configuration manquante (URL/token)."
      );
    }

    return () => {
      socketManager.disconnect();
      setIsSocketConnected(false);
    };
  }, []);

  // ✅ CORRECTION : Joindre la room dans un effet séparé
  useEffect(() => {
    if (!selectedConversation || !isSocketConnected) return;

    socketManager.joinConversation(selectedConversation.conversation_id);
  }, [selectedConversation, isSocketConnected]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedConversation) return;

    const payload = {
      conversationId: selectedConversation.conversation_id,
      conversation_id: selectedConversation.conversation_id,
      content,
    };
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      message_id: optimisticId,
      content,
      createdAt: new Date().toISOString(),
      sender_id: user?.user_id,
    };
    let sentOptimistic = false;
    try {
      setSending(true);

      if (socketManager.isConnected()) {
        socketManager.sendMessage(payload);
        setMessages((prev) => [...prev, optimisticMessage]);
        sentOptimistic = true;
      } else {
        const { data } = await http.post("/messaging/messages", payload);
        setMessages((prev) => [...prev, data]);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Impossible d'envoyer le message", error);
      if (sentOptimistic) {
        setMessages((prev) =>
          prev.filter((msg) => msg.message_id !== optimisticId)
        );
      }
    } finally {
      setSending(false);
    }
  };

  const isSender = (msg) => {
    const sender =
      msg?.sender_id ?? msg?.senderId ?? msg?.sender?.user_id ?? msg?.sender;
    return sender && user?.user_id && sender === user.user_id;
  };

  return (
    <div className="flex min-h-screen lg:h-screen bg-gray-50 relative">
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: isDesktop ? 0 : headerOffset }}
      />

      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-x-0 bottom-0 bg-black/30 backdrop-blur-[1px] z-30 lg:hidden"
          style={
            isDesktop
              ? undefined
              : {
                  top: headerOffset,
                  height: `calc(100vh - ${headerOffset}px)`,
                }
          }
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Conversations */}
      <div
        className={`w-80 bg-white border-r border-gray-200 flex flex-col fixed inset-x-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={
          isDesktop
            ? undefined
            : {
                top: headerOffset,
                height: `calc(100vh - ${headerOffset}px)`,
                maxHeight: `calc(100vh - ${headerOffset}px)`,
              }
        }
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="text-primary" />
            Messagerie
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer les conversations"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {socketError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {socketError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Vos conversations
          </h2>

          {loadingList ? (
            <div className="text-center py-8 text-gray-400">Chargement...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Aucune conversation pour l'instant.
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive =
                selectedConversation?.conversation_id === conv.conversation_id;
              return (
                <button
                  key={conv.conversation_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 transition ${
                    isActive
                      ? "bg-primary/5 border-l-4 border-primary"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {conversationLabels[conv.conversation_id] ||
                      deriveConversationLabel(conv) ||
                      "Conversation"}
                  </div>
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {conv?.last_message?.content ||
                      conv?.lastMessage?.content ||
                      "Démarrer la discussion"}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main - Messages */}
      <div
        className="flex-1 flex flex-col min-h-screen lg:h-screen lg:ml-0"
        style={{ paddingTop: isDesktop ? 0 : headerOffset }}
      >
        {selectedConversation ? (
          <>
            <div
              className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-3 sticky"
              style={{ top: isDesktop ? 0 : headerOffset }}
            >
              <div>
                <div className="text-sm text-gray-500">Discussion avec</div>
                <div className="font-semibold text-gray-900">
                  {conversationLabels[selectedConversation.conversation_id] ||
                    deriveConversationLabel(selectedConversation) ||
                    "Conversation"}
                </div>
              </div>
              <button
                className="lg:hidden inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                <Menu className="w-4 h-4" />
                Conversations
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="text-center py-8 text-gray-400">
                  Chargement des messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Pas encore de messages. Lancez la discussion.
                </div>
              ) : (
                messages.map((msg) => {
                  const sentByUser = isSender(msg);
                  return (
                    <div
                      key={msg.message_id || msg.id}
                      className={`flex ${
                        sentByUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                          sentByUser
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <div>{msg?.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            sentByUser
                              ? "text-primary-foreground/70"
                              : "text-gray-500"
                          }`}
                        >
                          {msg?.createdAt
                            ? new Date(msg.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Écrivez votre message..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <SendHorizonal className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez un fil pour afficher et envoyer des messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
